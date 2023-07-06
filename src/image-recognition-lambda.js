const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition();

exports.handler = async (event) => {
  try {
    const { bucketName, key } = event;

    // Prepare the parameters for object detection
    const params = {
      Image: {
        S3Object: {
          Bucket: bucketName,
          Name: key,
        },
      },
    };

    // Perform object detection using AWS Rekognition
    const response = await rekognition.detectLabels(params).promise();

    // Extract the recognized object labels
    const recognizedObjects = response.Labels.map((label) => label.Name);

    return {
      recognizedObjects,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};