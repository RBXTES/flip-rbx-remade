const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemSchema = new Schema ({
    itemId: { type: String, required: true },
    itemName: { type: String, required: true },
    value: { type: Number, required: true }
})

module.exports = mongoose.model("Item", itemSchema)