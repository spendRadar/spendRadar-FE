import { ArrowUp, CircleAlert } from 'lucide-react';
import SummaryCard from '~/components/ui/summaryCard';
import TransactionsCard from '~/components/ui/transactionsCard';
import { mockTransactionMonths } from '~/mocks/transactions';
import type { Route } from './+types/home';

function seoulYearMonth(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'numeric',
  }).formatToParts(date);
  const year = Number(parts.find((part) => part.type === 'year')?.value);
  const month = Number(parts.find((part) => part.type === 'month')?.value);

  return { year, month };
}

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  const { year, month } = seoulYearMonth(new Date());
  const currentMonth =
    mockTransactionMonths.find((item) => item.year === year && item.month === month) ??
    mockTransactionMonths[0];

  return (
    <div className='mx-auto flex w-full max-w-240 flex-col gap-5 px-4 pt-24'>
      <div className='grid grid-cols-2 gap-5 lg:grid-cols-4'>
        <SummaryCard
          kind='income'
          amount={1000000000}
          markContent='8.4%'
          markIcon={ArrowUp}
          subContent='전월 대비'
        />
        <SummaryCard
          kind='expense'
          amount={100000}
          markContent='4.1%'
          markIcon={CircleAlert}
          subContent='예산의 82%'
        />
        <SummaryCard
          kind='balance'
          amount={100000}
          markContent='저축률 46.6%'
          subContent='안정적 흐름'
        />
        <SummaryCard
          kind='forecast'
          amount={100000}
          markContent='AI 모멘텀 예측'
          subContent='초과 위험 낮음'
        />
      </div>
      <div>
        <TransactionsCard month={currentMonth} />
      </div>
    </div>
  );
}
