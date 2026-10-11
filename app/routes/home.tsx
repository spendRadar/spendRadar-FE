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
    <div className='mx-auto grid w-full max-w-200 grid-cols-2 gap-5 px-4 pt-24 md:grid-cols-4'>
      <SummaryCard />
      <SummaryCard />
      <SummaryCard />
      <SummaryCard />
    </div>
  );
}
