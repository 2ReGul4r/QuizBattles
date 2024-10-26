import path from "path";
import multer from "multer";
import { compressImage, compressAudio, calculateFileHash } from "../utils/media.js";
import File from "../models/file.model.js";
import { uploadFolder, imagesFolder, audiosFolder } from "../server.js";
import fs from "fs-extra";

// Multer-Setup für den Dateiupload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + file.originalname;
        cb(null, uniqueSuffix);
    }
});

const upload = multer({ storage });

export const uploadFile = async (req, res) => {
    try {
        const file = req.file;
        const fileType = req.body.fileType;
        if (!file || !fileType) {
            return res.status(400).json({ message: "File or file type missing" }); // Fehlerbehandlung
        }
        // 1. Berechne den Hash der Originaldatei
        const originalHash = await calculateFileHash(file.path);

        // 2. Prüfe, ob der Hash bereits in der Datenbank vorhanden ist
        const existingFile = await File.findOne({ originalHash });

        if (existingFile) {
            return res.json({ fileUrl: existingFile.fileUrl });
        }

        // 3. Komprimiere die Datei
        let fileUrl;
        if (fileType === "picture") {
            const compressedFilePath = path.join(imagesFolder, `${originalHash}.jpeg`);
            try {
                await compressImage(file.path, compressedFilePath);
            } catch (error) {
                fs.createReadStream(file.path).pipe(fs.createWriteStream(compressedFilePath)); 
            }

            await fs.unlinkSync(file.path);

            fileUrl = `https://mylevel.eu/uploads/images/${originalHash}.jpeg`;
        } else if (fileType === "audio") {
            const compressedFilePath = path.join(audiosFolder, `${originalHash}.wav`);
            try {
                await Promise.resolve(compressAudio(file.path, compressedFilePath));
            } catch (error) {
                fs.createReadStream(file.path).pipe(fs.createWriteStream(compressedFilePath)); 
            }

            await fs.unlinkSync(file.path);

            fileUrl = `https://mylevel.eu/uploads/audios/${originalHash}.wav`;
        } else {
            return res.status(400).json({ error: "File type is not supported." });
        }

        // 4. Speichere den Hash der Originaldatei und den Pfad der komprimierten Datei in der Datenbank
        const newFile = new File({
            originalHash,
            fileType: file.mimetype,
            fileUrl
        });

        await newFile.save();

        // 5. Gib die URL der komprimierten Datei zurück
        res.json({ fileUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "File upload failed" });
    }
};

// Exportiere den Upload-Middleware für die Verwendung in Routen
export const uploadMiddleware = upload.single("file");
