#!/bin/sh

NVM_VERSION=$(cat client/.nvmrc)

if [ ! $( node --version ) == "v$NVM_VERSION" ] ; then
    echo "Use node $NVM_VERSION first."
fi

if ! which generate-attribution > /dev/null ; then
	npm install -g git+ssh://git@github.com:kconner/oss-attribution-generator.git#performance
	# TODO if my pull request gets merged:
    # npm install -g oss-attribution-generator
fi

generate-attribution -o . -b client server \
	&& rm licenseInfos.json
