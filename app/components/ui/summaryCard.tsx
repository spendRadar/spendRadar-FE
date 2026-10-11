import { Sparkles, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '~/lib/utils';

type SummaryCardKind = 'income' | 'expense' | 'balance' | 'forecast';

interface SummaryCardProps {
  kind: SummaryCardKind;
  amount: number;
  changeRate?: number;
  markContent: string;
  markIcon?: LucideIcon;
  subContent: string;
}

const cardContent: Record<
  SummaryCardKind,
  { title: string; icon: LucideIcon; colorClassName: string }
> = {
  income: {
    title: '총 수입',
    icon: TrendingUp,
    colorClassName: 'bg-primary/10 text-primary',
  },
  expense: {
    title: '총 지출',
    icon: TrendingDown,
    colorClassName: 'bg-destructive/10 text-destructive',
  },
  balance: {
    title: '남은 잔액/저축 이력',
    icon: Wallet,
    colorClassName: 'bg-neutral/10 text-neutral',
  },
  forecast: {
    title: '월말 예상 지출(AI)',
    icon: Sparkles,
    colorClassName: 'bg-tertiary/10 text-tertiary',
  },
};

function formatKRW(amount: number) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount);
}

function amountTextClass(formattedAmount: string) {
  return formattedAmount.length >= 10 ? 'text-lg' : 'text-xl';
}

function MarkIconView({ icon: Icon }: { icon: LucideIcon }) {
  return <Icon className='size-3' />;
}

function SummaryCard({ kind, amount, markContent, markIcon, subContent }: SummaryCardProps) {
  const content = cardContent[kind];
  const Icon = content.icon;
  const formattedAmount = formatKRW(amount);
  return (
    <div className='flex h-auto min-h-34 w-full min-w-0 flex-col justify-between bg-white p-4'>
      <div className='flex items-center justify-between gap-2'>
        <div className='text-sm wrap-anywhere'>{content.title}</div>
        <Icon className={`size-6 shrink-0 rounded-full p-1 ${content.colorClassName}`} />
      </div>
      <div className='flex min-w-0 flex-col gap-1'>
        <div className={cn('font-semibold wrap-anywhere', amountTextClass(formattedAmount))}>
          {formattedAmount}
        </div>
        <div className='flex min-w-0 flex-wrap items-center gap-2 text-sm text-secondary-foreground'>
          <div
            className={cn(
              'flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs',
              content.colorClassName,
            )}
          >
            {markIcon ? <MarkIconView icon={markIcon} /> : null}
            {markContent}
          </div>
          <div className='text-xs'>{subContent}</div>
        </div>
      </div>
    </div>
  );
}

export default SummaryCard;
export type { SummaryCardKind };
