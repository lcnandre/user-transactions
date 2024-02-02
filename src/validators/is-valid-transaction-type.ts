import { ValidationArguments, registerDecorator } from 'class-validator';

import { TransactionDto } from '../controllers/dtos/transaction.dto';

export function IsValidTransactionType() {
  return function (object: TransactionDto, propertyName: string) {
    registerDecorator({
      name: 'IsValidTransactionType',
      target: object.constructor,
      propertyName,
      validator: {
        validate(value: string, args: ValidationArguments) {
          const amount = parseFloat((args.object as TransactionDto).amount);

          return (value === 'inflow' && amount > 0) || (value === 'outflow' && amount < 0);
        },
      },
    });
  };
}
