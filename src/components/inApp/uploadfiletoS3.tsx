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
  type: string
  body: Blob | File // Define file body type
}

// Function to upload a file to S3 bucket
const uploadFileToS3 = async (file: UploadFile): Promise<string> => {
  const fileName = file.name // Original file name
  const uniqueId = Date.now() // Generate a unique ID (timestamp is better)
  const key = `uploads/${uniqueId}_${fileName}` // Set the key with a prefix 'uploads/'

  const params: AWS.S3.PutObjectRequest = {
    Bucket: 'zynthimage',
    Key: key,
    Body: file.body, // File content
    ContentType: file.type, // File type
  }

  try {
    // Use AWS SDK's managed upload with concurrency options
    const upload = s3.upload(params, {
      partSize: 5 * 1024 * 1024, // 5MB part size
      queueSize: 5, // Concurrency level
    })

    // Progress monitoring (optional)
    upload.on('httpUploadProgress', (progress) => {
      console.log(`Uploaded: ${(progress.loaded / progress.total) * 100}%`)
    })

    const data = await upload.promise()
    console.log('PDF Link: ', data.Location)
    return data.Location // Return the public URL of the uploaded file
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

export default uploadFileToS3
