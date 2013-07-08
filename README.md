`````
                                                   ___
       __                                         /\_ \
  ___ /\_\    ___     ___   __  __    ___         \//\ \     ___      __      __      __   _ __
 /'___\/\ \ /' _ `\  / __`\/\ \/\ \  / __`\  _______\ \ \   / __`\  /'_ `\  /'_ `\  /'__`\/\`'__\
/\ \__/\ \ \/\ \/\ \/\ \L\ \ \ \_/ |/\ \L\ \/\______\\_\ \_/\ \L\ \/\ \L\ \/\ \L\ \/\  __/\ \ \/
\ \____\\ \_\ \_\ \_\ \____/\ \___/ \ \____/\/______//\____\ \____/\ \____ \ \____ \ \____\\ \_\
 \/____/ \/_/\/_/\/_/\/___/  \/__/   \/___/          \/____/\/___/  \/___L\ \/___L\ \/____/ \/_/
                                                                      /\____/ /\____/
                                                                      \_/__/  \_/__/
`````

# cinovo-logger-aws

AWS S3, SNS or SQS endpoint for [cinovo-logger](https://github.com/cinovo/node-logger).

## Getting started

### At first you must install and require the logger.

    npm install cinovo-logger

### Next you must require the module

`````javascript
var logger = require("cinovo-logger");
`````

### Append cinovo-logger-aws endpoint

	npm install cinovo-logger-aws

In your JavaScript code append the S3 endpoint.

`````javascript
require("cinovo-logger-aws").s3(true, true, true, true, "./log", "s3_", ".log", 1024 * 1024, 60 * 60, 5, "eu-west-1", "my-bucket-name", "my/folder", undefined, undefined, function(err, endpoint) {
	if (err) {
		throw err;
	} else {
		logger.append(endpoint);
	}
}
`````

and / or append the SNS endpoint.

`````javascript
logger.append(require("cinovo-logger-aws").sns(true, true, true, true, "eu-west-1", "topicArn"));
`````

and / or append the SQS endpoint.

`````javascript
logger.append(require("cinovo-logger-aws").sqs(true, true, true, true, "eu-west-1", "queueUrl"));
`````

### Log something

`````javascript
logger.debug("all values are ok");
logger.info("myscript", "all values are ok");
logger.error("myscript", "some values are not ok", {a: 10, b: 20});
logger.exception("myscript", "some values are not ok", new Error("error"));
logger.critical("myscript", "all values are not ok", {a: 10, b: 20}, function(err) { ... });
`````

### Done

Now you can log to AWS S3, SNS or SQS endpoints.

## API

### sns(debug, info, error, critial, region, topicArn, [accessKeyId, secretAccessKey])

Sync creates an SNS endpoint.

* `debug`: Boolean - true if the endpoint should log debug level
* `info`: Boolean - true if the endpoint should log info level
* `error`: Boolean - true if the endpoint should log error level
* `critical`: Boolean - true if the endpoint should log critical level
* `region`: String - your AWS region
* `topicArn`: String - the topic you want to publish to
* `accessKeyId`: String - your AWS access key ID (optional)
* `secretAccessKey`: String - your AWS secret access key (optional)

`return`: Endpoint - use the endpoint like this logger.append(endpoint)

### sqs(debug, info, error, critial, region, queueUrl, [accessKeyId, secretAccessKey])

Sync creates an SQS endpoint.

* `debug`: Boolean - true if the endpoint should log debug level
* `info`: Boolean - true if the endpoint should log info level
* `error`: Boolean - true if the endpoint should log error level
* `critical`: Boolean - true if the endpoint should log critical level
* `region`: String - your AWS region
* `queueUrl`: String - the URL of the SQS queue to take action on
* `accessKeyId`: String - your AWS access key ID (optional)
* `secretAccessKey`: String - your AWS secret access key (optional)

`return`: Endpoint - use the endpoint like this logger.append(endpoint)

### s3(debug, info, error, critial, dir, fileSuffix, filePrefix, maxFileSize, maxFileAge, maxFiles, region, bucket, bucketDir, accessKeyId, secretAccessKey, callback)

Async creates an [cinovo-logger-file](https://github.com/cinovo/node-logger-file) endpoint to copy log files into S3 on roll or stop.

* `debug`: Boolean - true if the endpoint should log debug level
* `info`: Boolean - true if the endpoint should log info level
* `error`: Boolean - true if the endpoint should log error level
* `critical`: Boolean - true if the endpoint should log critical level
* `dir`: String - directory in which log files are saved.
* `filePrefix`: String -
* `fileSuffix`: String -
* `maxFileSize`: Number - bytes
* `maxFileAge`: Number - seconds
* `maxFiles`: Number - Maximum Number of files in dir (oldest are removed first)
* `region`: String - your AWS region
* `bucket`: String - your AWS bucke name
* `bucketDir`: String or Function - your AWS bucket "directory" (e. g. logs/ or logs/a/b/)
* `accessKeyId`: String - your AWS access key ID (optional)
* `secretAccessKey`: String - your AWS secret access key (optional)
* `callback`: Function(err, endpoint) - fired if the endpoint is ready to use
    * `err`: Error (optional)
    * `endpoint`: Endpoint - use the endpoint like this logger.append(endpoint)

### s3watcher(endpoint, region, bucket, bucketDir, [accessKeyId, secretAccessKey])

Sync takes an [cinovo-logger-file](https://github.com/cinovo/node-logger-file) endpoint to copy log files into S3 on roll or stop.

* `endpoint`: FileEndpoint
* `region`: String - your AWS region
* `bucket`: String - your AWS bucke name
* `bucketDir`: String or Function - your AWS bucket "directory" (e. g. logs/ or logs/a/b/)
* `accessKeyId`: String - your AWS access key ID (optional)
* `secretAccessKey`: String - your AWS secret access key (optional)

#### Events

##### error(err)

If the file can not be copied to S3 during roll.

* `err`: Error

##### s3Copy(file, etag)

* `file`: String - name of file that was copied (without path)
* `etag`: String - AWS entity tag for the uploaded object

### Events

#### stop()

When the endpoint is stopped.
