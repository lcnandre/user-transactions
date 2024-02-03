import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDefined, ValidateNested } from 'class-validator';

import { TransactionDto } from './transaction.dto';

/**
 * Represents a bulk of monetary transactions for users.
 *
 * @export
 * @class TransactionBulkDto
 * @typedef {TransactionBulkDto}
 */
export class TransactionBulkDto {
  /**
   * Transactions array to be received.
   *
   * @type {TransactionDto[]}
   */
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty()
  transactions: TransactionDto[];
}
