import {
  Banknote,
  Car,
  Clapperboard,
  CreditCardPlus,
  Hamburger,
  House,
  Plus,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react';
import { useState, type ChangeEvent } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '~/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { cn } from '~/lib/utils';

function digitsOnly(value: string) {
  return value.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
}

function formatAmount(value: string) {
  if (!value) {
    return '';
  }

  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const transactionCategories: { value: string; label: string; icon: LucideIcon }[] = [
  { value: 'food', label: '식비 / 카페', icon: Hamburger },
  { value: 'housing', label: '주거 / 통신', icon: House },
  { value: 'shopping', label: '쇼핑 / 패션', icon: ShoppingBag },
  { value: 'transport', label: '교통 / 차량', icon: Car },
  { value: 'leisure', label: '문화 / 여가', icon: Clapperboard },
  { value: 'income', label: '급여 / 부수입', icon: Banknote },
];

function caretIndexForDigitCount(formatted: string, digitCount: number) {
  if (digitCount <= 0) {
    return 0;
  }

  let seen = 0;

  for (let index = 0; index < formatted.length; index += 1) {
    if (/\d/.test(formatted[index] ?? '')) {
      seen += 1;
    }

    if (seen === digitCount) {
      return index + 1;
    }
  }

  return formatted.length;
}

function AddTransactionDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(transactionCategories[0].value);
  const selectedCategory =
    transactionCategories.find((item) => item.value === category) ?? transactionCategories[0];
  const SelectedCategoryIcon = selectedCategory.icon;

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
  }

  function handleAmountChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const selection = input.selectionStart ?? input.value.length;
    const digitsBeforeCaret = digitsOnly(input.value.slice(0, selection)).length;
    const nextAmount = digitsOnly(input.value);

    setAmount(nextAmount);

    const formatted = formatAmount(nextAmount);
    const nextCaret = caretIndexForDigitCount(formatted, digitsBeforeCaret);

    requestAnimationFrame(() => {
      input.setSelectionRange(nextCaret, nextCaret);
    });
  }

  function handleCategoryChange(value: string | null) {
    if (!value) {
      return;
    }

    setCategory(value);
  }
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <Button
          variant='default'
          className='flex h-auto flex-row items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90'
        >
          <Plus className='size-5' />
          <span className='text-base font-bold'>거래 내역 추가</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='min-w-0 gap-8 overflow-hidden px-6 py-8 sm:max-w-xl'>
        <DialogHeader>
          <div className='flex flex-row items-center gap-5'>
            <CreditCardPlus className='size-10 bg-primary/20 rounded-full p-2' />
            <div className='flex flex-col'>
              <DialogTitle className='text-lg font-bold'>소비 / 수입 내역 입력</DialogTitle>
              <DialogDescription className='text-sm text-secondary-foreground'>
                카드 명세서와 자동 매칭 및 ai 카테고리 분류가 적용됩니다.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-1'>
            <span className='text-sm font-semibold text-gray-500'>금액</span>
            <div className='relative'>
              {amount ? (
                <span className='pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-2xl font-semibold'>
                  ₩
                </span>
              ) : null}
              <Input
                inputMode='numeric'
                autoComplete='off'
                value={formatAmount(amount)}
                onChange={handleAmountChange}
                className={cn(
                  'h-12 bg-tertiary/10 text-2xl font-semibold md:text-2xl',
                  amount ? 'pl-8' : 'px-4',
                )}
              />
            </div>
          </div>
          <div className='flex w-full flex-row items-start gap-4'>
            <div className='flex min-w-0 flex-1 flex-col gap-1'>
              <span className='text-sm font-semibold text-gray-500'>사용처/상호명</span>
              <Input className='h-12 bg-tertiary/10 text-base font-semibold md:text-base' />
            </div>
            <div className='flex min-w-0 flex-1 flex-col gap-1'>
              <span className='text-sm font-semibold text-gray-500'>카테고리</span>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger className='h-12 w-full bg-tertiary/10 px-3 text-base font-semibold data-[size=default]:h-12'>
                  <span className='flex items-center gap-2'>
                    <SelectedCategoryIcon className='size-4' />
                    {selectedCategory.label}
                  </span>
                </SelectTrigger>
                <SelectContent
                  align='start'
                  alignItemWithTrigger={false}
                  side='bottom'
                  className='p-1'
                >
                  {transactionCategories.map((item) => {
                    const CategoryIcon = item.icon;

                    return (
                      <SelectItem
                        key={item.value}
                        value={item.value}
                        className='py-2 pr-2 data-highlighted:bg-primary/10 [&>span:last-child]:hidden'
                      >
                        <CategoryIcon className='size-4' />
                        {item.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='flex w-full flex-row items-start gap-4'>
            <div className='flex min-w-0 flex-1 flex-col gap-1'>
              <span className='text-sm font-semibold text-gray-500'>결제 수단</span>
              <Input className='h-12 bg-tertiary/10 text-base font-semibold md:text-base' />
            </div>
            <div className='flex min-w-0 flex-1 flex-col gap-1'>
              <span className='text-sm font-semibold text-gray-500'>결제 일자</span>
              <Input
                type='date'
                className='h-12 bg-tertiary/10 text-base font-semibold md:text-base [&::-webkit-calendar-picker-indicator]:brightness-0'
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddTransactionDialog;
