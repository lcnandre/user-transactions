import { IsArray, IsDefined, ValidateNested } from 'class-validator';

import { TransactionDto } from './transaction.dto';

export class TransactionBulkDto {
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  transactions: TransactionDto[];
}
