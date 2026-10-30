import type { LucideIcon } from 'lucide-react';
import type { NextMonthForecastView } from '~/lib/nextMonthForecast';

interface CategoryForecastCardProps {
  label: string;
  icon: LucideIcon;
  forecast: NextMonthForecastView;
}

function formatKrw(amount: number) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount);
}

function rangeStatus(currentExpense: number, predictedExpense: number) {
  if (currentExpense > predictedExpense) {
    return { label: '초과', className: 'bg-destructive/10 text-destructive' };
  }

  return { label: '정상 범위', className: 'bg-[#eff4ff] text-secondary-foreground' };
}

function CategoryForecastCard({ label, icon: Icon, forecast }: CategoryForecastCardProps) {
  const { forecastMonth, currentExpense, predictedExpense, confidenceInterval } = forecast;
  const spentPercent = predictedExpense > 0 ? (currentExpense / predictedExpense) * 100 : 0;
  const barPercent = Math.min(spentPercent, 100);
  const remainder = Math.max(predictedExpense - currentExpense, 0);
  const status = rangeStatus(currentExpense, predictedExpense);

  return (
    <div className='flex flex-col gap-3 rounded-2xl border border-[#eff4ff] bg-white p-4 shadow-sm'>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex min-w-0 items-center gap-3'>
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-full ${status.className}`}
          >
            <Icon className='size-5' />
          </span>
          <div className='min-w-0'>
            <p className='font-semibold'>{label}</p>
            {confidenceInterval !== null && confidenceInterval > 0 ? (
              <p className='text-xs text-secondary-foreground tabular-nums'>
                신뢰구간 ±{formatKrw(confidenceInterval)}
              </p>
            ) : null}
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${status.className}`}>
          {status.label}
        </span>
      </div>
      <div className='flex items-end justify-between gap-3'>
        <p className='text-sm text-secondary-foreground'>{forecastMonth}월 예측 총액</p>
        <p className='text-xl font-bold tabular-nums'>{formatKrw(predictedExpense)}</p>
      </div>
      <div
        className='flex h-2 overflow-hidden rounded-full bg-fuchsia-600'
        role='meter'
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(barPercent)}
        aria-label={`${label} 예측 총액 대비 실지출`}
      >
        <div className='h-full shrink-0 bg-primary' style={{ width: `${barPercent}%` }} />
      </div>
      <div className='flex flex-wrap items-center justify-between gap-2 text-sm text-secondary-foreground'>
        <p className='tabular-nums'>
          실지출 {formatKrw(currentExpense)} ({Math.round(spentPercent)}%)
        </p>
        <p className='tabular-nums'>잔여 {formatKrw(remainder)}</p>
      </div>
    </div>
  );
}

export default CategoryForecastCard;
