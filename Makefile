install:
	npm install

start:
	npm run babel-node -- 'src/bin/pgdownloader.js'

test:
	npm test

build:
	npm run build

publish:
	npm publish

lint:
	npm run eslint ./src/**

