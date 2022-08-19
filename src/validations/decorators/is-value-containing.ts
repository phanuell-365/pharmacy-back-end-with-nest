import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsValueContaining(
  validValues: Array<string>,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValueContaining',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [validValues],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [validValuesArray] = args.constraints;
          return value.includes(validValuesArray);
        },
        defaultMessage(validationArguments?: ValidationArguments): string {
          return `${propertyName} must contain one of the following values: ${validValues.join(
            ', ',
          )}`;
        },
      },
    });
  };
}
