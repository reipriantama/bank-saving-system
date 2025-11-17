import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Customer, CreateCustomerInput, UpdateCustomerInput } from '../types/customer';

const CUSTOMERS_QUERY_KEY = ['customers'];

export async function fetchCustomers(): Promise<Customer[]> {
  const res = await fetch('/api/customers');
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch customers');
  }
  return res.json();
}

export function useCustomersQuery() {
  return useQuery<Customer[]>({
    queryKey: CUSTOMERS_QUERY_KEY,
    queryFn: fetchCustomers,
  });
}

export async function fetchCustomerById(id: string): Promise<Customer> {
  const res = await fetch(`/api/customers/${id}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch customer');
  }
  return res.json();
}

export function useCustomerQuery(id: string) {
  return useQuery<Customer>({
    queryKey: [...CUSTOMERS_QUERY_KEY, id],
    queryFn: () => fetchCustomerById(id),
    enabled: !!id,
  });
}

export async function createCustomer(data: CreateCustomerInput): Promise<Customer> {
  const res = await fetch('/api/customers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create customer');
  }
  return res.json();
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCustomerInput) => createCustomer(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
    },
  });
}

export async function updateCustomer(
  id: string,
  data: UpdateCustomerInput
): Promise<Customer> {
  const res = await fetch(`/api/customers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update customer');
  }
  return res.json();
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerInput }) =>
      updateCustomer(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
    },
  });
}

export async function deleteCustomer(id: string): Promise<void> {
  const res = await fetch(`/api/customers/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to delete customer');
  }
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
    },
  });
}

