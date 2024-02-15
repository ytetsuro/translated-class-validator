import * as ClassValidator from 'class-validator';
import type { TranslationObject } from "../types/translation";

type TranslationKeys = keyof TranslationObject;
type ClassValidatorType = typeof ClassValidator;
type ClassValidatorValidationRule<Rule extends TranslationKeys> = Rule extends keyof ClassValidatorType ? ClassValidatorType[Rule] : never;

export function generateRules<T extends Partial<TranslationObject>>(messages: T) {
  return Object.fromEntries(
  Object.entries(ClassValidator)
    .filter(
      (row): row is [TranslationKeys, ClassValidatorType[TranslationKeys]] =>
        row[0] in messages,
    )
    .map(([ruleName, rule]) => [
      ruleName,
      (...args: any[]) => {
        const allArgumentsCount = getDefinedParameters(rule).length;
        const validationOptionArgumentIndex = getValidationOptionArgumentIndex(args, allArgumentsCount);

        return (rule as any).apply(
          ClassValidator,
          args.concat(Array(allArgumentsCount)).slice(0, validationOptionArgumentIndex).concat({
            message: messages[ruleName],
            ...(args.at(validationOptionArgumentIndex) ?? {}),
          }),
        );
      },
    ]),
  ) as {[key in TranslationKeys]: ClassValidatorValidationRule<key>};
}

function getDefinedParameters(callback: (...args: any) => any) {
  const source = callback
    .toString()
    .replace(/\/\/.*$|\/\*[\s\S]*?\*\/|\s/gm, '');
    
  const params = (source.match(/\((.*?)\)/)?.[1] ?? '' as string).split(',');

  return params.length === 1 && params[0] === '' ? [] : params;
};

function getValidationOptionArgumentIndex(args: unknown[], allArgumentsCount: number) {
  const validationOptionArgumentIndex = args.findLastIndex(arg => ClassValidator.isValidationOptions(arg));
  
  if (validationOptionArgumentIndex === -1) {
    return allArgumentsCount - 1;
  }

  return validationOptionArgumentIndex;
}