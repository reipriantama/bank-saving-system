export interface DepositoType {
  id: string;
  name: string;
  yearlyReturn: string;
}

export interface CreateDepositoTypeInput {
  name: string;
  yearlyReturn: number;
}

export interface UpdateDepositoTypeInput {
  name?: string;
  yearlyReturn?: number;
}

