import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  Transaction,
  DepositInput,
  WithdrawInput,
  WithdrawResult,
} from '../types/transaction';

const TRANSACTIONS_QUERY_KEY = ['transactions'];

export async function deposit(data: DepositInput): Promise<Transaction> {
  const res = await fetch('/api/transactions/deposit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      date: typeof data.date === 'string' ? data.date : data.date.toISOString(),
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to process deposit');
  }
  return res.json();
}

export function useDeposit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DepositInput) => deposit(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['accounts'] });
      qc.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    },
  });
}

export async function withdraw(data: WithdrawInput): Promise<WithdrawResult> {
  const res = await fetch('/api/transactions/withdraw', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      date: typeof data.date === 'string' ? data.date : data.date.toISOString(),
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to process withdrawal');
  }
  return res.json();
}

export function useWithdraw() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: WithdrawInput) => withdraw(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['accounts'] });
      qc.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    },
  });
}

export async function fetchAccountTransactions(
  accountId: string
): Promise<Transaction[]> {
  const res = await fetch(`/api/accounts/${accountId}/transactions`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch transactions');
  }
  return res.json();
}

export function useAccountTransactionsQuery(accountId: string) {
  return useQuery<Transaction[]>({
    queryKey: [...TRANSACTIONS_QUERY_KEY, 'account', accountId],
    queryFn: () => fetchAccountTransactions(accountId),
    enabled: !!accountId,
  });
}

