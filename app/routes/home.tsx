import { ArrowUp, CircleAlert } from 'lucide-react';
import SummaryCard from '~/components/ui/summaryCard';
import type { Route } from './+types/home';

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  return (
    <div className='mx-auto grid w-full max-w-240 grid-cols-2 gap-5 px-4 pt-24 lg:grid-cols-4'>
      <SummaryCard
        kind='income'
        amount={1000000000}
        markContent='8.4%'
        markIcon={ArrowUp}
        subContent='전월 대비'
      />
      <SummaryCard
        kind='expense'
        amount={100000}
        markContent='4.1%'
        markIcon={CircleAlert}
        subContent='예산의 82%'
      />
      <SummaryCard
        kind='balance'
        amount={100000}
        markContent='저축률 46.6%'
        subContent='안정적 흐름'
      />
      <SummaryCard
        kind='forecast'
        amount={100000}
        markContent='AI 모멘텀 예측'
        subContent='초과 위험 낮음'
      />
    </div>
  );
}
