===

This project is under development.

Please feel free to PullRequest and Issue.

---

This repository provides error message-translated validation rules for class-validator.
Very loosely wrapped class-validator.

<!-- toc -->
* [Basic Using](#basic-using)
* [Support Language](#support-language)
* [Contribute](#contribute)
* [License](#license)
<!-- tocstop -->


# Basic Using

```sh-session
$ npm i class-validator translated-class-validator
```

This repository only wraps class-validator with the default message of rules of class-validator in each language.
Therefore, you can import the language you want to read and use it in exactly the same way as class-validator.
Therefore, please refer to class-validator for usage.

However, only the import statement should load this package as shown below.
You can also import by language, so specify `lang` in `translated-class-validator/lang` as the language you want to translate.

```typescript
import {
  validate,
  validateOrReject,
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
} from 'translated-class-validator/ja';
```

If you are already using `class-validator`, you can apply the translated default error messages without any effect at all by replacing `translated-class-validator` with sed or similar.

```diff
- import {IsDefined} from 'class-validator';
+ import {IsDefined} from 'translated-class-validator/ja';
```

# Support Language

|Language|exports|
|:--|:--|
|Japanese|ja|

Add your country's language if you feel like it. :)

# Contribute

I want to your contribute for language.
The way to contribute is very simple.

Please add the translated files for each rule to [`src/ruleMessages`](./src/ruleMessages) in this repository and PR them.

The translation will be completed if you define the default message for the required rule, stating the following.

```typescript
import type { TranslationObject } from "../types/translation";

export const messages: TranslationObject = {
  IsDefined: '$property is required.',
  //... It can be only some of the rules or all of the rules.
};
```

# License

Copyright (c) 2024 Tetsuro Yoshikawa Licensed under the MIT license.
