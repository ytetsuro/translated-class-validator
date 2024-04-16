import { generateRules } from "..";
import { validate } from "class-validator";

const validationRules = generateRules({
    IsDefined: 'default message',
    Matches: 'default message',
    IsUUID: 'default message',
    Max: 'default message',
});

describe('should overwritten for validation error message.', () => {
    it('should got translated default validation message when not defined message in validation option.', async () => {
        const input = new class {
            @validationRules.IsDefined()
            property = null;
        };
        input.property = null;

        const actual = await getFirstError(input);

        expect(actual).toBe('default message');
    });

    it('should got overwritten error message when defined message in validation option.', async () => {
        const input = new class {
            @validationRules.IsDefined({message: 'overwritten'})
            property = null;
        };
        input.property = null;

        const actual = await getFirstError(input);

        expect(actual).toBe('overwritten');
    });

    it('should got translated default validation message when omitted all argument by function with greater than two argument.', async () => {
        const input = new class {
            @validationRules.IsUUID()
            property = null;
        };
        input.property = 'foo';

        const actual = await getFirstError(input);

        expect(actual).toBe('default message');
    });

    it('should got translated default validation message when not defined message in validation option in has multi argument function.', async () => {
        const input = new class {
            @validationRules.Matches(/^a$/)
            property = null;
        };
        input.property = null;

        const actual = await getFirstError(input);

        expect(actual).toBe('default message');
    });

    it('should got overwritten error message when defined message in validation option in has multi argument function.', async () => {
        const input = new class {
            @validationRules.Matches(/^a$/, 'i', {message: 'overwritten'})
            property = null;
        };
        input.property = null;

        const actual = await getFirstError(input);

        expect(actual).toBe('overwritten');
    });

    it('should got overwritten validation message when defined message while omitted third argument in validation option in has multi argument function.', async () => {
        const input = new class {
            @validationRules.Matches(/^a$/, {message: 'overwritten'})
            property = null;
        };
        input.property = null;

        const actual = await getFirstError(input);

        expect(actual).toBe('overwritten');
    });

    it('should not throws error when defined primitive argument.', async () => {
        const input = new class {
            @validationRules.Max(1)
            property = null;
        };
        input.property = null;

        const actual = await getFirstError(input);

        expect(actual).toBe('default message');
    });

    async function getFirstError(obj: Object) {
        return Object.values((await validate(obj))[0].constraints ?? {})[0];
    }
});
