import { Body, Controller, Get, Param, Post, UnprocessableEntityException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { TransactionBulkDto } from './dtos/transaction-bulk.dto';
import { TransactionDto } from './dtos/transaction.dto';
import { UserSummaryDto } from './dtos/user-summary.dto';
import { UserTotalDto } from './dtos/user-total.dto';
import { Transaction } from '../entities/transaction';
import { TransactionService } from '../services/transaction.service';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Post('/receive')
  async receiveTransaction(@Body() transaction: TransactionDto): Promise<void> {
    const errors = await validate(transaction);
    if (errors?.length) {
      throw new UnprocessableEntityException(errors);
    }

    await this.service.receiveTransactions(plainToInstance(Transaction, transaction));
  }

  @Post('/receive-bulk')
  async receiveBulkTransactions(@Body() bulk: TransactionBulkDto): Promise<void> {
    const errors = await validate(bulk);
    if (errors?.length) {
      throw new UnprocessableEntityException(errors);
    }

    const mappedTransactions = bulk.transactions.map((t) => plainToInstance(Transaction, t));
    await this.service.receiveTransactions(mappedTransactions);
  }

  @Get('/')
  async getTotalsByUser(): Promise<UserTotalDto[]> {
    const result = await this.service.getTotalsByUser();
    return result.map((r) => plainToInstance(UserTotalDto, r));
  }

  @Get('/:user_email/summary')
  async getUserSummary(@Param('user_email') userEmail: string): Promise<UserSummaryDto> {
    const result = await this.service.getUserSummary(userEmail);
    return plainToInstance(UserSummaryDto, result);
  }
}
