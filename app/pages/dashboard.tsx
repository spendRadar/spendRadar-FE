import { useMemo, useState } from 'react';
import YearToolBar from '~/components/layout/yearToolBar';
import CategoryForecastCard from '~/components/ui/categoryForecastCard';
import CumulativeExpenseCard from '~/components/ui/cumulativeExpenseCard';
import MonthlyExpenseChart from '~/components/ui/monthlyExpenseChart';
import NextMonthForecastCard from '~/components/ui/nextMonthForecastCard';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { compareCumulativeExpense, confirmedExpenseThroughMonth } from '~/lib/cumulativeExpense';
import { buildMonthlyExpenseBars } from '~/lib/monthlyExpenseChart';
import { resolveNextMonthForecast } from '~/lib/nextMonthForecast';
import { mockTransactionMonths } from '~/mocks/transactions';
import {
  dashboardCategories,
  transactionCategories,
  type DashboardCategory,
} from '~/types/transaction';
import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = () => {
  return [
    { title: 'SpendRadar - Dashboard' },
    { name: 'description', content: 'Dashboard page of SpendRadar' },
  ];
};

function Dashboard() {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedCategory, setSelectedCategory] = useState<DashboardCategory>(
    dashboardCategories[0].value,
  );

  const comparison = useMemo(
    () => compareCumulativeExpense(mockTransactionMonths, selectedYear, selectedCategory),
    [selectedYear, selectedCategory],
  );
  const nextMonthForecast = useMemo(
    () => resolveNextMonthForecast(mockTransactionMonths, selectedYear, selectedCategory),
    [selectedYear, selectedCategory],
  );
  const categoryForecasts = useMemo(
    () =>
      transactionCategories.flatMap((category) => {
        if (category.value === 'income') {
          return [];
        }

        const forecast = resolveNextMonthForecast(
          mockTransactionMonths,
          selectedYear,
          category.value,
        );

        return forecast ? [{ category, forecast }] : [];
      }),
    [selectedYear],
  );
  const monthlyBars = useMemo(
    () =>
      buildMonthlyExpenseBars(
        mockTransactionMonths,
        selectedYear,
        selectedCategory,
        nextMonthForecast,
      ),
    [selectedYear, selectedCategory, nextMonthForecast],
  );

  function handleCategoryClick(category: DashboardCategory) {
    setSelectedCategory(category);
  }

  return (
    <div className='mx-auto flex w-full max-w-240 flex-col gap-10 px-4 pt-24'>
      <div className='flex flex-col gap-2'>
        <h1 className='md:text-4xl text-2xl font-bold'>
          카테고리별 AI 시게열 예측 & 연간 지출 추이
        </h1>
        <div className='flex items-center justify-between gap-6'>
          <p className='min-w-0 flex-1 text-xs sm:text-sm md:text-base text-secondary-foreground'>
            시계열 파운데이션 모델(Chronos · TimesFM)을 활용해 카테고리별 소비 패턴을 분석하고, 월별
            실제 지출과 향후 예상 지출을 예측 구간과 함께 확인할 수 있습니다.
          </p>
          <YearToolBar selectedYear={selectedYear} onYearChange={setSelectedYear} />
        </div>
      </div>
      <div className='rounded-2xl bg-white shadow-sm p-4'>
        <div className='flex flex-col items-stretch justify-between gap-3 lg:flex-row lg:items-center'>
          <div className='grid w-full grid-cols-2 gap-1 rounded-2xl bg-[#eff4ff] p-1 sm:grid-cols-3 lg:flex lg:w-auto lg:rounded-full'>
            {dashboardCategories.map((item) => (
              <Button
                key={item.value}
                type='button'
                variant='ghost'
                className={
                  selectedCategory === item.value
                    ? 'h-auto w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm hover:bg-white lg:w-auto'
                    : 'h-auto w-full rounded-full px-4 py-2 text-sm font-semibold text-secondary-foreground hover:bg-white/70 lg:w-auto'
                }
                onClick={() => handleCategoryClick(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </div>
          <div className='flex items-center justify-center gap-4'>
            <div className='flex items-center justify-center gap-2'>
              <span className='block size-2 rounded-xs bg-primary' />
              <p>실제 지출 (1~{confirmedExpenseThroughMonth}월)</p>
            </div>
            <div className='flex items-center justify-center gap-2'>
              <span className='block size-2 rounded-xs bg-fuchsia-600' />
              <p>예측 지출 ({confirmedExpenseThroughMonth + 1}월)</p>
            </div>
          </div>
        </div>
        <Separator className='my-4' />
        {comparison.currentTotal > 0 ? <CumulativeExpenseCard comparison={comparison} /> : null}
        {nextMonthForecast ? <NextMonthForecastCard forecast={nextMonthForecast} /> : null}
        <MonthlyExpenseChart bars={monthlyBars} />
      </div>
      {categoryForecasts.length > 0 ? (
        <div className='flex flex-col gap-2'>
          <h2 className='text-xl font-bold'>카테고리별 정밀 예측</h2>
          <Separator className='my-2' />
          <div className='grid grid-cols-1 gap-3 md:grid-cols-2 pb-6'>
            {categoryForecasts.map(({ category, forecast }) => (
              <CategoryForecastCard
                key={category.value}
                label={category.label}
                icon={category.icon}
                forecast={forecast}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Dashboard;
