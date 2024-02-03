import { plainToInstance } from 'class-transformer';

import { TransactionDto } from './transaction.dto';
import { Transaction } from '../../entities/transaction';

describe('TransactionDto', () => {
  it('Should return dates and amounts as string', () => {
    const result = plainToInstance(TransactionDto, dbObject);

    expect(result).toBeDefined();
    expect(result.date).toEqual('2020-01-13');
    expect(result.amount).toEqual('-560.00');
  });

  it('Should convert dates to Date and amounts to number', () => {
    const result = plainToInstance(Transaction, dtoObject);

    expect(result).toBeDefined();
    expect(result.date).toEqual(new Date('2020-01-13'));
    expect(result.amount).toEqual(-560);
  });

  const dbObject = {
    reference: '000054',
    date: new Date('2020-01-13'),
    amount: -560,
    type: 'outflow',
    category: 'rent',
    user_email: 'janedoe@email.com',
  } as Transaction;

  const dtoObject = new TransactionDto();
  dtoObject.reference = '000054';
  dtoObject.date = '2020-01-13';
  dtoObject.amount = '-560.00';
  dtoObject.type = 'outflow';
  dtoObject.category = 'rent';
  dtoObject.user_email = 'janedoe@email.com';
});
