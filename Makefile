default: test

jslint:
	@echo "jslint"
	@jslint *.js

circular:
	@echo "circular"
	@madge --circular --format amd .

mocha:
	@echo "mocha"
	@rm -f test/log/*
	@mocha test/*
	@echo

test: mocha circular
	@echo "test"
	@echo

outdated:
	@echo "outdated modules?"
	@npmedge
