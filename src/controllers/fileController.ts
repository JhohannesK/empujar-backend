import { Request, Response } from 'express';
import File from '../models/Files';
// import FileService from '../services/FileService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class FileController {
  async uploadFile(req: Request, res: Response): Promise<void> {
    try {
      const { title, description }: { title: string, description: string } = req.body;
      const file = req.file

      const uploadfile = prisma.file.create({
        data: {
          title: title,
          description: description,
          userid: req.body.userid
        }
      })

      res.json({ message: 'File uploaded successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }

  async getFiles(req: Request, res: Response) {
    try {
      const allFiles = prisma.file.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      })
      res.json(allFiles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }

  async deleteFile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleteFile = prisma.file.delete({
        where: {
          id: (id)
        }
      })
      res.json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
}

export default FileController;
