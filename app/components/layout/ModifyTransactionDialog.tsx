import {
  Banknote,
  Car,
  Clapperboard,
  Hamburger,
  House,
  ShoppingBag,
  SquarePen,
} from 'lucide-react';
import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import toast from 'react-hot-toast';
import { flattenError, type ZodError } from 'zod';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '~/components/ui/select';
import { cn } from '~/lib/utils';
import { addTransactionSchema, type AddTransactionSchema } from '~/schema/add-transaction';
import {
  transactionCategoryByLabel,
  transactionCategoryValues,
  type Transaction,
  type TransactionCategory,
  type TransactionCategoryOption,
  type TransactionKind,
} from '~/types/transaction';

const transactionKinds: { value: TransactionKind; label: string }[] = [
  { value: 'expense', label: '지출 (Expense)' },
  { value: 'income', label: '수입 (Income)' },
];

const transactionCategories: TransactionCategoryOption[] = [
  { value: 'food', label: '식비 / 카페', icon: Hamburger },
  { value: 'housing', label: '주거 / 통신', icon: House },
  { value: 'shopping', label: '쇼핑 / 패션', icon: ShoppingBag },
  { value: 'transport', label: '교통 / 차량', icon: Car },
  { value: 'leisure', label: '문화 / 여가', icon: Clapperboard },
  { value: 'income', label: '급여 / 부수입', icon: Banknote },
];

interface ModifyTransactionDialogProps {
  open: boolean;
  transaction: Transaction | null;
  date: string;
  onOpenChange: (open: boolean) => void;
}

type ModifyTransactionFieldErrors = Partial<Record<keyof AddTransactionSchema, string>>;

function digitsOnly(value: string) {
  return value.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
}

