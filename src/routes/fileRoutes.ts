import express from 'express';
import FileController from '../controllers/fileController';
import multer from 'multer'

const router = express.Router();
const fileController = new FileController();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// POST /files/upload
router.post('/upload', upload.single('image'), fileController.uploadFile);

// GET /files
router.get('/', fileController.getFiles);

export default router;
