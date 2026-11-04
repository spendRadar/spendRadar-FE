import { monthExpense } from '~/lib/cumulativeExpense';
import type { NextMonthForecastView } from '~/lib/nextMonthForecast';
import type { DashboardCategory, TransactionMonth } from '~/types/transaction';

export interface MonthlyExpenseBar {
  month: number;
  label: string;
  actual: number;
  forecastGap: number;
  predictedExpense: number | null;
}

const monthCount = 12;

export function buildMonthlyExpenseBars(
  months: readonly TransactionMonth[],
  year: number,
  category: DashboardCategory,
  forecast: NextMonthForecastView | null,
): MonthlyExpenseBar[] {
  const bars = Array.from({ length: monthCount }, (_, index) => {
    const month = index + 1;
    const actual = monthExpense(months, year, month, category);
    const isForecastMonth = forecast?.forecastMonth === month;
    const predictedExpense = isForecastMonth ? forecast.predictedExpense : null;
    const forecastGap = predictedExpense === null ? 0 : Math.max(predictedExpense - actual, 0);

    return {
      month,
      label: `${month}월`,
      actual,
      forecastGap,
      predictedExpense,
    };
  });

  return bars;
}
