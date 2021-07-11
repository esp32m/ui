import React from 'react';
import * as Yup from 'yup';
import { ObjectShape } from 'yup/lib/object';
import { AnySchema } from 'yup/lib/schema';

export interface Y {
  string: typeof Yup.string;
  number: typeof Yup.number;
  object: typeof Yup.object;
}

interface IValidationContext {
  yup?: ObjectShape;
  addRule: (name: string, schema: AnySchema) => void;
}

function ipv4(this: Yup.StringSchema, message = 'Invalid IP address') {
  return this.matches(/(^(\d{1,3}\.){3}(\d{1,3})$)/, {
    message,
    excludeEmptyString: true,
  }).test('ip', message, (value) => {
    return value === undefined || value?.trim() === ''
      ? true
      : value?.split('.').find((i) => parseInt(i, 10) > 255) === undefined;
  });
}

Yup.addMethod(Yup.string, 'ipv4', ipv4);

interface StringSchema extends Yup.StringSchema {
  ipv4: () => this;
}

export const ValidationContext = React.createContext<IValidationContext>({
  addRule: () => undefined,
});

export const validators = {
  pin: Yup.number().integer().min(1).max(39).notOneOf([20, 24, 28, 29, 30, 31]),
  i2cId: Yup.number().integer().min(1).max(127),
  modbusAddr: Yup.number().integer().min(1).max(247),
  ipv4: (Yup.string() as StringSchema).ipv4(),
};
