import { EntityManager, raw } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';

import { Transaction } from '../entities/transaction';
import { UserSummary } from '../types/user-summary.type';
import { UserTotal } from '../types/user-total.type';

@Injectable()
export class TransactionRepository {
  constructor(private readonly em: EntityManager) {}

  async insertTransactions(transactions: Transaction | Transaction[]): Promise<void> {
    await this.em.createQueryBuilder(Transaction).insert(transactions).onConflict(['reference', 'user_email']).ignore();
  }

  async getTotalsByUser(): Promise<UserTotal[]> {
    const result = await this.em
      .createQueryBuilder(Transaction, 't')
      .select([
        't.user_email',
        raw("sum(case when t.type = 'inflow' then t.amount else 0 end) as `total_inflow`"),
        raw("sum(case when t.type = 'outflow' then t.amount else 0 end) as `total_outflow`"),
      ])
      .groupBy('t.user_email')
      .execute();

    return result as unknown as UserTotal[];
  }

  async getUserSummary(userEmail: string): Promise<UserSummary> {
    const inflowQuery = this.em
      .createQueryBuilder(Transaction, 't')
      .select(['t.category', raw('sum(t.amount) as total')])
      .where({
        user_email: userEmail,
        type: 'inflow',
      })
      .groupBy('t.category')
      .execute();
    const outflowQuery = this.em
      .createQueryBuilder(Transaction, 't')
      .select(['t.category', raw('sum(t.amount) as total')])
      .where({
        user_email: userEmail,
        type: 'outflow',
      })
      .groupBy('t.category')
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
