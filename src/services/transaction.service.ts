import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

import { Transaction } from '../entities/transaction';
import { TransactionRepository } from '../repositories/transaction.repository';
import { UserSummary } from '../types/user-summary.type';
import { UserTotal } from '../types/user-total.type';

/**
 * Domain service for managing transactions.
 *
 * @export
 * @class TransactionService
 * @typedef {TransactionService}
 */
@Injectable()
export class TransactionService {
  /**
   * Internal logger for handling errors.
   *
   * @private
   * @readonly
   * @type {Logger}
   */
  private readonly logger: Logger = new Logger(TransactionService.name);

  /**
   * Creates an instance of TransactionService.
   *
   * @constructor
   * @param {TransactionRepository} repository an instance of {@link TransactionRepository}.
   */
  constructor(private readonly repository: TransactionRepository) {}

  /**
   * Receives a single or multiple transactions
   * and persists them on the repository.
   *
   * @async
   * @param {(Transaction | Transaction[])} transactions transaction object or array.
   * @returns {Promise<void>}
   */
  async receiveTransactions(transactions: Transaction | Transaction[]): Promise<void> {
    try {
      await this.repository.insertTransactions(transactions);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('There was an error when receiving the transactions');
    }
  }

  /**
   * Retrieves a summary of all transactions per user
   * from the repository.
   *
   * @async
   * @returns {Promise<UserTotal[]>}
   */
  async getTotalsByUser(): Promise<UserTotal[]> {
    try {
      return await this.repository.getTotalsByUser();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('There was an error when fetching the totals by user');
    }
  }

  /**
   * Retrieves a summary of a single user's transactions
   * from the repository.
   *
   * @async
   * @param {string} userEmail user's email address.
   * @returns {Promise<UserSummary>}
   */
  async getUserSummary(userEmail: string): Promise<UserSummary> {
    try {
      return await this.repository.getUserSummary(userEmail);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('There was an error when fetching the user summary');
    }
  }
}
