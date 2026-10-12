const years = Array.from({ length: 2026 - 2010 + 1 }, (_, index) => 2026 - index).reverse();
const months = Array.from({ length: 12 }, (_, index) => index + 1);
const firstYear = years[0];
const lastYear = years[years.length - 1];

export { years, months };

export function shiftPeriod(year: number, month: number, direction: -1 | 1) {
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
