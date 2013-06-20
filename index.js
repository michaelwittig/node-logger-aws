var util = require("util"),
	AWS = require("aws-sdk"),
	logger = require("cinovo-logger"),
	assert = require("assert-plus"),
	safelogger = require("./node_modules/cinovo-logger/lib/safejson");

function SQSEndpoint(debug, info, error, critial, region, queueUrl, accessKeyId, secretAccessKey) {
	logger.Endpoint.call(this, debug, info, error, critial);
	this.sqs = new AWS.SQS({region: region, accessKeyId: accessKeyId, secretAccessKey: secretAccessKey});
	this.queueUrl = queueUrl;
}
util.inherits(SQSEndpoint, logger.Endpoint);
SQSEndpoint.prototype.log = function(log, errCallback) {
	this.sqs.sendMessage({
		QueueUrl: this.queueUrl,
		MessageBody: safelogger(log)
	}, errCallback);
};
SQSEndpoint.prototype.stop = function(errCallback) {
	try {
		errCallback();
	} finally  {
		this.emit("stop");
	}
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
		message += safelogger(log.metadata);
	}
	this.sns.publish({
		TopicArn: this.topicArn,
		Message: message,
		Subject: "Log: " + log.level + ": " + log.origin
	}, errCallback);
};
SNSEndpoint.prototype.stop = function(errCallback) {
	try {
		errCallback();
	} finally  {
		this.emit("stop");
	}
};

exports.sns = function(debug, info, error, critial, region, topicArn, accessKeyId, secretAccessKey) {
	assert.string(topicArn, "topicArn");
	assert.optionalString(accessKeyId, "accessKeyId");
	assert.optionalString(secretAccessKey, "secretAccessKey");
	return new SNSEndpoint(debug, info, error, critial, region, topicArn, accessKeyId, secretAccessKey);
};
exports.sqs = function(debug, info, error, critial, region, queueUrl, accessKeyId, secretAccessKey) {
	assert.string(queueUrl, "queueUrl");
	assert.optionalString(accessKeyId, "accessKeyId");
	assert.optionalString(secretAccessKey, "secretAccessKey");
	return new SQSEndpoint(debug, info, error, critial, region, queueUrl, accessKeyId, secretAccessKey);
};

