export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: string;
  date: string;
  accountId: string;
}

export interface DepositInput {
  accountId: string;
  amount: number;
  date: Date | string;
}

export interface WithdrawInput {
  accountId: string;
  amount: number;
  date: Date | string;
}

export interface WithdrawResult {
  transaction: Transaction;
  calculation: {
    startingBalance: number;
    months: number;
    yearlyReturn: number;
    monthlyReturn: number;
    endingBalance: number;
  };
}

