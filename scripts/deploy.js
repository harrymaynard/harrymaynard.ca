const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const BUCKET_NAME = 'harrymaynardca';
const SOURCE_PATH = './dist';

// Load AWS credentials.
AWS.config.loadFromPath("./aws-credentials.json");

// Set the region.
AWS.config.update({region: 'us-east-1'});

// Create S3 service object.
var s3 = new AWS.S3({apiVersion: '2006-03-01'});


const listBucketContents = async () => {
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

const uploadFile = (fileName) => {
  return new Promise((resolve, reject) => {
    // call S3 to retrieve upload file to specified bucket
    var uploadParams = {
      Bucket: BUCKET_NAME,
      Key: '',
      Body: ''
    };

    // Configure the file stream and obtain the upload parameters
    var fileStream = fs.createReadStream(fileName);
    fileStream.on('error', function(error) {
      console.log('File Error', error);
      reject(error);
    });
    uploadParams.Body = fileStream;
    uploadParams.Key = path.basename(fileName);

    console.log('Uploaded file:', uploadParams.Key);
    resolve();
    // call S3 to retrieve upload file to specified bucket
    // s3.upload(uploadParams, function (error, data) {
    //   if (error) {
    //     console.log("Error", error);
    //     reject(error);
    //   } else {
    //     console.log("Upload Success", data.Location);
    //     resolve(data);
    //   }
    // });
  });
};

const getFilesToUpload = (currentDirectory) => {
  let files = [];
  const dir = fs.readdirSync(currentDirectory);

  for (let i=0; i<dir.length; i++) {
    if (fs.lstatSync(currentDirectory + '/' + dir[i]).isDirectory()) {
      const directoryFiles = getFilesToUpload(currentDirectory + '/' + dir[i]);
      directoryFiles.forEach((item) => {
        files.push(item);
      });
    } else {
      files.push(currentDirectory + '/' + dir[i]);
    }
  }
  return files;
};

const run = async () => {
  try {
    //const bucketContents = await listBucketContents();
    //console.log('Bucket contents:', bucketContents);

    //uploadFile('./index.html');
    const filesToUpload = getFilesToUpload(SOURCE_PATH);
    console.log('Files to upload: ', filesToUpload);

    console.log('Deployment complete.');
  } catch(error) {
    console.error('Deployment failed.');
  }
};

run();
