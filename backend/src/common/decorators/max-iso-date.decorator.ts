import { registerDecorator, ValidationOptions } from "class-validator";
import { getIsoDate } from "../helpers/iso-date.utils";

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
          const maxDate = getIsoDate(getMaxDate());

          return value <= maxDate;
        },
        defaultMessage: () =>
          "date must not be greater than the maximum allowed date",
      },
    });
  };
}
