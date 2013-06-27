var util = require("util"),
	AWS = require("aws-sdk"),
	logger = require("cinovo-logger"),
	assert = require("assert-plus"),
	lib = require("cinovo-logger-lib"),
	fs = require("fs");

function SQSEndpoint(debug, info, error, critial, region, queueUrl, accessKeyId, secretAccessKey) {
	logger.Endpoint.call(this, debug, info, error, critial, "SQS:" + queueUrl);
	this.sqs = new AWS.SQS({region: region, accessKeyId: accessKeyId, secretAccessKey: secretAccessKey});
	this.queueUrl = queueUrl;
}
util.inherits(SQSEndpoint, logger.Endpoint);
SQSEndpoint.prototype.log = function(log, errCallback) {
	this.sqs.sendMessage({
		QueueUrl: this.queueUrl,
		MessageBody: lib.safejson(log)
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
	logger.Endpoint.call(this, debug, info, error, critial, "SNS:" + topicArn);
	this.sns = new AWS.SNS({region: region, accessKeyId: accessKeyId, secretAccessKey: secretAccessKey});
	this.topicArn = topicArn;
}
util.inherits(SNSEndpoint, logger.Endpoint);
SNSEndpoint.prototype.log = function(log, errCallback) {
	var message = "Level: " + log.level + "\n";
	message += "Date: " + log.date + "\n";
	message += "Hostname: " + log.hostname + "\n";
	message += "Pid: " + log.pid + "\n";
	message += "Origin: " + log.origin + "\n";
	if (log.fullOrigin !== undefined) {
		message += "FullOrigin: " + util.inspect(log.fullOrigin) + "\n";
	}
	message += "Message: " + log.message + "\n";
	if (log.metadata) {
		message += "Metadata:\n";
		message += lib.safejson(log.metadata);
	}
	this.sns.publish({
		TopicArn: this.topicArn,
		Message: message,
		Subject: "Log[ " + log.level + "]: " + log.origin + " (" + this.name + ")"
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
	assert.string(region, "region");
	assert.string(topicArn, "topicArn");
	assert.optionalString(accessKeyId, "accessKeyId");
	assert.optionalString(secretAccessKey, "secretAccessKey");
	return new SNSEndpoint(debug, info, error, critial, region, topicArn, accessKeyId, secretAccessKey);
};
exports.sqs = function(debug, info, error, critial, region, queueUrl, accessKeyId, secretAccessKey) {
	assert.string(region, "region");
	assert.string(queueUrl, "queueUrl");
	assert.optionalString(accessKeyId, "accessKeyId");
	assert.optionalString(secretAccessKey, "secretAccessKey");
	return new SQSEndpoint(debug, info, error, critial, region, queueUrl, accessKeyId, secretAccessKey);
};
function fileNameFromFile(file) {
	var parts = file.split("/");
	return parts[parts.length - 1];
}
function s3copy(s3, bucket, file, callback) {
	fs.readFile(file, function(err, buffer) {
		if (err) {
			callback(err);
		} else {
			s3.putObject({
				Bucket: bucket,
				Key: fileNameFromFile(file),
				Body: buffer
			}, callback);
		}
	});
}
function s3watcher(endpoint, region, bucket, accessKeyId, secretAccessKey) {
	assert.string(region, "region");
	assert.string(bucket, "bucket");
	assert.optionalString(accessKeyId, "accessKeyId");
	assert.optionalString(secretAccessKey, "secretAccessKey");
	endpoint.s3 = new AWS.S3({region: region, accessKeyId: accessKeyId, secretAccessKey: secretAccessKey});
	var oldStop = endpoint.stop;
	endpoint.stop = function(errCallback) {
		endpoint.once("stop", function(file) {
			s3copy(endpoint.s3, bucket, file, function(err) {
				if (err) {
					errCallback(err);
				} else {
					errCallback();
				}
			});
		});
		oldStop.call(endpoint, function(err) {
			if (err) {
				errCallback(err);
			}
		});
	};
	endpoint.on("rollFile", function(file) {
		s3copy(endpoint.s3, bucket, file, function(err, data) {
			if (err) {
				endpoint.emit("error", err);
			} else {
				endpoint.emit("s3Copy", file, data.ETag);
			}
		});
	});
}
exports.s3 = function(debug, info, error, critial, dir, fileSuffix, filePrefix, maxFileSize, maxFileAge, maxFiles, region, bucket, accessKeyId, secretAccessKey, callback) {
	require("cinovo-logger-file")(debug, info, error, critial, dir, fileSuffix, filePrefix, maxFileSize, maxFileAge, maxFiles, function(err, endpoint) {
		if (err) {
			callback(err);
		} else {
			s3watcher(endpoint, region, bucket, accessKeyId, secretAccessKey);
			callback(undefined, endpoint);
		}
	});
};
exports.s3watcher = s3watcher;
