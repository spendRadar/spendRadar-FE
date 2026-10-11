import TransactionItem from './transactionItem';
import { ShoppingBasket } from 'lucide-react';

function TransactionsCard() {
  return (
    <div>
      <TransactionItem
        name='씨유(CU) 태평본점'
        category='편의점'
        account='토스뱅크 통장'
        amount={-2500}
        icon={ShoppingBasket}
      />
    </div>
  );
}

export default TransactionsCard;
