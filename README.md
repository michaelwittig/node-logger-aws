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

AWS SNS or SQS endpoint for [cinovo-logger](https://github.com/cinovo/node-logger).

## Getting started

### At first you must install and require the logger.

    npm install cinovo-logger

### Next you must require the module

`````javascript
var logger = require("cinovo-logger");
`````

### Append cinovo-logger-aws endpoint

	npm install cinovo-logger-aws

In your JavaScript code append the SNS endpoint.

`````javascript
logger.append(require("cinovo-logger-aws").sns(true, true, true, true, "topicArn"));
`````

and / or append the SQS endpoint.

`````javascript
logger.append(require("cinovo-logger-aws").sqs(true, true, true, true, "queueUrl"));
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

Now you can log to AWS SNS or SQS endpoints.

## API

### sns(debug, info, error, critial, region, topicArn, [accessKeyId, secretAccessKey])

Sync creates an SNS Endpoint.

* `debug`: Boolean - true if the endpoint should log debug level
* `info`: Boolean - true if the endpoint should log info level
* `error`: Boolean - true if the endpoint should log error level
* `critical`: Boolean - true if the endpoint should log critical level
* `topicArn`: String - the topic you want to publish to.
* `accessKeyId`: String - your AWS access key ID. (optional)
* `secretAccessKey`: String - your AWS secret access key. (optional)

`return`: Endpoint - Endpoint - use the endpoint like this logger.append(endpoint)

### sqs(debug, info, error, critial, region, queueUrl, [accessKeyId, secretAccessKey])

Sync creates an SQS Endpoint.

* `debug`: Boolean - true if the endpoint should log debug level
* `info`: Boolean - true if the endpoint should log info level
* `error`: Boolean - true if the endpoint should log error level
* `critical`: Boolean - true if the endpoint should log critical level
* `queueUrl`: String - the URL of the SQS queue to take action on.
* `accessKeyId`: String - your AWS access key ID. (optional)
* `secretAccessKey`: String - your AWS secret access key. (optional)

`return`: Endpoint - Endpoint - use the endpoint like this logger.append(endpoint)

### Events

#### stop()

When the endpoint is stopped.
