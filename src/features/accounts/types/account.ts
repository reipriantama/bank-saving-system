export interface Account {
  id: string;
  packet: string;
  balance: string;
  customerId: string;
  depositoTypeId: string;
  createdAt: string;
  customer?: {
    id: string;
    name: string;
  };
  depositoType?: {
    id: string;
    name: string;
    yearlyReturn: string;
  };
}

export interface CreateAccountInput {
  packet: string;
  balance: number;
  customerId: string;
  depositoTypeId: string;
}

export interface UpdateAccountInput {
  packet?: string;
  customerId?: string;
  depositoTypeId?: string;
}

