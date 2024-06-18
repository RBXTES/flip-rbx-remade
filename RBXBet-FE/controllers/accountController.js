const asyncHandler = require('express-async-handler')
const { validationResult, body } = require('express-validator')
const Account = require('../models/account')
const bcrypt = require('bcryptjs')
const debug = require('debug')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { createHash } = require('node:crypto')

dotenv.config();

exports.create_account_post = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('The email you provided is not in the correct format')
        .isLength({ max: 35 })
        .withMessage('Your email must not exceed 35 characters')
        .escape(),
    body('username')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Your username must be 3 or more characters long')
        .isLength({ max: 15 })
        .withMessage('Your usermame must not exceed 15 characters')
        .escape(),
    body('password')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Your password must be 6 or more characters long')
        .isLength({ max: 35 })
        .withMessage('Your password must not exceed 35 characters')
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)
        const usernameExists = await Account.find({ username: req.body.username })
        const emailExists = await Account.find({ email: req.body.email })

        if (usernameExists.length > 0) {
            return res.status(409).send('Username already exists')
        } else if (emailExists.length > 0) {
            return res.status(409).send('Email already exists')
        }

        if (!errors.isEmpty()) {
            console.log(errors.array())
            res.status(400).send(errors.array())
            return
        }
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if (err) {
                return debug(err)
            }
            const hashedEmail = createHash('sha256').update(req.body.email).digest('hex')
            if (err) {
                return debug(err)
            }
            const account = new Account({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                avatarId: hashedEmail,
                role: 'Member'
            })
            await account.save()
            const user = await Account.findOne({ username: req.body.username });
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.send(token)
        })
    })
]

exports.login_account_post = asyncHandler(async (req, res, next) => {
    const user = await Account.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send("Incorrect email")
    };
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
        return res.status(400).send("Incorrect password");
    };
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.send(token)
})

exports.authenticateToken = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        return res.sendStatus(401)
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
    next()
    })
})

exports.auto_login = asyncHandler(async (req, res, next) => {
    const userData = await Account.findOne({ _id: req.user.id })
    res.send(userData)
})

exports.getUserData = async (jsonwebtoken) => {
    if (jsonwebtoken == null) return
    const token = jwt.verify(jsonwebtoken, process.env.JWT_SECRET)
    const userData = await Account.findOne({ _id: token.id }, { username: 1, avatarId: 1, role: 1, balance: 1, _id: 0 })
    return userData
}