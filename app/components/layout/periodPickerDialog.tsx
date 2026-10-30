import { useRef, useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '../ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Separator } from '~/components/ui/separator';
import { months, years } from '~/lib/period';

interface PeriodPickerDialogProps {
  selectedYear: number;
  selectedMonth: number;
  onPeriodChange: (year: number, month: number) => void;
}

export function PeriodPickerDialog({
  selectedYear,
  selectedMonth,
  onPeriodChange,
}: PeriodPickerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftYear, setDraftYear] = useState(selectedYear);
  const [draftMonth, setDraftMonth] = useState(selectedMonth);
  const [yearStartIndex, setYearStartIndex] = useState(() =>
    Math.max(years.indexOf(selectedYear), 0),
  );
  const [monthStartIndex, setMonthStartIndex] = useState(() =>
    Math.max(months.indexOf(selectedMonth), 0),
  );
  const yearApiRef = useRef<CarouselApi>(undefined);
  const monthApiRef = useRef<CarouselApi>(undefined);
  const shouldCommitRef = useRef(false);

  function handleYearApi(api: CarouselApi) {
    yearApiRef.current = api;
  }

  function handleMonthApi(api: CarouselApi) {
    monthApiRef.current = api;
  }

  function handleDraftYearChange(year: number) {
    setDraftYear(year);
    yearApiRef.current?.scrollTo(years.indexOf(year));
  }

  function handleDraftMonthChange(month: number) {
    setDraftMonth(month);
    monthApiRef.current?.scrollTo(months.indexOf(month));
  }

  function handleOpenChange(open: boolean) {
    if (open) {
      shouldCommitRef.current = false;
      setDraftYear(selectedYear);
      setDraftMonth(selectedMonth);
      setYearStartIndex(Math.max(years.indexOf(selectedYear), 0));
      setMonthStartIndex(Math.max(months.indexOf(selectedMonth), 0));
      setIsOpen(true);
      return;
    }

    if (!shouldCommitRef.current) {
      setDraftYear(selectedYear);
      setDraftMonth(selectedMonth);
    }

    shouldCommitRef.current = false;
    setIsOpen(false);
  }

  function handleConfirm() {
    shouldCommitRef.current = true;
    onPeriodChange(draftYear, draftMonth);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant='ghost'
            className='w-36 rounded-full px-4 py-2 tabular-nums hover:bg-tertiary/20'
          />
        }
      >
        {selectedYear}년 {selectedMonth}월
      </DialogTrigger>

      <DialogContent className='min-w-0 gap-8 overflow-hidden px-6 py-8 sm:max-w-xl'>
        <DialogHeader className='gap-2'>
          <DialogTitle className='text-lg font-bold'>조회 기간 선택</DialogTitle>
          <DialogDescription className='text-sm text-secondary-foreground'>
            확인할 연도와 월을 선택하세요.
          </DialogDescription>
        </DialogHeader>

        <div className='flex min-w-0 flex-col gap-8'>
          <div className='flex min-w-0 flex-col gap-3'>
            <span className='text-sm font-semibold'>년도</span>
            <Carousel
              setApi={handleYearApi}
              opts={{
                align: 'center',
                containScroll: 'keepSnaps',
                startIndex: yearStartIndex,
              }}
              className='w-full min-w-0 px-10'
            >
              <CarouselContent>
                {years.map((year) => (
                  <CarouselItem key={year} className='basis-1/3'>
                    <Button
                      type='button'
                      variant={year === draftYear ? 'default' : 'ghost'}
                      className='h-10 w-full rounded-full text-sm font-semibold'
                      onClick={() => handleDraftYearChange(year)}
                    >
                      {year}년
                    </Button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className='left-0' />
              <CarouselNext className='right-0' />
            </Carousel>
            <Separator />
          </div>
          <div className='flex min-w-0 flex-col gap-3'>
            <span className='text-sm font-semibold'>월</span>
            <Carousel
              setApi={handleMonthApi}
              opts={{
                align: 'center',
                containScroll: 'keepSnaps',
                startIndex: monthStartIndex,
              }}
              className='w-full min-w-0 px-10'
            >
              <CarouselContent>
                {months.map((month) => (
                  <CarouselItem key={month} className='basis-1/3'>
                    <Button
                      type='button'
                      variant={month === draftMonth ? 'default' : 'ghost'}
                      className='h-10 w-full rounded-full text-sm font-semibold'
                      onClick={() => handleDraftMonthChange(month)}
                    >
                      {month}월
                    </Button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className='left-0' />
              <CarouselNext className='right-0' />
            </Carousel>
            <Separator />
          </div>
        </div>

        <div className='flex w-full gap-3'>
          <Button
            variant='outline'
            className='h-auto min-w-0 flex-1'
            onClick={() => handleOpenChange(false)}
          >
            취소
          </Button>
          <Button className='h-12 min-w-0 flex-1' onClick={handleConfirm}>
            확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
