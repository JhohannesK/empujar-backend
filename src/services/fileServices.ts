import crypto from 'crypto'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { Multer } from 'multer'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'


const awsbucketname = process.env.AWS_BUCKET_NAME
const awsaccesskeyid = process.env.AWS_ACCESS_KEY_ID
const awssecretkey = process.env.AWS_SECRET_KEY
const awsregion = process.env.AWS_REGION



// Configure the S3 client object using the credentials.
export const s3 = new S3Client({
  region: awsregion,
  credentials: {
    accessKeyId: awsaccesskeyid ?? '',
    secretAccessKey: awssecretkey ?? ''
  }
})

export const uploadToS3 = ({ file, fileName }: { file: Express.Multer.File | undefined, fileName: string }) => {
  // Upload the image to the S3 bucket.
  const uploadParams = {
    Bucket: awsbucketname ?? '',
    Key: fileName,
    Body: file?.buffer,
    ContentType: file?.mimetype,
  }

  const command = new PutObjectCommand(uploadParams)
  return s3.send(command)
}

export const getFileStream = async (fileKey: string) => {
  const downloadParams = {
    Key: fileKey,
    Bucket: awsbucketname ?? ''
  }

  const command = new GetObjectCommand(downloadParams)
  const url = await getSignedUrl(s3, command)
  return url
}