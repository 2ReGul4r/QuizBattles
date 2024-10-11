import express from 'express';
import { uploadFile, uploadMiddleware } from '../controllers/media.controller.js';

const router = express.Router();

// Route für den Datei-Upload
router.post('/upload-file', uploadMiddleware, uploadFile); // Füge die Middleware hier hinzu

export default router;
