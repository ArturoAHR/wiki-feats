import { registerDecorator, ValidationOptions } from "class-validator";

export function MaxIsoDate(
  getMaxDate: () => Date,
  validationOptions?: ValidationOptions,
) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: "maxIsoDate",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const maxDate = getMaxDate().toISOString().split("T")[0];

          return value <= maxDate;
        },
        defaultMessage: () =>
          "date must not be greater than the maximum allowed date",
      },
    });
  };
}
