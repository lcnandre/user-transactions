import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { TransactionController } from '../controllers/transaction.controller';
import { Transaction } from '../entities/transaction';
import { TransactionRepository } from '../repositories/transaction.repository';
import { TransactionService } from '../services/transaction.service';

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
