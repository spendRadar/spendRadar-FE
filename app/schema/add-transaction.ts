import { z } from 'zod';
import { transactionCategoryValues, transactionKindValues } from '~/types/transaction';

export const addTransactionSchema = z.object({
  transactionKind: z.enum(transactionKindValues, {
    message: '지출 또는 수입을 선택해주세요.',
  }),
  amount: z.number().min(1, { message: '금액은 1원 이상이어야 합니다.' }),
  merchantName: z.string().trim().min(1, { message: '사용처/상호명을 입력해주세요.' }),
  category: z.enum(transactionCategoryValues, {
    message: '카테고리를 선택해주세요.',
  }),
  paymentMethod: z.string().trim().min(1, { message: '결제 수단을 입력해주세요.' }),
  date: z.date({ message: '날짜는 필수 입력 항목입니다.' }),
});

export type AddTransactionSchema = z.infer<typeof addTransactionSchema>;
