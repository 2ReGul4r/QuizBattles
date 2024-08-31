import mongoose from "mongoose";
import Item from "./item.model.js";

const collectionSchema = new mongoose.Schema({
    userID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    items: [Item.schema],
    active: {
        type: Boolean,
        required: true
    }
});

const Collection = mongoose.model("Collection", collectionSchema);

export default Collection;
