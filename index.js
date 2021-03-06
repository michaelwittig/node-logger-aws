var util = require("util"),
	AWS = require("aws-sdk"),
	lib = require("cinovo-logger-lib"),
	assert = require("assert-plus"),
	fs = require("fs");

function SQSEndpoint(debug, info, error, critial, region, queueUrl, accessKeyId, secretAccessKey) {
	"use strict";
	lib.Endpoint.call(this, debug, info, error, critial, "SQS:" + queueUrl);
	this.sqs = new AWS.SQS({region: region, accessKeyId: accessKeyId, secretAccessKey: secretAccessKey});
	this.queueUrl = queueUrl;
}
util.inherits(SQSEndpoint, lib.Endpoint);
SQSEndpoint.prototype._log = function(log, callback) {
	"use strict";
	this.sqs.sendMessage({
		QueueUrl: this.queueUrl,
		MessageBody: lib.safejson(log)
	}, callback);
};
SQSEndpoint.prototype._stop = function(callback) {
	"use strict";
	callback();
};

function SNSEndpoint(debug, info, error, critial, region, topicArn, accessKeyId, secretAccessKey) {
	"use strict";
	lib.Endpoint.call(this, debug, info, error, critial, "SNS:" + topicArn);
	this.sns = new AWS.SNS({region: region, accessKeyId: accessKeyId, secretAccessKey: secretAccessKey});
	this.topicArn = topicArn;
}
util.inherits(SNSEndpoint, lib.Endpoint);
SNSEndpoint.prototype._log = function(log, callback) {
	"use strict";
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
	}, callback);
};
SNSEndpoint.prototype._stop = function(callback) {
	"use strict";
	callback();
};

exports.sns = function(debug, info, error, critial, region, topicArn, accessKeyId, secretAccessKey) {
	"use strict";
	assert.string(region, "region");
	assert.string(topicArn, "topicArn");
	assert.optionalString(accessKeyId, "accessKeyId");
	assert.optionalString(secretAccessKey, "secretAccessKey");
	return new SNSEndpoint(debug, info, error, critial, region, topicArn, accessKeyId, secretAccessKey);
};
exports.sqs = function(debug, info, error, critial, region, queueUrl, accessKeyId, secretAccessKey) {
	"use strict";
	assert.string(region, "region");
	assert.string(queueUrl, "queueUrl");
	assert.optionalString(accessKeyId, "accessKeyId");
	assert.optionalString(secretAccessKey, "secretAccessKey");
	return new SQSEndpoint(debug, info, error, critial, region, queueUrl, accessKeyId, secretAccessKey);
};
function fileNameFromFile(file) {
	"use strict";
	var parts = file.split("/");
	return parts[parts.length - 1];
}
function s3copy(s3, bucket, bucketDir, file, callback) {
	"use strict";
	fs.readFile(file, function(err, buffer) {
		if (err) {
			callback(err);
		} else {
			var s;
			if (typeof bucketDir === "string") {
				s = bucketDir;
			} else if (typeof bucketDir === "function") {
				s = bucketDir();
			}
			s3.putObject({
				Bucket: bucket,
				Key: s + fileNameFromFile(file),
				Body: buffer
			}, callback);
		}
	});
}
function s3watcher(endpoint, region, bucket, bucketDir, accessKeyId, secretAccessKey) {
	"use strict";
	assert.string(region, "region");
	assert.string(bucket, "bucket");
	var s, oldStop = endpoint.stop;
	if (typeof bucketDir === "string") {
		if (bucketDir.length > 0) {
			if (bucketDir[0] === "/") { // remove leading slash
				bucketDir = bucketDir.substr(1);
			}
			if (bucketDir[bucketDir.length - 1] !== "/") { // append closing slash
				bucketDir += "/";
			}
		}
	} else if (typeof bucketDir === "function") {
		s = bucketDir();
		if (s.length > 0) {
			if (s[0] === "/") {
				assert.fail("bucketDir function returns string with leading /");
			}
			if (s[s.length - 1] !== "/") {
				assert.fail("bucketDir function returns string without closing /");
			}
		}
	} else {
		assert.fail("bucketDir must be string or function");
	}
	assert.optionalString(accessKeyId, "accessKeyId");
	assert.optionalString(secretAccessKey, "secretAccessKey");
	endpoint.s3 = new AWS.S3({region: region, accessKeyId: accessKeyId, secretAccessKey: secretAccessKey});
	endpoint.stop = function(callback) {
		endpoint.once("_stop", function(file) {
			s3copy(endpoint.s3, bucket, bucketDir, file, function(err) {
				if (err) {
					callback(err);
				} else {
					callback();
				}
			});
		});
		oldStop.call(endpoint, function(err) {
			if (err) {
				callback(err);
			}
		});
	};
	endpoint.on("rollFile", function(file) {
		s3copy(endpoint.s3, bucket, bucketDir, file, function(err, data) {
			if (err) {
				endpoint.emit("error", err);
			} else {
				endpoint.emit("s3Copy", file, data.ETag);
			}
		});
	});
}
exports.s3 = function(debug, info, error, critial, dir, fileSuffix, filePrefix, maxFileSize, maxFileAge, maxFiles, region, bucket, bucketDir, accessKeyId, secretAccessKey, callback) {
	"use strict";
	require("cinovo-logger-file")(debug, info, error, critial, dir, fileSuffix, filePrefix, maxFileSize, maxFileAge, maxFiles, function(err, endpoint) {
		if (err) {
			callback(err);
		} else {
			s3watcher(endpoint, region, bucket, bucketDir, accessKeyId, secretAccessKey);
			callback(undefined, endpoint);
		}
	});
};
exports.s3watcher = s3watcher;
