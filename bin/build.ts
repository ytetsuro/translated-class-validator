import {promises} from 'fs';
import { basename, resolve } from 'path';
import * as esbuild from 'esbuild';

(async () => {
const files = await promises.readdir(resolve('./src/ruleMessages/'));

await generateLanguageFiles(files);
await generateBundledFiles(files);
})();


async function generateLanguageFiles(files: string[]) {
  const languageFiles = files.map(async file => {
    const {messages} = await import(`../src/ruleMessages/${basename(file, '.ts')}`);
    const fileContent = `import {generateRules} from '../translation';
  import {messages} from '../ruleMessages/${basename(file, '.ts')}';
  export * from 'class-validator';
    
  const rules = generateRules(messages);
  
  ${[...Object.keys(messages)]
    .map(ruleName => `export const ${ruleName} = rules.${ruleName};`)
    .join('\n')}
  `;
  
    return promises.writeFile(resolve(`./src/languages/${file}`), fileContent);
  });
  
  await Promise.all(languageFiles);
}

async function generateBundledFiles(files: string[]) {
  return Promise.all(files.flatMap(file => [
    esbuild.build({
      entryPoints: [resolve(`./src/languages/${file}`)],
      bundle: true,
      //minify: true,
      sourcemap: true,
      format: 'esm',
      packages: 'external',
      outfile: `dist/${basename(file, '.ts')}.esm.js`,
    }),
    esbuild.build({
      entryPoints: [resolve(`./src/languages/${file}`)],
      bundle: true,
      //minify: true,
      sourcemap: true,
      format: 'esm',
      packages: 'external',
      outfile: `dist/${basename(file, '.ts')}.mjs`,
    }),
    esbuild.build({
      entryPoints: [resolve(`./src/languages/${file}`)],
      bundle: true,
      platform: 'node',
      packages: 'external',
      //minify: true,
      sourcemap: true,
      outfile: `dist/${basename(file, '.ts')}.cjs.js`,
    }),
  ]));
}
