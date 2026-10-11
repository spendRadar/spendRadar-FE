import type { LucideIcon } from 'lucide-react';

interface TransactionItemProps {
  name: string;
  category: string;
  account: string;
  amount: number;
  icon: LucideIcon;
}

function formatKRW(amount: number) {
  const formatted = new Intl.NumberFormat('ko-KR', {
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));

  return `${amount < 0 ? '-' : ''}${formatted}원`;
}

function TransactionIcon({ icon: Icon }: { icon: LucideIcon }) {
  return <Icon className='size-5' />;
}

function TransactionItem({ name, category, account, amount, icon }: TransactionItemProps) {
  return (
    <div className='flex h-auto min-h-20 w-full flex-row items-center justify-between bg-white hover:bg-tertiary/10 p-4 rounded-md'>
      <div className='flex flex-row items-center gap-2'>
        <div className='flex size-10 items-center justify-center rounded-full bg-primary/10'>
          <TransactionIcon icon={icon} />
        </div>
        <div className='flex flex-col gap-1'>
          <span className='text-base font-bold'>{name}</span>
          <span className='text-xs text-gray-500'>
            {category} | {account}
          </span>
        </div>
      </div>
      <div className='text-sm font-bold'>{formatKRW(amount)}</div>
    </div>
  );
}

export default TransactionItem;
