import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

function TransactionToolBar() {
  return (
    <div className='flex flex-row gap-6 bg-white p-6 items-center justify-between rounded-2xl'>
      <div className='flex flex-row items-center gap-2 bg-tertiary/10 rounded-full px-4 py-2'>
        <button className='hover:bg-tertiary/20 rounded-full p-1'>
          <ChevronLeft className='size-5' />
        </button>
        <button className='hover:bg-tertiary/20 rounded-full p-1 text-base font-bold'>
          2025년 3월
        </button>
        <button className='hover:bg-tertiary/20 rounded-full p-1'>
          <ChevronRight className='size-5' />
        </button>
      </div>
      <button className='flex flex-row items-center gap-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2'>
        <Plus className='size-5' />
        <span className='text-base font-bold'>거래 내역 추가</span>
      </button>
    </div>
  );
}

export default TransactionToolBar;
