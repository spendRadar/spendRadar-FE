import TransactionItem from './transactionItem';
import { Dot, ShoppingBasket } from 'lucide-react';

function TransactionsCard() {
  return (
    <div className='flex flex-col gap-6 bg-white p-6'>
      <div className='flex flex-row items-center gap-4'>
        <span className='text-xl font-bold'>3월 거래 내역</span>
        <span className='text-sm bg-tertiary/10 text-gray-500 rounded-full px-2 py-1 font-bold'>
          총 42건
        </span>
      </div>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-row items-center justify-between'>
          <div className='flex flex-row gap-3 items-center'>
            <span className='text-base font-bold'>3월 24일</span>
            <span className='text-sm text-red-500 font-bold'>오늘</span>
          </div>
          <div className='flex flex-row gap-1 items-center text-sm text-red-500'>
            <span>지출 123,123원</span> <Dot className='size-2' /> <span>수입 123,123원</span>
          </div>
        </div>
        <div className='h-px w-full bg-border' />
      </div>
      <div className='flex flex-col'>
        <TransactionItem
          name='씨유(CU) 태평본점'
          category='편의점'
          account='토스뱅크 통장'
          amount={-2500}
          icon={ShoppingBasket}
        />
        <TransactionItem
          name='씨유(CU) 태평본점'
          category='편의점'
          account='토스뱅크 통장'
          amount={-2500}
          icon={ShoppingBasket}
        />
        <TransactionItem
          name='씨유(CU) 태평본점'
          category='편의점'
          account='토스뱅크 통장'
          amount={-2500}
          icon={ShoppingBasket}
        />
      </div>

      <div className='flex flex-col gap-2'>
        <div className='flex flex-row items-center justify-between'>
          <div className='flex flex-row gap-3 items-center'>
            <span className='text-base font-bold'>3월 23일</span>
            <span className='text-sm text-red-500 font-bold'>금요일</span>
          </div>
          <div className='flex flex-row gap-1 items-center text-sm text-red-500'>
            <span>지출 123,123원</span> <Dot className='size-2' /> <span>수입 123,123원</span>
          </div>
        </div>
        <div className='h-px w-full bg-border' />
      </div>
      <div className='flex flex-col'>
        <TransactionItem
          name='씨유(CU) 태평본점'
          category='편의점'
          account='토스뱅크 통장'
          amount={-2500}
          icon={ShoppingBasket}
        />
        <TransactionItem
          name='씨유(CU) 태평본점'
          category='편의점'
          account='토스뱅크 통장'
          amount={-2500}
          icon={ShoppingBasket}
        />
        <TransactionItem
          name='씨유(CU) 태평본점'
          category='편의점'
          account='토스뱅크 통장'
          amount={-2500}
          icon={ShoppingBasket}
        />
      </div>
    </div>
  );
}

export default TransactionsCard;
