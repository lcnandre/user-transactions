import { UnprocessableEntityException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { TransactionBulkDto } from './dtos/transaction-bulk.dto';
import { TransactionDto } from './dtos/transaction.dto';
import { TransactionController } from './transaction.controller';
import { TransactionServiceMock } from '../../mocks/transaction.service.mock';
import { TransactionService } from '../services/transaction.service';

describe('TransactionController', () => {
  let controller: TransactionController;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TransactionController,
        {
          provide: TransactionService,
          useClass: TransactionServiceMock,
        },
      ],
    }).compile();
    await module.init();

    controller = module.get<TransactionController>(TransactionController);
  });

  it('Should receive a single transaction', async () => {
    await expect(
      controller.receiveTransaction({
        reference: '000051',
        date: '2020-01-03',
        amount: '-51.13',
        type: 'outflow',
        category: 'groceries',
        user_email: 'janedoe@email.com',
      }),
    ).resolves.toBeUndefined();
  });

  it('Should validate the transactions input when receiving', async () => {
    await expect(controller.receiveTransaction(new TransactionDto())).rejects.toThrow(UnprocessableEntityException);
    await expect(controller.receiveBulkTransactions(new TransactionBulkDto())).rejects.toThrow(
      UnprocessableEntityException,
    );
  });

  it('Should receive bulk transactions', async () => {
    await expect(
      controller.receiveBulkTransactions({
        transactions: [
          {
            reference: '000051',
            date: '2020-01-03',
            amount: '-51.13',
            type: 'outflow',
            category: 'groceries',
            user_email: 'janedoe@email.com',
          },
          {
            reference: '000052',
            date: '2020-01-10',
            amount: '2500.72',
            type: 'inflow',
            category: 'salary',
            user_email: 'janedoe@email.com',
          },
        ],
      } as TransactionBulkDto),
    ).resolves.toBeUndefined();
  });

  it('Should get total transactions by user', async () => {
    const result = await controller.getTotalsByUser();
    expect(result).toBeDefined();
    expect(result).toEqual([
      {
        user_email: 'janedoe@email.com',
        total_inflow: '2651.44',
        total_outflow: '-761.85',
      },
      {
        user_email: 'johndoe@email.com',
        total_inflow: '0.00',
        total_outflow: '-51.13',
      },
    ]);
  });

  it('Should get a summary per category for a single user', async () => {
    const result = await controller.getUserSummary('janedoe@email.com');
    expect(result).toBeDefined();
    expect(result).toEqual({
      inflow: {
        salary: '2500.72',
        savings: '150.72',
      },
      outflow: {
        groceries: '-51.13',
        rent: '-560.00',
        transfer: '-150.72',
      },
    });
  });
});
