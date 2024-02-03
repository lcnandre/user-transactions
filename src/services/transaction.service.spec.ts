import { InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { TransactionService } from './transaction.service';
import { TransactionRepositoryMock } from '../../mocks/transaction.repository.mock';
import { Transaction } from '../entities/transaction';
import { TransactionRepository } from '../repositories/transaction.repository';

describe('TransactionService', () => {
  let service: TransactionService;
  let repository: TransactionRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: TransactionRepository,
          useClass: TransactionRepositoryMock,
        },
      ],
    }).compile();
    await module.init();

    service = module.get<TransactionService>(TransactionService);
    repository = module.get<TransactionRepository>(TransactionRepository);
  });

  it('Should insert a new single transaction', async () => {
    await expect(service.receiveTransactions({} as Transaction)).resolves.toBeUndefined();
  });

  it('Should handle errors on inserting transactions', async () => {
    await expect(service.receiveTransactions(undefined)).rejects.toThrow(InternalServerErrorException);
  });

  it('Should get total transactions by user', async () => {
    await expect(service.getTotalsByUser()).resolves.toEqual([]);
  });

  it('Should handle errors when getting total transactions by user', async () => {
    const totalsMock = jest
      .spyOn(repository, 'getTotalsByUser')
      .mockImplementationOnce(() => Promise.reject(new Error('Test error')));
    await expect(service.getTotalsByUser()).rejects.toThrow(InternalServerErrorException);
    totalsMock.mockRestore();
  });

  it('Should get a summary per category for a single user', async () => {
    await expect(service.getUserSummary('janedoe@email.com')).resolves.toEqual({});
  });

  it('Should handle erros when getting summary per category for user', async () => {
    await expect(service.getUserSummary('error')).rejects.toThrow(InternalServerErrorException);
  });
});
