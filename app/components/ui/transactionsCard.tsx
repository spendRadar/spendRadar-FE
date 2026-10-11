import { ShoppingBasket } from 'lucide-react';

function TransactionsCard() {
  return (
    <div className='flex h-auto min-h-20 w-full flex-row items-center justify-between bg-white hover:bg-tertiary/10'>
      <div className='flex flex-row items-center justify-between gap-2'>
        <div className='size-10 rounded-full bg-primary/10 flex items-center justify-center'>
          <ShoppingBasket className='size-5' />
        </div>
        <div className='flex flex-col gap-1'>
          <span className='text-base font-bold'>씨유(CU) 태평본점</span>
          <span className='text-xs text-gray-500'>편의점 | 토스뱅크 통장</span>
        </div>
      </div>
      <div className='text-sm font-bold'>-2,500원</div>
    </div>
  );
}

export default TransactionsCard;
