import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { shiftPeriod } from '~/lib/period';
import { PeriodPickerDialog } from '~/components/layout/periodPickerDialog';
import AddTransactionDialog from './AddTransactionDialog';

interface TransactionToolBarProps {
  selectedYear: number;
  selectedMonth: number;
  onPeriodChange: (year: number, month: number) => void;
}

function TransactionToolBar({
  selectedYear,
  selectedMonth,
  onPeriodChange,
}: TransactionToolBarProps) {
  function handleShiftPeriod(direction: -1 | 1) {
    const nextPeriod = shiftPeriod(selectedYear, selectedMonth, direction);

    if (!nextPeriod) {
      return;
    }

    onPeriodChange(nextPeriod.year, nextPeriod.month);
  }

  return (
    <div className='flex flex-row gap-6 p-6 items-center justify-between '>
      <div className='flex flex-row items-center gap-1 rounded-full bg-tertiary/10 px-2 py-1 sm:gap-2 sm:px-4 sm:py-2'>
        <Button
          type='button'
          variant='ghost'
          className='rounded-full p-0.5 hover:bg-tertiary/20 sm:p-1'
          disabled={shiftPeriod(selectedYear, selectedMonth, -1) === null}
          onClick={() => handleShiftPeriod(-1)}
        >
          <ChevronLeft className='size-4 sm:size-5' />
        </Button>
        <PeriodPickerDialog
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onPeriodChange={onPeriodChange}
        />
        <Button
          type='button'
          variant='ghost'
          className='rounded-full p-0.5 hover:bg-tertiary/20 sm:p-1'
          disabled={shiftPeriod(selectedYear, selectedMonth, 1) === null}
          onClick={() => handleShiftPeriod(1)}
        >
          <ChevronRight className='size-4 sm:size-5' />
        </Button>
      </div>
      <AddTransactionDialog />
    </div>
  );
}

export default TransactionToolBar;
