const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const { extractFileInfo } = require("./util");

// Initialize S3 client with AWS credentials
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// Function to upload an image to S3 bucket
const uploadImage = async (file) => {
  try {
    const ext = extractFileInfo(file.originalname);
    let fileName = `${uuidv4()}${ext}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${process.env.AWS_FOLDER_NAME}/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);
    return { fileName };
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file to S3");
  }
};

// Function to delete an image from S3 bucket
const deleteImage = async (filename) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${process.env.AWS_FOLDER_NAME}/${filename}`,
    };
    const command = new DeleteObjectCommand(params);
    const response = await s3Client.send(command);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting file from S3");
  }
};

module.exports = {
  uploadImage,
  deleteImage,
};
