import { Body, Controller, Get, Param, Post, UnprocessableEntityException } from '@nestjs/common';
import { ApiCreatedResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { TransactionBulkDto } from './dtos/transaction-bulk.dto';
import { TransactionDto } from './dtos/transaction.dto';
import { UserSummaryDto } from './dtos/user-summary.dto';
import { UserTotalDto } from './dtos/user-total.dto';
import { Transaction } from '../entities/transaction';
import { TransactionService } from '../services/transaction.service';

/**
 * REST controller for transactions endpoints.
 *
 * @export
 * @class TransactionController
 * @typedef {TransactionController}
 */
@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  /**
   * Receives a single transaction.
   *
   * @param transaction details of the transaction.
   */
  @Post('/receive')
  async receiveTransaction(@Body() transaction: TransactionDto): Promise<void> {
    const errors = await validate(transaction);
    if (errors?.length) {
      throw new UnprocessableEntityException(errors);
    }

    await this.service.receiveTransactions(plainToInstance(Transaction, transaction));
  }

  /**
   * Receives multiple transactions in bulk.
   *
   * @async
   * @param {TransactionBulkDto} bulk object containing the list of transactions.
   * @returns {Promise<void>}
   */
  @Post('/receive-bulk')
  async receiveBulkTransactions(@Body() bulk: TransactionBulkDto): Promise<void> {
    const errors = await validate(bulk);
    if (errors?.length) {
      throw new UnprocessableEntityException(errors);
    }

    const mappedTransactions = bulk.transactions.map((t) => plainToInstance(Transaction, t));
    await this.service.receiveTransactions(mappedTransactions);
  }

  /**
   * Fetches a summary of all transactions per user.
   *
   * @async
   * @returns {Promise<UserTotalDto[]>}
   */
  @Get('/')
  @ApiCreatedResponse({ type: UserTotalDto, isArray: true })
  async getTotalsByUser(): Promise<UserTotalDto[]> {
    const result = await this.service.getTotalsByUser();
    return result.map((r) => plainToInstance(UserTotalDto, r));
  }

  /**
   * Fetches a summary of a single user's transactions.
   *
   * @async
   * @param {string} userEmail user's email address.
   * @returns {Promise<UserSummaryDto>}
   */
  @Get('/:user_email/summary')
  @ApiParam({ name: 'user_email', example: 'janedoe@email.com' })
  @ApiCreatedResponse({ type: UserSummaryDto })
  async getUserSummary(@Param('user_email') userEmail: string): Promise<UserSummaryDto> {
    const result = await this.service.getUserSummary(userEmail);
    return plainToInstance(UserSummaryDto, result);
  }
}
