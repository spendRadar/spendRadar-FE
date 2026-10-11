import { ArrowUp, TrendingUp } from 'lucide-react';

function SummaryCard() {
  return (
    <div className='bg-white p-4 h-34 w-full flex flex-col justify-between'>
      <div className='flex items-center justify-between'>
        <div className='text-sm'>총 수입</div>
        <TrendingUp className='size-5 rounded-full bg-primary/10 p-1 text-primary' />
      </div>
      <div className='flex flex-col justify-between'>
        <div className='text-xl font-bold'>100,000원</div>
        <div className='flex items-center gap-2 text-sm text-secondary-foreground'>
          <div className='flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full'>
            <ArrowUp className='size-4' />
            <span className='text-sm'>8.4 %</span>
          </div>
          <div className='text-xs'>전월 대비</div>
        </div>
      </div>
    </div>
  );
}

export default SummaryCard;
