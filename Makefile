all:	clean build-js build-type build-package;

clean:
	rm -rf ./dist

build-js:	./src/ruleMessages
	./node_modules/.bin/ts-node --project ./tsconfig.bin.json ./bin/build.ts

build-type:	./src
	./node_modules/.bin/tsc --project tsconfig.types.json -d && \
	ls ./.types/languages/*.d.ts | xargs -I FILE mv FILE ./dist/

build-package:	./package.pack.json
	cp -p package.pack.json dist/package.json
