import { useState } from 'react';
import { Dot } from 'lucide-react';
import ModifyTransactionDialog from '~/components/layout/ModifyTransactionDialog';
import type { Transaction, TransactionDay, TransactionMonth } from '~/types/transaction';
import TransactionItem from './transactionItem';

interface TransactionsCardProps {
  month: TransactionMonth;
}

function seoulISODate(date: Date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function formatWon(amount: number) {
  return `${new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 }).format(amount)}원`;
}

function formatDayHeading(date: string) {
  const [, month, day] = date.split('-');

  return `${Number(month)}월 ${Number(day)}일`;
}

function formatDayBadge(date: string, today: string) {
  if (date === today) {
    return '오늘';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    weekday: 'long',
  }).format(new Date(`${date}T00:00:00+09:00`));
}

function DaySection({
  day,
  today,
  onEdit,
}: {
  day: TransactionDay;
  today: string;
  onEdit: (transaction: Transaction) => void;
}) {
  return (
    <>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-row items-center justify-between'>
          <div className='flex flex-row items-center gap-3'>
            <span className='text-base font-bold'>{formatDayHeading(day.date)}</span>
            <span className='text-sm font-bold text-red-500'>
              {formatDayBadge(day.date, today)}
            </span>
          </div>
          <div className='flex flex-row items-center gap-1 text-sm text-red-500'>
            <span>지출 {formatWon(day.summary.expense)}</span>
            <Dot className='size-2' />
            <span>수입 {formatWon(day.summary.income)}</span>
          </div>
        </div>
        <div className='h-px w-full bg-border' />
      </div>
      <div className='flex flex-col'>
        {day.transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            name={transaction.name}
            category={transaction.category}
            account={transaction.account}
            amount={transaction.amount}
            icon={transaction.icon}
            onClick={() => onEdit(transaction)}
          />
        ))}
      </div>
    </>
  );
}

function TransactionsCard({ month }: TransactionsCardProps) {
  const today = seoulISODate(new Date());
  const transactionCount = month.days.reduce((count, day) => count + day.transactions.length, 0);
  const [editing, setEditing] = useState<{ date: string; transaction: Transaction } | null>(null);

  return (
    <div className='flex flex-col gap-6 bg-white p-6 rounded-2xl shadow-sm'>
      <div className='flex flex-row items-center gap-4'>
        <span className='text-xl font-bold'>{month.month}월 거래 내역</span>
        <span className='rounded-full bg-tertiary/10 px-2 py-1 text-sm font-bold text-gray-500'>
          총 {transactionCount}건
        </span>
      </div>
      {month.days.map((day) => (
        <DaySection
          key={day.date}
          day={day}
          today={today}
          onEdit={(transaction) => setEditing({ date: day.date, transaction })}
        />
      ))}
      <ModifyTransactionDialog
        open={editing !== null}
        transaction={editing?.transaction ?? null}
        date={editing?.date ?? ''}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null);
          }
        }}
      />
    </div>
  );
}

export default TransactionsCard;
