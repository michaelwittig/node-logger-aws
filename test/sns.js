var assert = require("assert-plus"),
	util = require("util"),
	endpoint = require("../index"),
	file = require("cinovo-logger-file");

var topicArn = "arn:aws:sns:eu-west-1:595296147869:cinovo-logger-aws-test";

describe("sns", function() {
	"use strict";
	describe("sns()", function() {
		it("should send an messag to a SNS topic", function(done) {
			var log = {
				level: "debug",
				message: "Test",
				origin: "test"
			},
			e = endpoint.sns(true, true, true, true, "eu-west-1", topicArn);
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
