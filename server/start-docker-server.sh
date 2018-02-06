#!/bin/sh

docker build -t none-pizza-with-left-brains-server . \
	&& docker run -i -t -p 2657:2657 none-pizza-with-left-brains-server
