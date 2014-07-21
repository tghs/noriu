#!/bin/bash

export NODE_PATH="$PWD:$NODE_PATH"
export NODE_PATH="$PWD/test/target:$NODE_PATH"

ERROR=0

pushd test > /dev/null
for TEST in test*.js; do
	# Run each test separately - this gives them each a fresh module cache
	nodeunit $TEST || ERROR=1
done
popd > /dev/null

exit $ERROR
