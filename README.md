# Image Recognition Application

## Project Description
This project is a web application that allows users to upload images and perform image recognition using AWS services. It utilizes AWS S3 for image storage, AWS Rekognition for object detection, AWS DynamoDB for storing image metadata, and AWS SNS for sending notifications. The image recognition process is performed using an AWS Lambda function triggered by the uploaded image.

## Architecture Overview
The application follows a serverless architecture pattern. When a user uploads an image, it is stored in an S3 bucket. The application then triggers an AWS Lambda function, which performs object detection on the uploaded image using AWS Rekognition. The recognized objects are stored in DynamoDB, and a notification is sent via SNS. The web application interacts with these services to provide a seamless user experience.

## Implementation Steps
1. Clone the repository and navigate to the project directory.
2. Install dependencies by running the command: `npm install`.
3. Configure AWS credentials by updating the `.env` file with your AWS credentials and resource details.
4. Start the application by running the command: `npm run start`.

## Deployment
To deploy the application to a serverless environment, follow these steps:

1. Set up an AWS account and create the necessary resources: S3 bucket, DynamoDB table, SNS topic, and Lambda function.
2. Update the `.env` file with the AWS resource details.
3. Build the application by running the command: `npm run build`.
4. Deploy the application using your preferred method, such as AWS CloudFormation or the Serverless Framework.

## Demo
To use the application, follow these steps:

1. Access the web application by visiting `http://localhost:3000` in your browser.
2. Click on the "Upload Image" button and select an image file.
3. After uploading, the image recognition process will start.
4. Once the process is complete, you will see the recognized objects on the screen.
5. The image metadata and notification will be stored in DynamoDB and sent via SNS, respectively.
