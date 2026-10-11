import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { useRef, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '../ui/carousel';
import { Separator } from '../ui/separator';
const years = Array.from({ length: 2026 - 2010 + 1 }, (_, index) => 2026 - index).reverse();
const months = Array.from({ length: 12 }, (_, index) => index + 1);
const firstYear = years[0];
const lastYear = years[years.length - 1];

function shiftPeriod(year: number, month: number, direction: -1 | 1) {
  const monthIndex = (year - firstYear) * 12 + (month - 1) + direction;
  const lastMonthIndex = (lastYear - firstYear + 1) * 12 - 1;

  if (monthIndex < 0 || monthIndex > lastMonthIndex) {
    return null;
  }

  return {
    year: firstYear + Math.floor(monthIndex / 12),
    month: (monthIndex % 12) + 1,
  };
}

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
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger>
            <Button variant='ghost' className='hover:bg-tertiary/20 rounded-full px-4 py-2'>
              {selectedYear}년 {selectedMonth}월
            </Button>
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
      <Button
        variant='default'
        className='flex h-auto flex-row items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90'
      >
        <Plus className='size-5' />
        <span className='text-base font-bold'>거래 내역 추가</span>
      </Button>
    </div>
  );
}

export default TransactionToolBar;
