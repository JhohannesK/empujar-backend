import { Request, Response } from 'express';
// import FileService from '../services/FileService';
import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';
import { uploadToS3 } from '../services/fileServices';


const prisma = new PrismaClient();

class FileController {
  async uploadFile(req: Request, res: Response): Promise<void> {
    try {
      const { title, description }: { title: string, description: string } = req.body;
      const file = req.file

      await uploadToS3({ file })

      if ((file?.mimetype === 'image/png') || (file?.mimetype === 'image/jpeg')) {
        const fileBuffer = await sharp(file?.buffer).resize({ width: 500, height: 500 }).png().toBuffer()
      }

      const uploadfile = await prisma.file.create({
        data: {
          title: title,
          description: description,
          userid: req.body.userid,
          user: {
            connect: {
              id: req.body.userid,
              email: req.body.email
            }
          }
        }
      })


      res.status(200).json({ message: 'File uploaded successfully' });
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
      const deleteFile = await prisma.file.delete({
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
