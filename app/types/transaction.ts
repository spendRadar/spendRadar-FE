import type { LucideIcon } from 'lucide-react';

export const transactionKindValues = ['expense', 'income'] as const;

export type TransactionKind = (typeof transactionKindValues)[number];

export const transactionCategoryValues = [
  'food',
  'housing',
  'shopping',
  'transport',
  'leisure',
  'income',
] as const;

export type TransactionCategory = (typeof transactionCategoryValues)[number];

export interface TransactionCategoryOption {
  value: TransactionCategory;
  label: string;
  icon: LucideIcon;
}

export interface Transaction {
  id: string;
  name: string;
  category: string;
  account: string;
  amount: number;
  icon: LucideIcon;
}

export interface TransactionDaySummary {
  expense: number;
  income: number;
}

export interface TransactionDay {
  date: string;
  summary: TransactionDaySummary;
  transactions: Transaction[];
}

export interface TransactionMonth {
  year: number;
  month: number;
  days: TransactionDay[];
}
