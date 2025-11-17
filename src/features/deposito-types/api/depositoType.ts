import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  DepositoType,
  CreateDepositoTypeInput,
  UpdateDepositoTypeInput,
} from '../types/depositoType';

const DEPOSITO_TYPES_QUERY_KEY = ['deposito-types'];

export async function fetchDepositoTypes(): Promise<DepositoType[]> {
  const res = await fetch('/api/deposito-types');
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch deposito types');
  }
  return res.json();
}

export function useDepositoTypesQuery() {
  return useQuery<DepositoType[]>({
    queryKey: DEPOSITO_TYPES_QUERY_KEY,
    queryFn: fetchDepositoTypes,
  });
}

export async function fetchDepositoTypeById(id: string): Promise<DepositoType> {
  const res = await fetch(`/api/deposito-types/${id}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch deposito type');
  }
  return res.json();
}

export function useDepositoTypeQuery(id: string) {
  return useQuery<DepositoType>({
    queryKey: [...DEPOSITO_TYPES_QUERY_KEY, id],
    queryFn: () => fetchDepositoTypeById(id),
    enabled: !!id,
  });
}

export async function createDepositoType(
  data: CreateDepositoTypeInput
): Promise<DepositoType> {
  const res = await fetch('/api/deposito-types', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create deposito type');
  }
  return res.json();
}

export function useCreateDepositoType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDepositoTypeInput) => createDepositoType(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DEPOSITO_TYPES_QUERY_KEY });
    },
  });
}

export async function updateDepositoType(
  id: string,
  data: UpdateDepositoTypeInput
): Promise<DepositoType> {
  const res = await fetch(`/api/deposito-types/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update deposito type');
  }
  return res.json();
}

export function useUpdateDepositoType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDepositoTypeInput }) =>
      updateDepositoType(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DEPOSITO_TYPES_QUERY_KEY });
    },
  });
}

export async function deleteDepositoType(id: string): Promise<void> {
  const res = await fetch(`/api/deposito-types/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to delete deposito type');
  }
}

export function useDeleteDepositoType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDepositoType(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DEPOSITO_TYPES_QUERY_KEY });
    },
  });
}

