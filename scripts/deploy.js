const AWS = require('aws-sdk');

const BUCKET_NAME = 'harrymaynardca';

AWS.config.loadFromPath("./aws-credentials.json");
// Set the region.
AWS.config.update({region: 'us-east-1'});


const listBucketContents = async () => {
  // Create S3 service object
  const s3 = new AWS.S3({apiVersion: '2006-03-01'});

  // Create the parameters for calling listObjects
  const bucketParams = {
    Bucket: BUCKET_NAME,
  };

  // Call S3 to obtain a list of the objects in the bucket
  return s3.listObjects(bucketParams, (err, data) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });
};

const run = async () => {
  listBucketContents();
  console.log('Deploy complete');
};

run();
