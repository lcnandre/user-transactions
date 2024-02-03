import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { TransactionController } from '../controllers/transaction.controller';
import { Transaction } from '../entities/transaction';
import { TransactionRepository } from '../repositories/transaction.repository';
import { TransactionService } from '../services/transaction.service';

/**
 * Transactions module that encapsulates all things
 * related to transactions.
 *
 * @export
 * @class TransactionModule
 * @typedef {TransactionModule}
 */
@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Transaction],
    }),
  ],
  providers: [TransactionRepository, TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
