import * as ClassValidator from 'class-validator';
import type { TranslationObject } from "./types/translation";

type TranslationKeys = keyof TranslationObject;
type ClassValidatorType = typeof ClassValidator;

const getDefinedParameters = (callback: (...args: any) => any) => {
  const source = callback
    .toString()
    .replace(/\/\/.*$|\/\*[\s\S]*?\*\/|\s/gm, '');
    
  const params = ([source.match(/\((.*?)\)/) ?? '']
    .at(1) as string).split(',');

  return params.length === 1 && params.at(0) === '' ? [] : params;
};

export const generateRules = (translation: TranslationObject) => Object.fromEntries(
  Object.entries(ClassValidator)
    .filter(
      (row): row is [TranslationKeys, ClassValidatorType[TranslationKeys]] =>
        Object.hasOwn(translation, row[0]),
    )
    .map(([ruleName, rule]) => [
      ruleName,
      (...args: any[]) => {
        const lastParameterIndex = getDefinedParameters(rule).length;
        return (rule as any).apply(
          ClassValidator,
          args.slice(0, lastParameterIndex).concat({
            message: translation[ruleName],
            ...(args.at(lastParameterIndex) ?? {}),
          }),
        );
      },
    ]),
) as Pick<ClassValidatorType, TranslationKeys>;
