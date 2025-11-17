export interface Customer {
  id: string;
  name: string;
}

export interface CreateCustomerInput {
  name: string;
}

export interface UpdateCustomerInput {
  name?: string;
}

