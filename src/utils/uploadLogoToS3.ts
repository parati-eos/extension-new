import AWS from 'aws-sdk'

// Set up AWS S3 credentials
const s3 = new AWS.S3({
  accessKeyId: 'AKIA42PHHRZGAB2RLOU5',
  secretAccessKey: '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',
  region: 'us-east-1',
})

// Define the interface for the file parameter
interface UploadFile {
  name: string
  type: string // Added file type property
}

// Function to upload a file to S3 bucket
const uploadLogoToS3 = async (file: UploadFile): Promise<string> => {
  const fileName = file.name // Get the original file name
  const uniqueId = Math.floor(Math.random() * 1000) // Generate a unique ID
  const key = `uploads/${uniqueId}_${fileName}` // Set the key with a prefix 'uploads/'

  const params: AWS.S3.PutObjectRequest = {
    Bucket: 'zynthimage',
    Key: key,
    Body: file, // No cast needed with proper type definition
    ContentType: file.type, // Set ContentType header based on file type
  }

  try {
    const data = await s3.upload(params).promise()
    return data.Location // Return the public URL of the uploaded file
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

export default uploadLogoToS3
