import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  reference: string;

  /**
   * Date the transaction was issued.
   *
   * @type {string}
   */
  @IsDefined()
  @IsDateString()
  @Transform(({ value }) => value.toISOString().substr(0, 10), {
    toClassOnly: true,
  })
  @ApiProperty()
  date: string;

  /**
   * The value the transaction moved.
   * Can be positive for inflow or negative for outflow.
   *
   * @type {string}
   */
  @IsDefined()
  @IsNumberString()
  @Transform(({ value }) => value.toFixed(2), {
    toClassOnly: true,
  })
  @ApiProperty()
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
  @ApiProperty()
  type: TransactionType;

  /**
   * Category/discrimitator for the transaction.
   *
   * @type {string}
   */
  @IsDefined()
  @IsString()
  @ApiProperty()
  category: string;

  /**
   * E-mail address of the account's holder.
   *
   * @type {string}
   */
  @IsDefined()
  @IsEmail()
  @ApiProperty()
  user_email: string;
}
