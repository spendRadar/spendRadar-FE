import {
  transactionCategoryByLabel,
  type DashboardCategory,
  type TransactionMonth,
} from '~/types/transaction';

export const confirmedExpenseThroughMonth = 10;

export interface CumulativeExpenseComparison {
  throughMonth: number;
  currentTotal: number;
  previousTotal: number | null;
  monthlyAverage: number;
  changeRate: number | null;
}

function expenseInMonth(month: TransactionMonth, category: DashboardCategory) {
  if (category === 'all') {
    return month.days.reduce((total, day) => total + day.summary.expense, 0);
  }

  return month.days.reduce((monthTotal, day) => {
    return (
      monthTotal +
      day.transactions.reduce((dayTotal, transaction) => {
        if (transaction.amount >= 0) {
          return dayTotal;
        }

        if (transactionCategoryByLabel[transaction.category] !== category) {
          return dayTotal;
        }

        return dayTotal - transaction.amount;
      }, 0)
    );
  }, 0);
}

export function monthExpense(
  months: readonly TransactionMonth[],
  year: number,
  month: number,
  category: DashboardCategory,
) {
  const matched = months.find((item) => item.year === year && item.month === month);

  if (!matched) {
    return 0;
  }

  return expenseInMonth(matched, category);
}

function cumulativeExpense(
  months: readonly TransactionMonth[],
  year: number,
  throughMonth: number,
  category: DashboardCategory,
) {
  return months.reduce((total, month) => {
    if (month.year !== year || month.month < 1 || month.month > throughMonth) {
      return total;
    }

    return total + expenseInMonth(month, category);
  }, 0);
}

export function compareCumulativeExpense(
  months: readonly TransactionMonth[],
  year: number,
  category: DashboardCategory,
  throughMonth = confirmedExpenseThroughMonth,
): CumulativeExpenseComparison {
  const currentTotal = cumulativeExpense(months, year, throughMonth, category);
  const hasPreviousYear = months.some(
    (month) => month.year === year - 1 && month.month >= 1 && month.month <= throughMonth,
  );
  const previousTotal = hasPreviousYear
    ? cumulativeExpense(months, year - 1, throughMonth, category)
    : null;
  const changeRate =
    previousTotal !== null && previousTotal > 0
      ? ((currentTotal - previousTotal) / previousTotal) * 100
      : null;

  return {
    throughMonth,
    currentTotal,
    previousTotal,
    monthlyAverage: throughMonth > 0 ? Math.round(currentTotal / throughMonth) : 0,
    changeRate,
  };
}
