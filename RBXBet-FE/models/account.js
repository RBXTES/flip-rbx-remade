const mongoose = require('mongoose')
const Schema = mongoose.Schema

const accountSchema = new Schema ({
    email: { type: String, required: true },
    username: { type: String, required: true, minLength: 2 },
    password: { type: String, required: true, minLength: 6 },
    balance: { type: Number, default: 0.00 },
    role: { type: String, default: 'Member' },
    avatarId: { type: String, required: true },
    wagered: { type: Number, default: 0.00 },
    deposited: { type: Number, default: 0.00 },
    withdrawn: { type: Number, default: 0.00 },
    last_message: { type: Date, default: new Date() },
    join_date: { type: Date, default: new Date() }
})

module.exports = mongoose.model("Account", accountSchema)