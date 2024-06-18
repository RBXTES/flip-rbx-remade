const crypto = require('crypto');
const asyncHandler = require('express-async-handler')
const { validationResult, body } = require('express-validator')
const Coinflip = require('../models/coinflip')
const Account = require('../models/account')
const mongoose = require('mongoose');
const Item = require('../models/item');

exports.create_coinflip = [
    body("value")
        .trim()
        .isNumeric()
        .withMessage('Bet amount must be a number')
        .isFloat({ min: 1 })
        .withMessage('Bet amount must be worth $1 or more')
        .escape(),
    body("coin")
        .trim()
        .isAlpha()
        .withMessage('Coin must only contain letters')
        .isIn(['bux', 'tix'])
        .withMessage('Coin must be bux or tix')
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)
        const playerInfo = await Account.findById(req.user.id)
        if (playerInfo.balance < req.body.value) {
            return res.status(422).send('Your bet amount exceeds your balance')
        }
        if (!errors.isEmpty()) {
            return res.status(400).send(errors.array())
        }
        const session = await mongoose.startSession();
        try {
            session.startTransaction()
            serverSeed = generateRandomSeed();
            const hashedServerSeed = crypto.createHash('sha256').update(serverSeed).digest('hex');
            const queriedLimiteds = await Item.find({ value: { $lte: req.body.value * 500 }}).sort({ value: -1 }).limit(5)
            const randomNumber = Math.floor(Math.random() * 5)
            const newCoinflip = new Coinflip({
                ownerCoin: req.body.coin,
                playerOne: {
                    username: playerInfo.username,
                    avatarId: playerInfo.avatarId,
                    limited: queriedLimiteds[randomNumber]
                },
                playerTwo: null,
                value: Math.round(req.body.value * 100) / 100,
                winnerCoin: null,
                serverSeed: serverSeed,
                hashedServerSeed: hashedServerSeed,
                EOSBlock: null,
                clientSeed: null,
                createdAt: new Date(),
                endedAt: null
            })
            await newCoinflip.save()
            await Account.findByIdAndUpdate(req.user.id, { balance: playerInfo.balance - newCoinflip.value })
            await session.commitTransaction()
            const foundCF = await Coinflip.findOne({ serverSeed: serverSeed }, { serverSeed: 0 })
            res.status(200).send(foundCF)
        } catch (error) {
            await session.abortTransaction()
        }
        session.endSession()
    })
]   

exports.view_coinflip = asyncHandler(async (req, res, next) => {
    const data = await Coinflip.findOne({ _id: req.params.id })
    return res.send(data)
})

exports.join_coinflip = asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send(errors.array())
        }

        const joiningUser = await Account.findOne({ _id: req.user.id })
        const joiningCoinflip = await Coinflip.findOne({ _id: req.body.id })
        if (joiningCoinflip == null) {
            return res.status(404).send('Coinflip Doesn\'t Exist')
        }
        if (joiningUser.balance < joiningCoinflip.value) {
            return res.status(400).send('Insufficient Balance')
        }
        if (joiningCoinflip.winnerCoin != null) {
            return res.status(403).send('Coinflip Has Finished')
        }
        if (joiningCoinflip.playerOne.username == joiningUser.username) {
            return res.status(400).send('You can\'t join yourself!')
        }
        const session = await mongoose.startSession();
        try {
            session.startTransaction()
            const blockInfo = await commitToFutureBlock();
            const clientSeed = blockInfo.head_block_id.toString();

            const concatenatedSeed = clientSeed + joiningCoinflip.serverSeed;
            const hash = crypto.createHash('sha256').update(concatenatedSeed).digest('hex');
            const result = parseInt(hash.slice(0, 1), 16) % 2 === 0 ? 'bux' : 'tix';

            const queriedLimiteds = await Item.find({ value: { $lte: joiningCoinflip.value * 500 }}).sort({ value: -1 }).limit(5)
            const randomNumber = Math.floor(Math.random() * 5)
            await Account.updateOne({ _id: req.user.id }, { balance: joiningUser.balance - joiningCoinflip.value })
            await Coinflip.updateOne({ _id: req.body.id }, { playerTwo: {
                username: joiningUser.username,
                avatarId: joiningUser.avatarId,
                limited: queriedLimiteds[randomNumber]
            },
            clientSeed: clientSeed,
            EOSBlock: blockInfo.head_block_num,
            serverSeed: joiningCoinflip.serverSeed,
            winnerCoin: result,
            endedAt: new Date().getTime()
            })
            if (result == joiningCoinflip.ownerCoin) {
                await Account.updateOne({ username: joiningCoinflip.playerOne.username }, {
                    $inc: { balance: joiningCoinflip.value * 1.85 }
                })
            } else {
                await Account.updateOne({ username: joiningUser.username }, {
                    $inc: { balance: joiningCoinflip.value * 1.8 }
                })
            }
            await session.commitTransaction()
            res.sendStatus(200)
        } catch (error) {
            await session.abortTransaction()
            console.error('Error:', error);
            res.sendStatus(500)
        }
})

function generateRandomSeed() {
    return crypto.randomBytes(16).toString('hex');
}

async function commitToFutureBlock() {
    const response = await fetch('https://eos.greymass.com/');
    return await response.json();
}