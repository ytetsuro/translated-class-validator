import {promises} from 'fs';
import { basename, resolve } from 'path';

(async () => {
const files = await promises.readdir(resolve('./src/language/'));

const languageFiles = files.map(async file => {
  const {translation} = await import(`../src/language/${basename(file, '.ts')}`);
  const fileContent = `import {generateRules} from './translation';
import {translation} from './language/${basename(file, '.ts')}';
  
const rules = generateRules(translation);

${[...Object.keys(translation)]
  .map(ruleName => `export const ${ruleName} = rules.${ruleName};`)
  .join('\n')}
`;

  return promises.writeFile(resolve(`./src/${file}`), fileContent);
});

await Promise.all(languageFiles);
})();
