import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { shiftYear } from '~/lib/period';

interface YearToolBarProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

function YearToolBar({ selectedYear, onYearChange }: YearToolBarProps) {
  function handleShiftYear(direction: -1 | 1) {
    const nextYear = shiftYear(selectedYear, direction);

    if (nextYear === null) {
      return;
    }

    onYearChange(nextYear);
  }

  return (
    <div className='flex shrink-0 flex-row items-center gap-2 rounded-full bg-tertiary/10 px-4 py-2'>
      <Button
        type='button'
        variant='ghost'
        className='rounded-full p-1 hover:bg-tertiary/20'
        disabled={shiftYear(selectedYear, -1) === null}
        onClick={() => handleShiftYear(-1)}
      >
        <ChevronLeft className='size-5' />
      </Button>
      <span className='w-20 py-2 text-center text-sm font-semibold tabular-nums'>
        {selectedYear}년
      </span>
      <Button
        type='button'
        variant='ghost'
        className='rounded-full p-1 hover:bg-tertiary/20'
        disabled={shiftYear(selectedYear, 1) === null}
        onClick={() => handleShiftYear(1)}
      >
        <ChevronRight className='size-5' />
      </Button>
    </div>
  );
}

export default YearToolBar;
