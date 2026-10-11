import { ArrowUp, CircleAlert, ShoppingBasket } from 'lucide-react';
import SummaryCard from '~/components/ui/summaryCard';
import TransactionsCard from '~/components/ui/transactionsCard';
import type { TransactionMonth } from '~/types/transaction';
import type { Route } from './+types/home';

function seoulISODate(date: Date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function shiftISODate(isoDate: string, days: number) {
  const [year, month, day] = isoDate.split('-').map(Number);
  const shifted = new Date(Date.UTC(year, month - 1, day + days));
  const nextYear = shifted.getUTCFullYear();
  const nextMonth = String(shifted.getUTCMonth() + 1).padStart(2, '0');
  const nextDay = String(shifted.getUTCDate()).padStart(2, '0');

  return `${nextYear}-${nextMonth}-${nextDay}`;
}

function createSampleMonth(): TransactionMonth {
  const today = seoulISODate(new Date());
  const yesterday = shiftISODate(today, -1);
  const [year, month] = today.split('-').map(Number);
  const convenience = {
    name: '씨유(CU) 태평본점',
    category: '편의점',
    account: '토스뱅크 통장',
    amount: -2500,
    icon: ShoppingBasket,
  };

  return {
    year,
    month,
    days: [
      {
        date: today,
        summary: { expense: 7500, income: 0 },
        transactions: [
          { id: 'today-1', ...convenience },
          { id: 'today-2', ...convenience },
          { id: 'today-3', ...convenience },
        ],
      },
      {
        date: yesterday,
        summary: { expense: 5000, income: 123123 },
        transactions: [
          { id: 'yesterday-1', ...convenience },
          { id: 'yesterday-2', ...convenience },
        ],
      },
    ],
  };
}

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
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
        <TransactionsCard month={createSampleMonth()} />
      </div>
    </div>
  );
}
