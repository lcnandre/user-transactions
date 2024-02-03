import { validate } from 'class-validator';

import { TransactionDto } from '../controllers/dtos/transaction.dto';

describe('IsValidTransactionType', () => {
  it('Should validate when positive amount inflow', async () => {
    const dto = createDto('inflow', '500');
    const errors = await validate(dto);

    expect(errors).toBeDefined();
    expect(errors.length).toBe(0);
  });

  it('Should validate when negative amount outflow', async () => {
    const dto = createDto('outflow', '-500');
    const errors = await validate(dto);

    expect(errors).toBeDefined();
    expect(errors.length).toBe(0);
  });

  it('Should not validate when negative amount inflow', async () => {
    const dto = createDto('inflow', '-500');
    const errors = await validate(dto);

    expect(errors).toBeDefined();
    expect(errors.length).toBe(1);
    expect(errors[0].value).toBe('inflow');
    expect(errors[0].toString()).toContain(
      'property type has failed the following constraints: IsValidTransactionType',
    );
  });

  it('Should not validate when positive amount outflow', async () => {
    const dto = createDto('outflow', '500');
    const errors = await validate(dto);

    expect(errors).toBeDefined();
    expect(errors.length).toBe(1);
    expect(errors[0].value).toBe('outflow');
    expect(errors[0].toString()).toContain(
      'property type has failed the following constraints: IsValidTransactionType',
    );
  });

  const createDto = (type: string, amount: string) => {
    const dto = new TransactionDto();
    dto.reference = '000054';
    dto.date = '2020-01-13';
    dto.amount = amount;
    dto.type = type;
    dto.category = 'rent';
    dto.user_email = 'janedoe@email.com';

    return dto;
  };
});
