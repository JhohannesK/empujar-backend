import express from 'express';
import FileController from '../controllers/fileController';

const router = express.Router();
const fileController = new FileController();

// POST /files/upload
router.post('/upload', fileController.uploadFile);

// GET /files
router.get('/', fileController.getFiles);

export default router;
