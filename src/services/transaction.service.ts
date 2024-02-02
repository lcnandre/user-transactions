import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

import { Transaction } from '../entities/transaction';
import { TransactionRepository } from '../repositories/transaction.repository';
import { UserSummary } from '../types/user-summary.type';
import { UserTotal } from '../types/user-total.type';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(private readonly repository: TransactionRepository) {}

  async receiveTransactions(transactions: Transaction | Transaction[]): Promise<void> {
    try {
      await this.repository.insertTransactions(transactions);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('There was an error when receiving the transactions');
    }
  }

  async getTotalsByUser(): Promise<UserTotal[]> {
    try {
      return await this.repository.getTotalsByUser();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('There was an error when fetching the totals by user');
    }
  }

  async getUserSummary(userEmail: string): Promise<UserSummary> {
    try {
      return await this.repository.getUserSummary(userEmail);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('There was an error when fetching the user summary');
    }
  }
}
