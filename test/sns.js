var assert = require("assert-plus"),
	util = require("util"),
	endpoint = require("../index"),
	file = require("cinovo-logger-file");

var topicArn = "test";

describe("sns", function(){
	describe("sns()", function() {
		it("should send an messag to a SNS topic", function(done) {
			var log = {
				level: "debug",
				message: "Test",
				origin: "test"
			};
			var e = endpoint.sns(true, true, true, true, "eu-west-1", topicArn);
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
