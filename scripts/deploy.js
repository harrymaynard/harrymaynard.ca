const AWS = require('aws-sdk');
const fs = require('fs');
const mime = require('mime');

const BUCKET_NAME = 'harrymaynardca';
const SOURCE_PATH = './dist';

// Load AWS credentials.
AWS.config.loadFromPath("./aws-credentials.json");

// Set the region.
AWS.config.update({region: 'us-east-1'});

// Create S3 service object.
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

/**
 * Gets array of file objects the S3 bucket.
 * @returns Promise.
 */
const getBucketContents = async () => {
  return new Promise((resolve, reject) => {
    // Create the parameters for calling listObjects
    const bucketParams = {
      Bucket: BUCKET_NAME,
    };

    // Call S3 to obtain a list of the objects in the bucket
    s3.listObjects(bucketParams, (error, data) => {
      if (error) {
        console.log("Error:", error);
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

/**
 * Empties the S3 bucket with the given data.
 * @param {Object} data 
 */
const emptyBucket = async (data) => {
  const items = data.Contents;
  for (let i = 0; i < items.length; i++) {
    await deleteObject(items[i].Key);
  }
}

/**
 * Deletes a given key from the S3 bucket.
 * @param {String} itemKey 
 * @returns Promise
 */
const deleteObject = (itemKey) => {
  const deleteParams = {
    Bucket: BUCKET_NAME,
    Key: itemKey
  };
  return new Promise((resolve, reject) => {
    s3.deleteObject(deleteParams, function (error, data) {
      if (error) {
        console.log('Delete object failure:', itemKey);
        reject(error);
      } else {
        console.log('Deleted object success:', itemKey);
        resolve(data);
      }
  });
  })
}

/**
 * Given a file name, read and upload said file to S3.
 * @param {String} fileName 
 * @returns Promise.
 */
const uploadFile = (fileName) => {
  return new Promise((resolve, reject) => {
    const s3Key = fileName.replace(SOURCE_PATH + '/', '');

    // Configure upload parameters.
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: '',
      ContentType: mime.getType(fileName),
      ACL: 'public-read'
    };

    // Configure the file stream.
    const fileStream = fs.createReadStream(fileName);
    fileStream.on('error', function(error) {
      console.error('File error:', error);
      reject(error);
    });
    uploadParams.Body = fileStream;

    // call S3 to upload file.
    s3.upload(uploadParams, function (error, data) {
      if (error) {
        console.log("Upload error:", error);
        reject(error);
      } else {
        console.log("Upload success:", data.Location);
        resolve(data);
      }
    });
  });
};

/**
 * Upload an array of file names.
 * @param {Array} files Array of file names. 
 */
const uploadFiles = async (files) => {
  for (let i=0; i<files.length; i++) {
    await uploadFile(files[i]);
  }
}

/**
 * Given a directory, recursively calls itself to get all file names.
 * @param {String} currentDirectory 
 * @returns Array of file names.
 */
const getFilesToUpload = (currentDirectory) => {
  const files = [];
  const dir = fs.readdirSync(currentDirectory);

  // For each file/directory found in the given directory, populate an array of file names.
  for (let i = 0; i < dir.length; i++) {
    // If is a directory, then recursively call this function on the given directory.
    if (fs.lstatSync(currentDirectory + '/' + dir[i]).isDirectory()) {
      const directoryFiles = getFilesToUpload(currentDirectory + '/' + dir[i]);
      directoryFiles.forEach((item) => {
        files.push(item);
      });
    }
    // Else add the file to the array.
    else {
      files.push(currentDirectory + '/' + dir[i]);
    }
  }
  return files;
};

/**
 * Initial function to run.
 */
const run = async () => {
  try {
    // Empty S3 bucket.
    const bucketContents = await getBucketContents();
    await emptyBucket(bucketContents);

    // Upload contents of './dist' to the S3 bucket.
    const filesToUpload = getFilesToUpload(SOURCE_PATH);
    await uploadFiles(filesToUpload);
    
    console.log('Deployment complete.');
  } catch (error) {
    console.error('Deployment failed.');
  }
};

run();
