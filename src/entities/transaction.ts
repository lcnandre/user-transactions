import { Entity, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';

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
  @PrimaryKey()
  reference: string;

  /**
   * E-mail address of the account's holder.
   *
   * @type {string}
   */
  @PrimaryKey()
  user_email: string;

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
  @Property()
  amount: number;

  /**
   * Transaction type.
   * Determines if money entered or left the account.
   *
   * @type {('inflow' | 'outflow')}
   */
  @Property()
  type: 'inflow' | 'outflow';

  /**
   * Category/discrimitator for the transaction.
   *
   * @type {string}
   */
  @Property()
  category: string;

  [PrimaryKeyProp]?: ['reference', 'user_email'];
}
