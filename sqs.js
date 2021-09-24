const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');

AWS.config.update({
  region: 'ap-northeast-2',
});

const app = Consumer.create({
  queueUrl: 'https://sqs.ap-northeast-2.amazonaws.com/972521143148/skpark.fifo',
  handleMessage: async (message) => {
    console.log(message);
    // do some work with `message`
  },
  sqs: new AWS.SQS()
});

app.on('error', (err) => {
  console.error(err.message);
});

app.on('processing_error', (err) => {
  console.error(err.message);
});

app.start();