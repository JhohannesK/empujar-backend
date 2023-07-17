import { Request, Response } from 'express';
// import FileService from '../services/FileService';
import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import crypto from 'crypto'


const prisma = new PrismaClient();

const generateRandomFileName = (size: number) => crypto.randomBytes(size).toString('hex')

const awsbucketname = process.env.AWS_BUCKET_NAME
const awsaccesskeyid = process.env.AWS_ACCESS_KEY_ID
const awssecretkey = process.env.AWS_SECRET_KEY
const awsregion = process.env.AWS_REGION

// Configure the S3 client object using the credentials.
const s3 = new S3Client({
  region: awsregion,
  credentials: {
    accessKeyId: awsaccesskeyid ?? '',
    secretAccessKey: awssecretkey ?? ''
  }
})


class FileController {
  async uploadFile(req: Request, res: Response): Promise<void> {
    try {
      const { title, description }: { title: string, description: string } = req.body;
      const file = req.file

      // Upload the image to the S3 bucket.
      const uploadParams = {
        Bucket: awsbucketname ?? '',
        Key: generateRandomFileName(16),
        Body: file?.buffer,
        ContentType: file?.mimetype,
      }

      const command = new PutObjectCommand(uploadParams)
      const data = await s3.send(command)

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
