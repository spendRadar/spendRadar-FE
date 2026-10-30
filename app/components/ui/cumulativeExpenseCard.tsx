import type { CumulativeExpenseComparison } from '~/lib/cumulativeExpense';

interface CumulativeExpenseCardProps {
  comparison: CumulativeExpenseComparison;
}

function formatKrw(amount: number) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercent(value: number, signed = false) {
  return `${new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    signDisplay: signed ? 'exceptZero' : 'auto',
  }).format(value)}%`;
}

function CumulativeExpenseCard({ comparison }: CumulativeExpenseCardProps) {
  const { throughMonth, currentTotal, previousTotal, monthlyAverage, changeRate } = comparison;
  const ratioPercent =
    previousTotal !== null && previousTotal > 0 ? (currentTotal / previousTotal) * 100 : null;
  const barPercent = ratioPercent === null ? 0 : Math.min(ratioPercent, 100);
  const increased = changeRate !== null && changeRate > 0;

  if (currentTotal <= 0) {
    return null;
  }

  return (
    <div className='m-4 flex flex-col gap-4 rounded-2xl border border-[#eff4ff] bg-white p-4 shadow-sm'>
      <div className='flex items-center gap-2 text-sm text-secondary-foreground'>
        <span className='size-2 shrink-0 rounded-full bg-primary' />
        <span>누적 실지출 (1~{throughMonth}월)</span>
      </div>
      <div className='flex flex-wrap items-baseline gap-x-3 gap-y-1'>
        <p className='text-3xl font-bold tracking-tight tabular-nums sm:text-4xl'>
          {formatKrw(currentTotal)}
        </p>
        {monthlyAverage > 0 ? (
          <p className='text-sm text-secondary-foreground tabular-nums'>
            월평균 {formatKrw(monthlyAverage)}
          </p>
        ) : null}
      </div>
      {ratioPercent === null ? (
        <p className='text-sm text-secondary-foreground'>
          전년 동기 누적 지출이 없어 증감률을 계산할 수 없습니다.
        </p>
      ) : (
        <>
          <div
            className='h-2 overflow-hidden rounded-full bg-primary/15'
            role='meter'
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(barPercent)}
            aria-label='전년 동기 대비'
          >
            <div className='h-full rounded-full bg-primary' style={{ width: `${barPercent}%` }} />
          </div>
          <p
            className={
              increased
                ? 'text-sm font-medium text-destructive'
                : 'text-sm font-medium text-green-900'
            }
          >
            전년 동기 대비 {formatPercent(changeRate ?? 0, true)}
          </p>
        </>
      )}
    </div>
  );
}

export default CumulativeExpenseCard;