function formatAmount(value: string) {
  if (!value) {
    return '';
  }

  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function isTransactionCategory(value: string | null): value is TransactionCategory {
  return transactionCategoryValues.some((category) => category === value);
}

function toTransactionCategory(label: string) {
  return transactionCategoryByLabel[label] ?? transactionCategories[0].value;
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

function toFieldErrors(error: ZodError<AddTransactionSchema>): ModifyTransactionFieldErrors {
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

function transactionKindFromAmount(amount: number): TransactionKind {
  return amount < 0 ? 'expense' : 'income';
}

function ModifyTransactionForm({
  transaction,
  date,
  onClose,
}: {
  transaction: Transaction;
  date: string;
  onClose: () => void;
}) {
  const [transactionKind, setTransactionKind] = useState<TransactionKind>(
    transactionKindFromAmount(transaction.amount),
  );
  const [amount, setAmount] = useState(String(Math.abs(transaction.amount)));
  const [merchantName, setMerchantName] = useState(transaction.name);
  const [category, setCategory] = useState(toTransactionCategory(transaction.category));
  const [paymentMethod, setPaymentMethod] = useState(transaction.account);
  const [transactionDate, setTransactionDate] = useState(date);
  const [fieldErrors, setFieldErrors] = useState<ModifyTransactionFieldErrors>({});
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const selectedCategory =
    transactionCategories.find((item) => item.value === category) ?? transactionCategories[0];
  const SelectedCategoryIcon = selectedCategory.icon;

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
    setTransactionDate(event.target.value);
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
      date: parseLocalDate(transactionDate),
    });

    if (!result.success) {
      setFieldErrors(toFieldErrors(result.error));
      return;
    }

    toast.success('거래 내역을 수정했습니다');
    onClose();
  }

  function handleDeleteRequest() {
    setIsDeleteConfirmOpen(true);
  }

  function handleConfirmDelete() {
    toast.success('거래 내역을 삭제했습니다');
    setIsDeleteConfirmOpen(false);
    onClose();
  }

  return (
    <DialogContent className='max-h-[calc(100dvh-2rem)] min-w-0 gap-8 overflow-y-auto px-6 py-8 sm:max-w-xl'>
      <DialogHeader>
        <div className='flex flex-row items-center gap-5'>
          <SquarePen className='size-10 rounded-full bg-primary/20 p-2' />
          <div className='flex flex-col'>
            <DialogTitle className='text-lg font-bold'>거래 내역 수정</DialogTitle>
            <DialogDescription className='text-sm text-secondary-foreground'>
              기록된 내용을 수정하거나 제거할 수 있습니다.
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
              aria-describedby={fieldErrors.amount ? 'modify-transaction-amount-error' : undefined}
              className={cn(
                'h-12 bg-tertiary/10 text-2xl font-semibold md:text-2xl',
                amount ? 'pl-8' : 'px-4',
              )}
            />
          </div>
          {fieldErrors.amount ? (
            <p id='modify-transaction-amount-error' className='text-sm text-destructive'>
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
                fieldErrors.merchantName ? 'modify-transaction-merchant-name-error' : undefined
              }
              className='h-12 bg-tertiary/10 text-base font-semibold md:text-base'
            />
            {fieldErrors.merchantName ? (
              <p id='modify-transaction-merchant-name-error' className='text-sm text-destructive'>
                {fieldErrors.merchantName}
              </p>
            ) : null}
          </div>
          <div className='flex min-w-0 flex-1 flex-col gap-1'>
            <span className='text-sm font-semibold text-gray-500'>카테고리</span>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger
                aria-invalid={Boolean(fieldErrors.category)}
                aria-describedby={
                  fieldErrors.category ? 'modify-transaction-category-error' : undefined
                }
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
              <p id='modify-transaction-category-error' className='text-sm text-destructive'>
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
                fieldErrors.paymentMethod ? 'modify-transaction-payment-method-error' : undefined
              }
              className='h-12 bg-tertiary/10 text-base font-semibold md:text-base'
            />
            {fieldErrors.paymentMethod ? (
              <p id='modify-transaction-payment-method-error' className='text-sm text-destructive'>
                {fieldErrors.paymentMethod}
              </p>
            ) : null}
          </div>
          <div className='flex min-w-0 flex-1 flex-col gap-1'>
            <span className='text-sm font-semibold text-gray-500'>결제 일자</span>
            <Input
              type='date'
              value={transactionDate}
              onChange={handleDateChange}
              aria-invalid={Boolean(fieldErrors.date)}
              aria-describedby={fieldErrors.date ? 'modify-transaction-date-error' : undefined}
              className='h-12 bg-tertiary/10 text-base font-semibold md:text-base [&::-webkit-calendar-picker-indicator]:brightness-0'
            />
            {fieldErrors.date ? (
              <p id='modify-transaction-date-error' className='text-sm text-destructive'>
                {fieldErrors.date}
              </p>
            ) : null}
          </div>
        </div>
        <div className='flex items-center justify-between gap-2'>
          <Button
            type='button'
            variant='destructive'
            className='h-12 w-24 rounded-2xl px-4'
            onClick={handleDeleteRequest}
          >
            제거
          </Button>
          <div className='flex gap-2'>
            <Button
              type='button'
              variant='outline'
              className='h-12 w-24 rounded-2xl'
              onClick={onClose}
            >
              취소
            </Button>
            <Button type='submit' variant='default' className='h-12 w-42 rounded-2xl'>
              수정하기
            </Button>
          </div>
        </div>
      </form>
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className='gap-6 px-6 py-8 sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-lg font-bold'>거래 내역을 제거할까요?</DialogTitle>
            <DialogDescription className='text-sm text-secondary-foreground'>
              제거되면 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              className='h-12 w-24 rounded-2xl'
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              취소
            </Button>
            <Button
              type='button'
              variant='destructive'
              className='h-12 w-24 rounded-2xl px-4'
              onClick={handleConfirmDelete}
            >
              제거하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DialogContent>
  );
}

function ModifyTransactionDialog({
  open,
  transaction,
  date,
  onOpenChange,
}: ModifyTransactionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {transaction ? (
        <ModifyTransactionForm
          key={transaction.id}
          transaction={transaction}
          date={date}
          onClose={() => onOpenChange(false)}
        />
      ) : null}
    </Dialog>
  );
}

export default ModifyTransactionDialog;
