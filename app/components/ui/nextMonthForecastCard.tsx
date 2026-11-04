import { SparklesIcon } from 'lucide-react';
import type { NextMonthForecastView } from '~/lib/nextMonthForecast';

interface NextMonthForecastCardProps {
  forecast: NextMonthForecastView;
}

function formatKrw(amount: number) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercent(value: number) {
  return `${new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    signDisplay: 'exceptZero',
  }).format(value)}%`;
}

function NextMonthForecastCard({ forecast }: NextMonthForecastCardProps) {
  const {
    currentMonth,
    forecastMonth,
    currentExpense,
    predictedExpense,
    confidenceInterval,
    changeRate,
  } = forecast;
  const increased = changeRate !== null && changeRate > 0;
  const greenPercent =
    predictedExpense > 0 ? Math.min((currentExpense / predictedExpense) * 100, 100) : 0;

  return (
    <div className='m-4 flex flex-col gap-4 rounded-2xl border border-[#eff4ff] bg-white p-4 shadow-sm'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='size-2 shrink-0 rounded-full bg-blue-600' />
          <span>{forecastMonth}월 지출 예측</span>
          <div className='flex items-center gap-1 rounded-full bg-fuchsia-600/10 px-2 py-0.5 '>
            <SparklesIcon className='size-4 text-fuchsia-700' />
            <span className='text-xs font-medium text-fuchsia-700'>Chronos-2</span>
          </div>
        </div>
      </div>
      <div className='grid gap-4 rounded-2xl bg-[#eff4ff] p-4 sm:grid-cols-2'>
        <div className='flex flex-col gap-1'>
          <div className='flex items-center gap-2 text-sm text-secondary-foreground'>
            <span className='size-2 rounded-full bg-primary' />
            현재 지출
          </div>
          <p className='text-2xl font-bold text-primary tabular-nums sm:text-3xl'>
            {formatKrw(currentExpense)}
          </p>
          <p className='text-xs text-secondary-foreground'>{currentMonth}월 실지출</p>
        </div>
        <div className='flex flex-col gap-1'>
          <div className='flex items-center gap-2 text-sm text-secondary-foreground'>
            <span className='size-2 rounded-full bg-fuchsia-600' />
            모델 예측치
          </div>
          <p className='text-2xl font-bold text-fuchsia-700 tabular-nums sm:text-3xl'>
            {formatKrw(predictedExpense)}
          </p>
          {confidenceInterval !== null && confidenceInterval > 0 ? (
            <p className='text-xs text-secondary-foreground tabular-nums'>
              신뢰구간 ±{formatKrw(confidenceInterval)}
            </p>
          ) : (
            <p className='text-xs text-secondary-foreground'>{forecastMonth}월 전체 예측</p>
          )}
        </div>
      </div>
      {changeRate !== null ? (
        <div className='flex flex-col gap-2'>
          <div
            className='flex h-2 overflow-hidden rounded-full bg-fuchsia-600'
            role='meter'
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(greenPercent)}
            aria-label='모델 예측치 대비 현재 집행'
          >
            <div className='h-full shrink-0 bg-primary' style={{ width: `${greenPercent}%` }} />
          </div>
          <p
            className={
              increased
                ? 'text-sm font-medium text-destructive'
                : 'text-sm font-medium text-green-900'
            }
          >
            전체 예측 기반 증감률 {formatPercent(changeRate)}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default NextMonthForecastCard;
