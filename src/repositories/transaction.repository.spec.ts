import { MikroORM } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EntityManager, SqliteDriver } from '@mikro-orm/sqlite';
import { Test } from '@nestjs/testing';

import { TransactionRepository } from './transaction.repository';
import { Transaction } from '../entities/transaction';

describe('TransactionRepository', () => {
  let orm: MikroORM;
  let repository: TransactionRepository;
  let entityManager: EntityManager;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot({
          driver: SqliteDriver,
          dbName: ':memory:',
          entities: ['./dist/entities'],
          entitiesTs: ['./src/entities'],
          allowGlobalContext: true,
          extensions: [Migrator],
        }),
      ],
      providers: [TransactionRepository],
    }).compile();
    await module.init();

    orm = module.get<MikroORM>(MikroORM);
    repository = module.get<TransactionRepository>(TransactionRepository);
    entityManager = module.get<EntityManager>(EntityManager);

    const migrator = orm.getMigrator();
    await migrator.up();
  });

  afterAll(async () => {
    entityManager.flush();
    orm.close();
  });

  beforeEach(async () => {
    await entityManager.createQueryBuilder(Transaction).truncate().execute();
  });

  it('Should insert a new single transaction', async () => {
    await repository.insertTransactions({
      reference: '000051',
      date: new Date('2020-01-03'),
      amount: -51.13,
      type: 'outflow',
      category: 'groceries',
      user_email: 'janedoe@email.com',
    });

    const result = await entityManager.createQueryBuilder(Transaction).select('*').execute('get');

    expect(result).toBeDefined();
    expect(result.user_email).toBe('janedoe@email.com');
    expect(result.type).toBe('outflow');
    expect(result.date).toEqual(new Date('2020-01-03'));
    expect(result.amount).toBe(-51.13);
  });

  it('Should insert a batch of transactions', async () => {
    await repository.insertTransactions([
      {
        reference: '000051',
        date: new Date('2020-01-03'),
        amount: -51.13,
        type: 'outflow',
        category: 'groceries',
        user_email: 'janedoe@email.com',
      },
      {
        reference: '000052',
        date: new Date('2020-01-10'),
        amount: 2500.72,
        type: 'inflow',
        category: 'salary',
        user_email: 'janedoe@email.com',
      },
    ]);

    const result = await entityManager.createQueryBuilder(Transaction).select('*').execute('all');

    expect(result).toBeDefined();
    expect(result.length).toBe(2);
  });

  it('Should ignore duplicate references', async () => {
    await repository.insertTransactions([
      {
        reference: '000051',
        date: new Date('2020-01-03'),
        amount: -51.13,
        type: 'outflow',
        category: 'groceries',
        user_email: 'janedoe@email.com',
      },
      {
        reference: '000051',
        date: new Date('2020-01-03'),
        amount: -51.13,
        type: 'outflow',
        category: 'groceries',
        user_email: 'janedoe@email.com',
      },
    ]);

    const result = await entityManager.createQueryBuilder(Transaction).select('*').execute('all');

    expect(result).toBeDefined();
    expect(result.length).toBe(1);
  });

  it('Should get total transactions by user', async () => {
    await populateDb();
    const result = await repository.getTotalsByUser();

    expect(result).toBeDefined();
    expect(result.length).toBe(2);

    const janeTotals = result.find((r) => r.user_email === 'janedoe@email.com');
    expect(janeTotals.total_inflow.toFixed(2)).toBe('2651.44');
    expect(janeTotals.total_outflow.toFixed(2)).toBe('-761.85');

    const johnTotals = result.find((r) => r.user_email === 'johndoe@email.com');
    expect(johnTotals.total_inflow.toFixed(2)).toBe('0.00');
    expect(johnTotals.total_outflow.toFixed(2)).toBe('-51.13');
  });

  it('Should get a summary per category for a single user', async () => {
    await populateDb();
    const result = await repository.getUserSummary('janedoe@email.com');

    expect(result).toBeDefined();
    expect(result.inflow).toHaveProperty('salary');
    expect(result.inflow.salary.toFixed(2)).toBe('2500.72');
    expect(result.inflow).toHaveProperty('savings');
    expect(result.inflow.savings.toFixed(2)).toBe('150.72');

    expect(result.outflow).toHaveProperty('groceries');
    expect(result.outflow.groceries.toFixed(2)).toBe('-51.13');
    expect(result.outflow).toHaveProperty('rent');
    expect(result.outflow.rent.toFixed(2)).toBe('-560.00');
    expect(result.outflow).toHaveProperty('transfer');
    expect(result.outflow.transfer.toFixed(2)).toBe('-150.72');
  });

  const populateDb = async () => {
    await repository.insertTransactions([
      {
        reference: '000051',
        date: new Date('2020-01-03'),
        amount: -51.13,
        type: 'outflow',
        category: 'groceries',
        user_email: 'janedoe@email.com',
      },
      {
        reference: '000052',
        date: new Date('2020-01-10'),
        amount: 2500.72,
        type: 'inflow',
        category: 'salary',
        user_email: 'janedoe@email.com',
      },
      {
        reference: '000053',
        date: new Date('2020-01-10'),
        amount: -150.72,
        type: 'outflow',
        category: 'transfer',
        user_email: 'janedoe@email.com',
      },
      {
        reference: '000054',
        date: new Date('2020-01-13'),
        amount: -560,
        type: 'outflow',
        category: 'rent',
        user_email: 'janedoe@email.com',
      },
      {
        reference: '000051',
        date: new Date('2020-01-04'),
        amount: -51.13,
        type: 'outflow',
        category: 'other',
        user_email: 'johndoe@email.com',
      },
      {
        reference: '000689',
        date: new Date('2020-01-10'),
        amount: 150.72,
        type: 'inflow',
        category: 'savings',
        user_email: 'janedoe@email.com',
      },
    ]);
  };
});
