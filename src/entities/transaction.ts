import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

/**
 * Represents a monetary transaction for a user.
 *
 * @export
 * @class Transaction
 * @type {Transaction}
 */
@Entity()
export class Transaction {
  /**
   * Reference number for the transaction.
   * This number is the unique identifier of the transaction.
   *
   * @type {string}
   */
  @PrimaryKey({ autoincrement: true, columnType: 'varchar(8)' })
  reference: string;

  /**
   * Date the transaction was issued.
   *
   * @type {Date}
   */
  @Property()
  date: Date;

  /**
   * The value the transaction moved.
   * Can be positive for inflow or negative for outflow.
   *
   * @type {number}
   */
  @Property({ columnType: 'decimal(16,2)' })
  amount: number;

  /**
   * Transaction type.
   * Determines if money entered or left the account.
   *
   * @type {('inflow' | 'outflow')}
   */
  @Property({ columnType: 'char(8)' })
  type: 'inflow' | 'outflow';

  /**
   * Category/discrimitator for the transaction.
   *
   * @type {string}
   */
  @Property({ columnType: 'varchar(64)' })
  category: string;

  /**
   * E-mail address of the account's holder.
   *
   * @type {string}
   */
  @Property({ columnType: 'varchar(52)' })
  user_email: string;
}
