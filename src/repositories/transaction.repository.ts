import { EntityManager, raw } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';

import { Transaction } from '../entities/transaction';
import { UserSummary } from '../types/user-summary.type';
import { UserTotal } from '../types/user-total.type';

/**
 * Database repository for transactions.
 *
 * @export
 * @class TransactionRepository
 * @typedef {TransactionRepository}
 */
@Injectable()
export class TransactionRepository {
  /**
   * Creates an instance of TransactionRepository.
   *
   * @constructor
   * @param {EntityManager} em an instance of the MikroORM entity manager.
   */
  constructor(private readonly em: EntityManager) {}

  /**
   * Inserts transactions on the database.
   *
   * @async
   * @param {(Transaction | Transaction[])} transactions single or multiple transactions to be inserted on the DB.
   * @returns {Promise<void>}
   */
  async insertTransactions(transactions: Transaction | Transaction[]): Promise<void> {
    await this.em.createQueryBuilder(Transaction).insert(transactions).onConflict(['reference', 'user_email']).ignore();
  }

  /**
   * Retrieves a list of all transactions of the DB
   * grouped by user and aggregated per type.
   *
   * @async
   * @returns {Promise<UserTotal[]>}
   */
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

  /**
   * Retrieves an aggregation of all transactioned amounts
   * for a single user, grouped by category.
   *
   * @async
   * @param {string} userEmail User's email address to filter.
   * @returns {Promise<UserSummary>}
   */
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
