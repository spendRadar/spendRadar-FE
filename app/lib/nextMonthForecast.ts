import { monthExpense } from '~/lib/cumulativeExpense';
import { mockMonthForecasts } from '~/mocks/forecast';
import type { DashboardCategory, TransactionMonth } from '~/types/transaction';

export interface NextMonthForecastView {
  currentMonth: number;
  forecastMonth: number;
  currentExpense: number;
  predictedExpense: number;
  confidenceInterval: number | null;
  changeRate: number | null;
}

function seoulDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'numeric',
  }).formatToParts(date);

  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  return {
    year: value('year'),
    month: value('month'),
  };
}

function forecastKey(year: number, month: number, category: DashboardCategory) {
  return `${year}-${month}-${category}`;
}

export function resolveNextMonthForecast(
  months: readonly TransactionMonth[],
  selectedYear: number,
  category: DashboardCategory,
  now = seoulDate(),
): NextMonthForecastView | null {
  if (selectedYear !== now.year || now.month >= 12) {
    return null;
  }

  const forecastMonth = now.month + 1;
  const forecast = mockMonthForecasts[forecastKey(selectedYear, forecastMonth, category)];

  if (!forecast || forecast.predictedExpense <= 0) {
    return null;
  }

  const currentExpense = monthExpense(months, selectedYear, now.month, category);
  const changeRate =
    currentExpense > 0
      ? ((forecast.predictedExpense - currentExpense) / currentExpense) * 100
      : null;

  return {
    currentMonth: now.month,
    forecastMonth,
    currentExpense,
    predictedExpense: forecast.predictedExpense,
    confidenceInterval: forecast.confidenceInterval ?? null,
    changeRate,
  };
}
