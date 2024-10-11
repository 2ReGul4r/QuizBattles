import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import ffmpegPath from 'ffmpeg-static';

// Setze den Pfad zu ffmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

// Bildkomprimierung
export const compressImage = async (inputPath, outputPath) => {
    const fileContent = fs.readFileSync(inputPath);
    await sharp(fileContent)
        .jpeg({ quality: 80 })
        .toFile(outputPath);
};
  
// Audiokomprimierung
export const compressAudio = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .audioBitrate('128k')
            .save(outputPath)
            .on('end', resolve)
            .on('error', reject);
    });
};

export const calculateFileHash = async (filePath) => {
    const fileBuffer = await fs.promises.readFile(filePath);
    return crypto.createHash('md5').update(fileBuffer).digest('hex');
};
