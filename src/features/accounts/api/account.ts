import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Account, CreateAccountInput, UpdateAccountInput } from '../types/account';

const ACCOUNTS_QUERY_KEY = ['accounts'];

export async function fetchAccounts(): Promise<Account[]> {
  const res = await fetch('/api/accounts');
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch accounts');
  }
  return res.json();
}

export function useAccountsQuery() {
  return useQuery<Account[]>({
    queryKey: ACCOUNTS_QUERY_KEY,
    queryFn: fetchAccounts,
  });
}

export async function fetchAccountById(id: string): Promise<Account> {
  const res = await fetch(`/api/accounts/${id}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch account');
  }
  return res.json();
}

export function useAccountQuery(id: string) {
  return useQuery<Account>({
    queryKey: [...ACCOUNTS_QUERY_KEY, id],
    queryFn: () => fetchAccountById(id),
    enabled: !!id,
  });
}

export async function createAccount(data: CreateAccountInput): Promise<Account> {
  const res = await fetch('/api/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create account');
  }
  return res.json();
}

export function useCreateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAccountInput) => createAccount(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });
}

export async function updateAccount(
  id: string,
  data: UpdateAccountInput
): Promise<Account> {
  const res = await fetch(`/api/accounts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update account');
  }
  return res.json();
}

export function useUpdateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountInput }) =>
      updateAccount(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });
}

export async function deleteAccount(id: string): Promise<void> {
  const res = await fetch(`/api/accounts/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to delete account');
  }
}

export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAccount(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });
}

