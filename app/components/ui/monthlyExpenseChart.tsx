import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { MonthlyExpenseBar } from '~/lib/monthlyExpenseChart';

interface MonthlyExpenseChartProps {
  bars: MonthlyExpenseBar[];
}

const actualColor = '#00c48c';
const forecastColor = '#c026d3';

function formatKrw(amount: number) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatAxisWon(value: number) {
  if (value <= 0) {
    return '₩0';
  }

  return `₩${new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 }).format(Math.round(value / 1000))}k`;
}

function ExpenseTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: readonly { payload?: MonthlyExpenseBar }[];
}) {
  const point = payload?.[0]?.payload;

  if (!active || !point) {
    return null;
  }

  return (
    <div className='rounded-xl bg-white px-3 py-2 text-sm shadow-md'>
      <p className='font-semibold'>{point.label}</p>
      <p className='flex items-center gap-2 text-secondary-foreground tabular-nums'>
        <span className='block size-2 rounded-xs bg-primary' />
        실제 지출 {formatKrw(point.actual)}
      </p>
      {point.predictedExpense !== null ? (
        <p className='flex items-center gap-2 text-fuchsia-700 tabular-nums'>
          <span className='block size-2 rounded-xs bg-fuchsia-600' />
          모델 예측치 {formatKrw(point.predictedExpense)}
        </p>
      ) : null}
    </div>
  );
}

function topRoundedBar(props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  payload?: MonthlyExpenseBar;
}) {
  const { x = 0, y = 0, width = 0, height = 0, fill = actualColor, payload } = props;

  if (height <= 0 || width <= 0) {
    return null;
  }

  const roundTop = !payload?.forecastGap;
  const radius = Math.min(6, width / 2, height);

  if (!roundTop || radius <= 0) {
    return <rect x={x} y={y} width={width} height={height} fill={fill} />;
  }

  const path = [
    `M ${x} ${y + height}`,
    `L ${x} ${y + radius}`,
    `Q ${x} ${y} ${x + radius} ${y}`,
    `L ${x + width - radius} ${y}`,
    `Q ${x + width} ${y} ${x + width} ${y + radius}`,
    `L ${x + width} ${y + height}`,
    'Z',
  ].join(' ');

  return <path d={path} fill={fill} />;
}

function forecastBar(props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
}) {
  const { x = 0, y = 0, width = 0, height = 0, fill = forecastColor } = props;

  if (height <= 0 || width <= 0) {
    return null;
  }

  const radius = Math.min(6, width / 2, height);
  const path = [
    `M ${x} ${y + height}`,
    `L ${x} ${y + radius}`,
    `Q ${x} ${y} ${x + radius} ${y}`,
    `L ${x + width - radius} ${y}`,
    `Q ${x + width} ${y} ${x + width} ${y + radius}`,
    `L ${x + width} ${y + height}`,
    'Z',
  ].join(' ');

  return <path d={path} fill={fill} />;
}

function MonthlyExpenseChart({ bars }: MonthlyExpenseChartProps) {
  const peak = Math.max(...bars.map((bar) => bar.actual + bar.forecastGap), 0);

  return (
    <div className='h-80 w-full' aria-label='월별 지출 차트'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={bars}
          margin={{ top: 8, right: 8, left: 4, bottom: 0 }}
          barCategoryGap='22%'
        >
          <CartesianGrid vertical={false} stroke='#e2e8f0' />
          <XAxis
            dataKey='label'
            interval={0}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis
            domain={[0, peak || 1]}
            tickFormatter={formatAxisWon}
            tickLine={false}
            axisLine={false}
            width={72}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <Tooltip
            content={<ExpenseTooltip />}
            cursor={{ fill: 'rgba(0, 196, 140, 0.08)' }}
            isAnimationActive={false}
          />
          <Bar
            dataKey='actual'
            stackId='expense'
            fill={actualColor}
            shape={topRoundedBar}
            maxBarSize={36}
            background={{ fill: 'transparent' }}
          />
          <Bar
            dataKey='forecastGap'
            stackId='expense'
            fill={forecastColor}
            shape={forecastBar}
            maxBarSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyExpenseChart;
