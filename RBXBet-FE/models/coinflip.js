const mongoose = require('mongoose')
const Schema = mongoose.Schema

const coinflipSchema = new Schema ({
    ownerCoin: { type: String, required: true },
    playerOne: {
        username: { type: String, required: true },
        avatarId: { type: String, required: true },
        limited: { type: Object, required: true }
    },
    playerTwo: {
        username: { type: String },
        avatarId: { type: String },
        limited: { type: Object }
    },
    value: { type: Number, required: true },
    winnerCoin: { type: String },
    serverSeed: { type: String, required: true },
    hashedServerSeed: { type: String, required: true },
    clientSeed: { type: String },
    EOSBlock: { type: String },
    createdAt: { type: Date, required: true },
    endedAt: { type: Date }
})

module.exports = mongoose.model("Coinflip", coinflipSchema)