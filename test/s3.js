var assert = require("assert-plus"),
	util = require("util"),
	endpoint = require("../index"),
	file = require("cinovo-logger-file");

describe("s3", function(){
	describe("s3()", function() {
		it("should copy two files to s3", function(done) {
			var log = {
				level: "debug",
				message: "Test",
				origin: "test"
			};
			endpoint.s3(true, true, true, true, "./test/log", "s3_", ".log", 5, 60 * 60, 5, "eu-west-1", "cinovo-logger-aws-test", undefined, undefined, function(err, e) {
				if (err) {
					throw err;
				} else {
					e.on("error", function(err) {
						throw err;
					});
					e.log(log, function(err) {
						if (err) {
							throw err;
						} else {
							setTimeout(function() {
								e.stop(function(err) {
									if (err) {
										throw err;
									} else {
										done();
									}
								});
							}, 1000);
						}
					});
				}
			});
		});
	});
	describe("s3watcher()", function() {
		it("should copy two files to s3", function(done) {
			var log = {
				level: "debug",
				message: "Test",
				origin: "test"
			};
			file(true, true, true, true, "./test/log", "s3watcher_", ".log", 5, 60 * 60, 5, function(err, e) {
				if (err) {
					throw err;
				} else {
					endpoint.s3watcher(e, "eu-west-1", "cinovo-logger-aws-test", undefined, undefined, function(err) {
						if (err) {
							throw err;
						} else {
							e.on("error", function(err) {
								throw err;
							});
							e.log(log, function(err) {
								if (err) {
									throw err;
								} else {
									setTimeout(function() {
										e.stop(function(err) {
											if (err) {
												throw err;
											} else {
												done();
											}
										});
									}, 1000);
								}
							});
						}
					});
				}
			});
		});
	});
});
