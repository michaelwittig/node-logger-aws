var util = require("util"),
	AWS = require("aws-sdk"),
	logger = require("cinovo-logger");

function SQSEndpoint(debug, info, error, critial, region, queueUrl, accessKeyId, secretAccessKey) {
	logger.Endpoint.call(this, debug, info, error, critial);
	this.sqs = new AWS.SQS({region: region, accessKeyId: accessKeyId, secretAccessKey: secretAccessKey});
	this.queueUrl = queueUrl;
}
util.inherits(SQSEndpoint, logger.Endpoint);
SQSEndpoint.prototype.log = function(log, errCallback) {
	var message;
	if (log.metadata) {
		try {
			message = JSON.stringify(log);
		} catch (err) {
			errCallback(err);
			return;
		}
	}
	this.sqs.sendMessage({
		QueueUrl: this.queueUrl,
		MessageBody: message
	}, errCallback);
};

function SNSEndpoint(debug, info, error, critial, region, topicArn, accessKeyId, secretAccessKey) {
	logger.Endpoint.call(this, debug, info, error, critial);
	this.sns = new AWS.SNS({region: region, accessKeyId: accessKeyId, secretAccessKey: secretAccessKey});
	this.topicArn = topicArn;
}
util.inherits(SNSEndpoint, logger.Endpoint);
SNSEndpoint.prototype.log = function(log, errCallback) {
	var message = "Level: " + log.level + "\n";
	message += "Date: " + log.date + "\n";
	message += "Pid: " + log.pid + "\n";
	message += "Origin: " + log.origin + "\n";
	if (log.fullOrigin !== undefined) {
		message += "FullOrigin: " + util.inspect(log.fullOrigin) + "\n";
	}
	message += "Message: " + log.message + "\n";
	if (log.metadata) {
		message += "Metadata:\n";
		try {
			message += JSON.stringify(log.metadata);
		} catch (err) {
			errCallback(err);
			return;
		}
	}
	this.sns.publish({
		TopicArn: this.topicArn,
		Message: message,
		Subject: "Log: " + log.level + ": " + log.origin
	}, errCallback);
};

exports.sns = function(debug, info, error, critial, region, topicArn, accessKeyId, secretAccessKey) {
	return new SNSEndpoint(debug, info, error, critial, region, topicArn, accessKeyId, secretAccessKey);
};
exports.sqs = function(debug, info, error, critial, region, queueUrl, accessKeyId, secretAccessKey) {
	return new SQSEndpoint(debug, info, error, critial, region, queueUrl, accessKeyId, secretAccessKey);
};

