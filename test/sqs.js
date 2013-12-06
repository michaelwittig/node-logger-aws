var assert = require("assert-plus"),
	util = require("util"),
	endpoint = require("../index"),
	file = require("cinovo-logger-file");

var queueUrl = "https://sqs.eu-west-1.amazonaws.com/595296147869/cinovo-logger-aws-test";

describe("sqs", function() {
	"use strict";
	describe("sqs()", function() {
		it("should send an messag to a SNS topic", function(done) {
			var log = {
				level: "debug",
				message: "Test",
				origin: "test"
			},
			e = endpoint.sqs(true, true, true, true, "eu-west-1", queueUrl);
			e.on("error", function(err) {
				throw err;
			});
			e.log(log, function(err) {
				if (err) {
					throw err;
				}
				e.stop(function(err) {
					if (err) {
						throw err;
					}
					done();
				});
			});
		});
	});
});
