import { CreditCardPlus, Plus } from 'lucide-react';
import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import toast from 'react-hot-toast';
import { flattenError, type ZodError } from 'zod';
import { addTransactionSchema, type AddTransactionSchema } from '~/schema/add-transaction';
import {
  transactionCategories,
  transactionCategoryValues,
  type TransactionCategory,
  type TransactionKind,
} from '~/types/transaction';
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

type AddTransactionFieldErrors = Partial<Record<keyof AddTransactionSchema, string>>;

function isTransactionCategory(value: string | null): value is TransactionCategory {
  return transactionCategoryValues.some((category) => category === value);
}

function parseLocalDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return undefined;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return undefined;
  }

  return date;
}

function toFieldErrors(error: ZodError<AddTransactionSchema>): AddTransactionFieldErrors {
  const { fieldErrors } = flattenError(error);

  return {
    transactionKind: fieldErrors.transactionKind?.[0],
    amount: fieldErrors.amount?.[0],
    merchantName: fieldErrors.merchantName?.[0],
    category: fieldErrors.category?.[0],
    paymentMethod: fieldErrors.paymentMethod?.[0],
    date: fieldErrors.date?.[0],
  };
}

const transactionKinds: { value: TransactionKind; label: string }[] = [
  { value: 'expense', label: '지출 (Expense)' },
  { value: 'income', label: '수입 (Income)' },
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
  const [transactionKind, setTransactionKind] = useState<TransactionKind>('expense');
  const [amount, setAmount] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [category, setCategory] = useState(transactionCategories[0].value);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [date, setDate] = useState('');
  const [fieldErrors, setFieldErrors] = useState<AddTransactionFieldErrors>({});
  const selectedCategory =
    transactionCategories.find((item) => item.value === category) ?? transactionCategories[0];
  const SelectedCategoryIcon = selectedCategory.icon;

  function resetForm() {
    setTransactionKind('expense');
    setAmount('');
    setMerchantName('');
    setCategory(transactionCategories[0].value);
    setPaymentMethod('');
    setDate('');
    setFieldErrors({});
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);

    if (!open) {
      resetForm();
    }
  }

  function clearFieldError(field: keyof AddTransactionSchema) {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      return { ...current, [field]: undefined };
    });
  }

  function handleAmountChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const selection = input.selectionStart ?? input.value.length;
    const digitsBeforeCaret = digitsOnly(input.value.slice(0, selection)).length;
    const nextAmount = digitsOnly(input.value);

    setAmount(nextAmount);
    clearFieldError('amount');

    const formatted = formatAmount(nextAmount);
    const nextCaret = caretIndexForDigitCount(formatted, digitsBeforeCaret);

    requestAnimationFrame(() => {
      input.setSelectionRange(nextCaret, nextCaret);
    });
  }

  function handleCategoryChange(value: string | null) {
    if (!isTransactionCategory(value)) {
      return;
    }

    setCategory(value);
    clearFieldError('category');
  }

  function handleMerchantNameChange(event: ChangeEvent<HTMLInputElement>) {
    setMerchantName(event.target.value);
    clearFieldError('merchantName');
  }

  function handlePaymentMethodChange(event: ChangeEvent<HTMLInputElement>) {
    setPaymentMethod(event.target.value);
    clearFieldError('paymentMethod');
  }

  function handleDateChange(event: ChangeEvent<HTMLInputElement>) {
    setDate(event.target.value);
    clearFieldError('date');
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = addTransactionSchema.safeParse({
      transactionKind,
      amount: Number(amount || 0),
      merchantName,
      category,
      paymentMethod,
      date: parseLocalDate(date),
    });

    if (!result.success) {
      setFieldErrors(toFieldErrors(result.error));
      return;
    }

    toast.success('거래 내역을 기록했습니다');
    resetForm();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant='default'
            className='flex h-auto flex-row items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90'
          />
        }
      >
        <Plus className='size-5' />
        <span className='text-base font-bold'>거래 내역 추가</span>
      </DialogTrigger>
      <DialogContent className='min-w-0 gap-8 overflow-hidden px-6 py-8 sm:max-w-xl'>
        <DialogHeader>
          <div className='flex flex-row items-center gap-5'>
            <CreditCardPlus className='size-10 bg-primary/20 rounded-full p-2' />
            <div className='flex flex-col'>
              <DialogTitle className='text-lg font-bold'>소비 / 수입 내역 입력</DialogTitle>
              <DialogDescription className='text-sm text-secondary-foreground'>
                카드 명세서에 맞게 입력하면 ai 카테고리 분류가 적용됩니다.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form className='flex flex-col gap-6' onSubmit={handleSubmit} noValidate>
          <div className='flex flex-col gap-1'>
            <div className='flex w-full items-center gap-1 rounded-full bg-[#eff4ff] p-1'>
              {transactionKinds.map((item) => {
                const isSelected = transactionKind === item.value;

                return (
                  <Button
                    key={item.value}
                    type='button'
                    variant='ghost'
                    className={
                      isSelected
                        ? 'h-auto min-w-0 w-full flex-1 shrink rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm hover:bg-white'
                        : 'h-auto min-w-0 w-full flex-1 shrink rounded-full px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-white/70'
                    }
                    onClick={() => {
                      setTransactionKind(item.value);
                      clearFieldError('transactionKind');
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </div>
            {fieldErrors.transactionKind ? (
              <p className='text-sm text-destructive'>{fieldErrors.transactionKind}</p>
            ) : null}
          </div>

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
                aria-invalid={Boolean(fieldErrors.amount)}
                aria-describedby={fieldErrors.amount ? 'transaction-amount-error' : undefined}
                className={cn(
                  'h-12 bg-tertiary/10 text-2xl font-semibold md:text-2xl',
                  amount ? 'pl-8' : 'px-4',
                )}
              />
            </div>
            {fieldErrors.amount ? (
              <p id='transaction-amount-error' className='text-sm text-destructive'>
                {fieldErrors.amount}
              </p>
            ) : null}
          </div>
          <div className='flex w-full flex-row items-start gap-4'>
            <div className='flex min-w-0 flex-1 flex-col gap-1'>
              <span className='text-sm font-semibold text-gray-500'>사용처/상호명</span>
              <Input
                value={merchantName}
                onChange={handleMerchantNameChange}
                aria-invalid={Boolean(fieldErrors.merchantName)}
                aria-describedby={
                  fieldErrors.merchantName ? 'transaction-merchant-name-error' : undefined
                }
                className='h-12 bg-tertiary/10 text-base font-semibold md:text-base'
              />
              {fieldErrors.merchantName ? (
                <p id='transaction-merchant-name-error' className='text-sm text-destructive'>
                  {fieldErrors.merchantName}
                </p>
              ) : null}
            </div>
            <div className='flex min-w-0 flex-1 flex-col gap-1'>
              <span className='text-sm font-semibold text-gray-500'>카테고리</span>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger
                  aria-invalid={Boolean(fieldErrors.category)}
                  aria-describedby={fieldErrors.category ? 'transaction-category-error' : undefined}
                  className='h-12 w-full bg-tertiary/10 px-3 text-base font-semibold data-[size=default]:h-12'
                >
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
              {fieldErrors.category ? (
                <p id='transaction-category-error' className='text-sm text-destructive'>
                  {fieldErrors.category}
                </p>
              ) : null}
            </div>
          </div>
          <div className='flex w-full flex-row items-start gap-4'>
            <div className='flex min-w-0 flex-1 flex-col gap-1'>
              <span className='text-sm font-semibold text-gray-500'>결제 수단</span>
              <Input
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
                aria-invalid={Boolean(fieldErrors.paymentMethod)}
                aria-describedby={
                  fieldErrors.paymentMethod ? 'transaction-payment-method-error' : undefined
                }
                className='h-12 bg-tertiary/10 text-base font-semibold md:text-base'
              />
              {fieldErrors.paymentMethod ? (
                <p id='transaction-payment-method-error' className='text-sm text-destructive'>
                  {fieldErrors.paymentMethod}
                </p>
              ) : null}
            </div>
            <div className='flex min-w-0 flex-1 flex-col gap-1'>
              <span className='text-sm font-semibold text-gray-500'>결제 일자</span>
              <Input
                type='date'
                value={date}
                onChange={handleDateChange}
                aria-invalid={Boolean(fieldErrors.date)}
                aria-describedby={fieldErrors.date ? 'transaction-date-error' : undefined}
                className='h-12 bg-tertiary/10 text-base font-semibold md:text-base [&::-webkit-calendar-picker-indicator]:brightness-0'
              />
              {fieldErrors.date ? (
                <p id='transaction-date-error' className='text-sm text-destructive'>
                  {fieldErrors.date}
                </p>
              ) : null}
            </div>
          </div>
          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              className='h-12 w-24 rounded-2xl'
              onClick={() => handleOpenChange(false)}
            >
              취소
            </Button>
            <Button type='submit' variant='default' className='h-12 w-42 rounded-2xl'>
              가계부에 기록하기
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddTransactionDialog;
