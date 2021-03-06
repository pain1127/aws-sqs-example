'use strict';

const env = {
  // Amazon credentials
  aws: {
    region: 'ap-northeast-2',
  },

  sqs: {
    apiVersion: '2012-11-05',
    queueUrl: 'https://sqs.ap-northeast-2.amazonaws.com/972521143148/skpark.fifo'
  }
};


const aws = require('aws-sdk');
const _ = require('lodash');
const QUEUE_URL = env.sqs.queueUrl;

// AWS Configuration
aws.config.update(env.aws);

const sqs = new aws.SQS(env.sqs.apiVersion);

const PARAMS = {
  QueueUrl: QUEUE_URL,
  MaxNumberOfMessages: 10
};

/**
 * SQS에서 받은 메시지를 콘솔에 출력한다.
 **/
 function onReceiveMessage(messages) {
  if (_.isNil(messages.Messages) === false) {
    messages.Messages.forEach(message => {
      console.log(message.Body);
    });
  }

  return messages;
}

/**
 * SQS에서 받은 메시지를 삭제한다.
 **/
function deleteMessages(messages) {
  if (_.isNil(messages.Messages)) {
    return;
  }

  // SQS 삭제에 필요한 형식으로 변환한다.
  const entries = messages.Messages.map((msg) => {
    return {
      Id: msg.MessageId,
      ReceiptHandle: msg.ReceiptHandle,
    };
  });

  // 메시지를 삭제한다.
  return sqs.deleteMessageBatch({
    Entries: entries,
    QueueUrl: QUEUE_URL,
  }).promise();

}

sqs.receiveMessage(PARAMS).promise()
  .then(onReceiveMessage)
  .then(deleteMessages)
  .catch(error => {
    console.error(error);
  });

  