import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    picture: {
        data: Buffer,
        required: true
    },
    rarity: {
        type: String,
        enum: ["Common", "Uncommon", "Rare", "Epic", "Legendary"],
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    slotIDs: [Number],
    attributes: {
        health: Number,
        damage: Number,
        speed: Number,
        luck: Number,
        resistance: Number,
        accuracy: Number,
        dodging: Number
    }
});

const Item = mongoose.model("Item", itemSchema);

export default Item;
