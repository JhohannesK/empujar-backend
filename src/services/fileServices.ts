import crypto from 'crypto'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { Multer } from 'multer'


const awsbucketname = process.env.AWS_BUCKET_NAME
const awsaccesskeyid = process.env.AWS_ACCESS_KEY_ID
const awssecretkey = process.env.AWS_SECRET_KEY
const awsregion = process.env.AWS_REGION

// Generate a random file name.
export const generateRandomFileName = (size: number) => crypto.randomBytes(size).toString('hex')

// Configure the S3 client object using the credentials.
export const s3 = new S3Client({
  region: awsregion,
  credentials: {
    accessKeyId: awsaccesskeyid ?? '',
    secretAccessKey: awssecretkey ?? ''
  }
})

export const uploadToS3 = ({ file }: { file: Express.Multer.File | undefined }) => {
  // Upload the image to the S3 bucket.
  const uploadParams = {
    Bucket: awsbucketname ?? '',
    Key: generateRandomFileName(16),
    Body: file?.buffer,
    ContentType: file?.mimetype,
  }

  const command = new PutObjectCommand(uploadParams)
  return s3.send(command)
}