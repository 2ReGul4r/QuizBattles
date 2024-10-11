import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    originalHash: { type: String, required: true, unique: true },
    fileType: { type: String, required: true },
    fileUrl: { type: String, required: true }
});

const File = mongoose.model("File", fileSchema);
export default File;
