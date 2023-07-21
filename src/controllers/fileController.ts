import { Request, Response } from 'express';
// import FileService from '../services/FileService';
import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';
import { deleteFileOnS3, getFileStream, uploadToS3 } from '../services/fileServices';
import crypto from 'crypto';


const prisma = new PrismaClient();

// Generate a random file name.
const generateRandomFileName = (size: number) => crypto.randomBytes(size).toString('hex')

class FileController {
  async uploadFile(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, email }: { title: string, description: string, email: string } = req.body;
      const file = req.file
      const fileName = generateRandomFileName(16)

      const existingUser = await prisma.user.findUnique({
        where: {
          email
        }
      })

      if (!existingUser) {
        res.status(400).json({ message: 'User does not exist' });
        throw new Error('User does not exist');
      }

      await uploadToS3({ file, fileName })

      if ((file?.mimetype === 'image/png') || (file?.mimetype === 'image/jpeg')) {
        const fileBuffer = await sharp(file?.buffer).resize({ width: 500, height: 500 }).png().toBuffer()
      }

      await prisma.file.create({
        data: {
          title,
          description,
          fileName,
          email: {
            connect: {
              email,
            }
          },
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
      const allFiles = await prisma.file.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      })

      for (let i = 0; i < allFiles.length; i++) {
        const file = allFiles[i];
        const fileStream = await getFileStream(file.fileName)
        file.imageUrl = fileStream
      }

      res.json(allFiles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }

  async deleteFile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.file.delete({
        where: {
          id: (id)
        }
      })

      await deleteFileOnS3(id)
      res.json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
}

export default FileController;
