export type ChatRole = 'assistant' | 'user';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content:
      '안녕하세요. 가계부 내역을 기준으로 소비 패턴을 함께 볼게요. 궁금한 항목부터 물어봐 주세요.',
  },
  {
    id: 'msg-2',
    role: 'user',
    content: '이번 달 지출에서 먼저 보면 좋은 곳이 어디야?',
  },
  {
    id: 'msg-3',
    role: 'assistant',
    content:
      '고정으로 빠지는 항목과 자주 반복되는 결제부터 보는 편이 좋아요. 월세, 통신, 구독처럼 매달 비슷한 금액이 먼저입니다.',
  },
  {
    id: 'msg-4',
    role: 'user',
    content: '식비가 늘었는지 어떻게 보면 돼?',
  },
  {
    id: 'msg-5',
    role: 'assistant',
    content:
      '같은 기간의 식비와 카페 내역을 나란히 두고, 횟수와 한 번에 쓴 금액을 나눠 보세요. 횟수가 늘었는지, 객단가가 올랐는지가 갈립니다.',
  },
  {
    id: 'msg-6',
    role: 'user',
    content: '줄이려면 뭐부터 손대는 게 나아?',
  },
  {
    id: 'msg-7',
    role: 'assistant',
    content:
      '없애도 생활에 바로 영향이 없는 반복 결제부터 정리하는 게 부담이 적어요. 식비는 횟수를 조금 줄이는 쪽을 먼저 보고, 고정 지출은 약정 기간을 확인한 뒤에 건드리는 편이 안전합니다.',
  },
  {
    id: 'msg-8',
    role: 'user',
    content: '알겠어. 다음엔 구독만 모아서 보여줘.',
  },
];
