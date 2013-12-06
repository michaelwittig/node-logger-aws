var assert = require("assert-plus"),
	util = require("util"),
	endpoint = require("../index");

describe("API", function() {
	"use strict";
	describe("sns()", function() {
		it("should work if all params are set", function(){
			endpoint.sns(true, true, true, true, "eu-west-1", "test");
		});
	});
	describe("sqs()", function() {
		it("should work if all params are set", function(){
			endpoint.sqs(true, true, true, true, "eu-west-1", "test");
		});
	});
});
