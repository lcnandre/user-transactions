import { Transform } from 'class-transformer';
import { IsDateString, IsDefined, IsEmail, IsIn, IsNumberString, IsString } from 'class-validator';

import { IsValidTransactionType } from '../../validators/is-valid-transaction-type';

const transactionTypes = ['inflow', 'outflow'];
export type TransactionType = (typeof transactionTypes)[number];

/**
 * Represents a monetary transaction for a user.
 *
 * @export
 * @class TransactionDto
 * @type {TransactionDto}
 */
export class TransactionDto {
  /**
   * Reference number for the transaction.
   * This number is the unique identifier of the transaction.
   *
   * @type {string}
   */
  @IsDefined()
  @IsString()
  reference: string;

  /**
   * Date the transaction was issued.
   *
   * @type {string}
   */
  @IsDefined()
  @IsDateString()
  @Transform(({ value }) => new Date(value), {
    toClassOnly: true,
  })
  date: string;

  /**
   * The value the transaction moved.
   * Can be positive for inflow or negative for outflow.
   *
   * @type {string}
   */
  @IsDefined()
  @IsNumberString()
  @Transform(({ value }) => parseFloat(value), {
    toClassOnly: true,
  })
  amount: string;

  /**
   * Transaction type.
   * Determines if money entered or left the account.
   *
   * @type {TransactionType}
   */
  @IsDefined()
  @IsString()
  @IsIn(transactionTypes)
  @IsValidTransactionType()
  type: TransactionType;

  /**
   * Category/discrimitator for the transaction.
   *
   * @type {string}
   */
  @IsDefined()
  @IsString()
  category: string;

  /**
   * E-mail address of the account's holder.
   *
   * @type {string}
   */
  @IsDefined()
  @IsEmail()
  user_email: string;
}
