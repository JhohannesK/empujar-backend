// const { S3Client } = require('@aws-sdk/client-s3')
// import multer from 'multer';
// import multerS3 from 'multer-s3';
// import dotenv from 'dotenv';

// dotenv.config();

// aws.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });

// const s3 = new aws.S3();

// const upload = multer({
//   storage: multerS3({
//     s3,
//     bucket: process.env.S3_BUCKET_NAME,
//     metadata: (req, file, cb) => {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: (req, file, cb) => {
//       cb(null, Date.now().toString());
//     },
//   }),
// });

// class FileService {
//   static uploadFileMiddleware = upload.single('file');
// }

// export default FileService;
