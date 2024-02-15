all:	clean build-js build-config;

clean:
	rm -rf ./dist

build-js:	./src/ruleMessages
	./node_modules/.bin/ts-node --project ./tsconfig.bin.json ./bin/build.ts

build-config:	./package.pack.json ./README.md
	cp -p package.pack.json dist/package.json && \
	cp -p README.md dist/

