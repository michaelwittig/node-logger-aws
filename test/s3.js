var assert = require("assert-plus"),
	util = require("util"),
	endpoint = require("../index"),
	file = require("cinovo-logger-file"),
	expect = require("expect.js");

var bucket = "cinovo-logger-aws-test";

describe("s3", function() {
	"use strict";
	describe("s3()", function() {
		it("should copy two files to s3 into test/", function(done) {
			var log = {
				level: "debug",
				message: "Test",
				origin: "test"
			};
			endpoint.s3(true, true, true, true, "./test/log", "s3_", ".log", 5, 60 * 60, 5, "eu-west-1", bucket, "test/", undefined, undefined, function(err, e) {
				if (err) {
					throw err;
				}
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
		it("should copy two files to s3 into /test", function(done) {
			var log = {
				level: "debug",
				message: "Test",
				origin: "test"
			};
			endpoint.s3(true, true, true, true, "./test/log", "s3_", ".log", 5, 60 * 60, 5, "eu-west-1", bucket, "/test", undefined, undefined, function(err, e) {
				if (err) {
					throw err;
				}
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
		it("should copy two files to s3 into /test/", function(done) {
			var log = {
				level: "debug",
				message: "Test",
				origin: "test"
			};
			endpoint.s3(true, true, true, true, "./test/log", "s3_", ".log", 5, 60 * 60, 5, "eu-west-1", bucket, "/test/", undefined, undefined, function(err, e) {
				if (err) {
					throw err;
				}
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
		it("should copy two files to s3 into test", function(done) {
			var log = {
				level: "debug",
				message: "Test",
				origin: "test"
			};
			endpoint.s3(true, true, true, true, "./test/log", "s3_", ".log", 5, 60 * 60, 5, "eu-west-1", bucket, "test", undefined, undefined, function(err, e) {
				if (err) {
					throw err;
				}
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
		it("should copy two files to s3", function(done) {
			var log = {
				level: "debug",
				message: "Test",
				origin: "test"
			};
			endpoint.s3(true, true, true, true, "./test/log", "s3_", ".log", 5, 60 * 60, 5, "eu-west-1", bucket, "", undefined, undefined, function(err, e) {
				if (err) {
					throw err;
				}
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
		it("should copy two files to s3 into test/", function(done) {
			var log = {
				level: "debug",
				message: "Test",
				origin: "test"
			};
			endpoint.s3(true, true, true, true, "./test/log", "s3_", ".log", 5, 60 * 60, 5, "eu-west-1", bucket, function() { return "test/"; }, undefined, undefined, function(err, e) {
				if (err) {
					throw err;
				}
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
		it("should copy two files to s3", function(done) {
			var log = {
				level: "debug",
				message: "Test",
				origin: "test"
			};
			endpoint.s3(true, true, true, true, "./test/log", "s3_", ".log", 5, 60 * 60, 5, "eu-west-1", bucket, function() {return "";}, undefined, undefined, function(err, e) {
				if (err) {
					throw err;
				}
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
				}
				e.on("error", function(err) {
					throw err;
				});
				endpoint.s3watcher(e, "eu-west-1", bucket, "test");
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
		it("should fail with leading /", function(done) {
			file(true, true, true, true, "./test/log", "s3watcher_", ".log", 5, 60 * 60, 5, function(err, e) {
				if (err) {
					throw err;
				}
				e.on("error", function(err) {
					throw err;
				});
				expect(function() {
					endpoint.s3watcher(e, "eu-west-1", bucket, function() {return "/test"; });
				}).to.throwException();
				done();
			});
		});
		it("should fail without closing /", function(done) {
			file(true, true, true, true, "./test/log", "s3watcher_", ".log", 5, 60 * 60, 5, function(err, e) {
				if (err) {
					throw err;
				}
				e.on("error", function(err) {
					throw err;
				});
				expect(function() {
					endpoint.s3watcher(e, "eu-west-1", bucket, function() {return "test"; });
				}).to.throwException();
				done();
			});
		});
		it("should fail with leading / and closing /", function(done) {
			file(true, true, true, true, "./test/log", "s3watcher_", ".log", 5, 60 * 60, 5, function(err, e) {
				if (err) {
					throw err;
				}
				e.on("error", function(err) {
					throw err;
				});
				expect(function() {
					endpoint.s3watcher(e, "eu-west-1", bucket, function() {return "/test/"; });
				}).to.throwException();
				done();
			});
		});
	});
});
