import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

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
    await this.service.receiveTransactions(plainToClass(Transaction, transaction));
  }

  @Post('/receive-bulk')
  async receiveBulkTransactions(@Body() transactions: TransactionDto[]): Promise<void> {
    const mappedTransactions = transactions.map((t) => plainToClass(Transaction, t));
    await this.service.receiveTransactions(mappedTransactions);
  }

  @Get('/')
  async getTotalsByUser(): Promise<UserTotalDto[]> {
    const result = await this.service.getTotalsByUser();
    return result.map((r) => plainToClass(UserTotalDto, r));
  }

  @Get('/:user_email/summary')
  async getUserSummary(@Param('user_email') userEmail: string): Promise<UserSummaryDto> {
    const result = await this.service.getUserSummary(userEmail);
    return plainToClass(UserSummaryDto, result);
  }
}
