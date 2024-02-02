import { InjectEntityManager } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';

import { Transaction } from '../entities/transaction';
import { UserSummary } from '../types/user-summary.type';
import { UserTotal } from '../types/user-total.type';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectEntityManager('db')
    private readonly em: EntityManager,
  ) {}

  async insertTransactions(transactions: Transaction | Transaction[]): Promise<void> {
    await this.em.persist(transactions).flush();
  }

  async getTotalsByUser(): Promise<UserTotal[]> {
    const result = await this.em
      .createQueryBuilder(Transaction)
      .select([
        'user_email',
        "sum(case when type = 'inflow' then amount else 0 end) as total_inflow",
        "sum(case when type = 'outflow' then amount else 0 end) as total_outflow",
      ])
      .groupBy('user_email')
      .execute();

    return result as unknown as UserTotal[];
  }

  async getUserSummary(userEmail: string): Promise<UserSummary> {
    const inflowQuery = this.em
      .createQueryBuilder(Transaction)
      .select(['category', 'sum(amount) as total'])
      .where({
        user_email: userEmail,
        type: 'inflow',
      })
      .groupBy('category')
      .execute();
    const outflowQuery = this.em
      .createQueryBuilder(Transaction)
      .select(['category', 'sum(amount) as total'])
      .where({
        user_email: userEmail,
        type: 'outflow',
      })
      .groupBy('category')
      .execute();

    const inflowResult = await inflowQuery;
    const outflowResult = await outflowQuery;

    return {
      inflow: inflowResult.reduce(
        (obj, item: any) => ({
          ...obj,
          [item.category]: item.total,
        }),
        {},
      ),
      outflow: outflowResult.reduce(
        (obj, item: any) => ({
          ...obj,
          [item.category]: item.total,
        }),
        {},
      ),
    } as UserSummary;
  }
}
