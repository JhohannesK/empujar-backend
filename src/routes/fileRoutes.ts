import express from 'express';
import FileController from '../controllers/fileController';
import multer from 'multer'
import { isAdmin } from '../middleware/adminMiddleware';
import { authenticateToken } from '../middleware/authenticateToken';

const router = express.Router();
const fileController = new FileController();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// POST /files/upload
router.post('/upload', authenticateToken, upload.single('image'), fileController.uploadFile);

// GET /files
router.get('/', fileController.getFiles);

// DELETE /files/:id
router.delete('/:id', authenticateToken, isAdmin, fileController.deleteFile);

export default router;
