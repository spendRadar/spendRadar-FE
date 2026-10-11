import type { LucideIcon } from 'lucide-react';

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
