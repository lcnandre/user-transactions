import { Transaction } from '@mikro-orm/core';

import { UserSummary } from '../src/types/user-summary.type';
import { UserTotal } from '../src/types/user-total.type';

export class TransactionRepositoryMock {
  insertTransactions(transactions: Transaction | Transaction[]): Promise<void> {
    if (transactions) {
      return Promise.resolve();
    }

    return Promise.reject(new Error('Test error'));
  }

  getTotalsByUser(): Promise<UserTotal[]> {
    return Promise.resolve([]);
  }

  getUserSummary(userEmail: string): Promise<UserSummary> {
    if (userEmail === 'error') {
      return Promise.reject(new Error('Test error'));
    }

    return Promise.resolve({} as UserSummary);
  }
}
