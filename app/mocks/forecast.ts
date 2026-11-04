/**
 * 2026년 11월 지출 예측 더미.
 * 모델 결과가 아닌 화면 확인용 가상 값입니다.
 */
export interface MockMonthForecast {
  predictedExpense: number;
  confidenceInterval?: number;
}

export const mockMonthForecasts: Record<string, MockMonthForecast> = {
  '2026-11-all': { predictedExpense: 2880000, confidenceInterval: 150000 },
  '2026-11-food': { predictedExpense: 360000, confidenceInterval: 20000 },
  '2026-11-housing': { predictedExpense: 1400000, confidenceInterval: 60000 },
  '2026-11-shopping': { predictedExpense: 750000, confidenceInterval: 40000 },
  '2026-11-transport': { predictedExpense: 190000, confidenceInterval: 15000 },
  '2026-11-leisure': { predictedExpense: 180000, confidenceInterval: 12000 },
};
