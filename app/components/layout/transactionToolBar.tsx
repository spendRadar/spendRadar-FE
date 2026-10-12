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
    <div className='flex flex-row gap-6 bg-white p-6 items-center justify-between rounded-2xl'>
      <div className='flex flex-row items-center gap-2 bg-tertiary/10 rounded-full px-4 py-2'>
        <Button
          type='button'
          variant='ghost'
          className='hover:bg-tertiary/20 rounded-full p-1'
          disabled={shiftPeriod(selectedYear, selectedMonth, -1) === null}
          onClick={() => handleShiftPeriod(-1)}
        >
          <ChevronLeft className='size-5' />
        </Button>
        <PeriodPickerDialog
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onPeriodChange={onPeriodChange}
        />
        <Button
          type='button'
          variant='ghost'
          className='hover:bg-tertiary/20 rounded-full p-1'
          disabled={shiftPeriod(selectedYear, selectedMonth, 1) === null}
          onClick={() => handleShiftPeriod(1)}
        >
          <ChevronRight className='size-5' />
        </Button>
      </div>
      <AddTransactionDialog />
    </div>
  );
}

export default TransactionToolBar;
