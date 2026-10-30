import { ArrowUp, CircleAlert } from 'lucide-react';
import SummaryCard from '~/components/ui/summaryCard';
import TransactionsCard from '~/components/ui/transactionsCard';
import { mockTransactionMonths } from '~/mocks/transactions';
import TransactionToolBar from '~/components/layout/transactionToolBar';
import type { TransactionMonth } from '~/types/transaction';
import { useState } from 'react';
import type { MetaFunction } from 'react-router';

function monthAmount(month: TransactionMonth, kind: 'income' | 'expense') {
  return month.days.reduce((total, day) => total + day.summary[kind], 0);
}

export const meta: MetaFunction = () => {
  return [
    { title: 'SpendRadar' },
    { name: 'description', content: 'Expense tracker page of SpendRadar' },
  ];
};

export default function Home() {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(3);
  const currentMonth = mockTransactionMonths.find(
    (item) => item.year === selectedYear && item.month === selectedMonth,
  ) ?? {
    year: selectedYear,
    month: selectedMonth,
    days: [],
  };

  function handlePeriodChange(year: number, month: number) {
    setSelectedYear(year);
    setSelectedMonth(month);
  }

  return (
    <div className='mx-auto flex w-full max-w-240 flex-col gap-5 px-4 pt-24'>
      <TransactionToolBar
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onPeriodChange={handlePeriodChange}
      />
      <div className='grid grid-cols-2 gap-5 lg:grid-cols-4'>
        <SummaryCard
          kind='income'
          amount={monthAmount(currentMonth, 'income')}
          markContent='8.4%'
          markIcon={ArrowUp}
          subContent='전월 대비'
        />
        <SummaryCard
          kind='expense'
          amount={monthAmount(currentMonth, 'expense')}
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
