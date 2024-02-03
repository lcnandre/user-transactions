import { UserSummary } from '../src/types/user-summary.type';
import { UserTotal } from '../src/types/user-total.type';

export class TransactionServiceMock {
  receiveTransactions(): Promise<void> {
    return Promise.resolve();
  }

  getTotalsByUser(): Promise<UserTotal[]> {
    return Promise.resolve([
      {
        user_email: 'janedoe@email.com',
        total_inflow: 2651.44,
        total_outflow: -761.85,
      },
      {
        user_email: 'johndoe@email.com',
        total_inflow: 0,
        total_outflow: -51.13,
      },
    ]);
  }

  getUserSummary(): Promise<UserSummary> {
    return Promise.resolve({
      inflow: {
        salary: 2500.72,
        savings: 150.72,
      },
      outflow: {
        groceries: -51.13,
        rent: -560,
        transfer: -150.72,
      },
    });
  }
}
