import type { LucideIcon } from 'lucide-react';

export const transactionKindValues = ['expense', 'income'] as const;

export type TransactionKind = (typeof transactionKindValues)[number];

const expenseCategoryValues = ['food', 'housing', 'shopping', 'transport', 'leisure'] as const;

export const transactionCategoryValues = [...expenseCategoryValues, 'income'] as const;

export type TransactionCategory = (typeof transactionCategoryValues)[number];

export const dashboardCategoryValues = ['all', ...expenseCategoryValues] as const;

export type DashboardCategory = (typeof dashboardCategoryValues)[number];

const dashboardCategoryLabels: Record<DashboardCategory, string> = {
  all: '전체 지출',
  food: '식비/카페',
  housing: '주거/통신',
  shopping: '쇼핑/패션',
  transport: '교통/차량',
  leisure: '문화/여가',
};

export const dashboardCategories = dashboardCategoryValues.map((value) => ({
  value,
  label: dashboardCategoryLabels[value],
}));

export const transactionCategoryByLabel: Record<string, TransactionCategory> = {
  식비: 'food',
  '카페/디저트': 'food',
  주거: 'housing',
  통신: 'housing',
  생활: 'housing',
  보험: 'housing',
  쇼핑: 'shopping',
  선물: 'shopping',
  교통: 'transport',
  '문화/여가': 'leisure',
  여행: 'leisure',
  건강: 'leisure',
  구독: 'leisure',
  급여: 'income',
  상여: 'income',
  이자: 'income',
  기타수입: 'income',
};

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
