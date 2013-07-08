var assert = require("assert-plus"),
	util = require("util"),
	endpoint = require("../index"),
	file = require("cinovo-logger-file");

var queueUrl = "test";

describe("sqs", function(){
	describe("sqs()", function() {
		it("should send an messag to a SNS topic", function(done) {
			var log = {
				level: "debug",
				message: "Test",
				origin: "test"
			};
			var e = endpoint.sqs(true, true, true, true, "eu-west-1", queueUrl);
			e.on("error", function(err) {
				throw err;
			});
			e.log(log, function(err) {
				if (err) {
					throw err;
				} else {
					e.stop(function(err) {
						if (err) {
							throw err;
						} else {
							done();
						}
					});
				}
			});
		});
	});
});
