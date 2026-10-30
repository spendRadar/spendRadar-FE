import { BotIcon } from 'lucide-react';
import { useRef, useState, type KeyboardEvent, type SubmitEvent } from 'react';
import { Button } from '~/components/ui/button';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Textarea } from '~/components/ui/textarea';

type ChatRole = 'assistant' | 'user';

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

const chatMessages: ChatMessage[] = [
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

function Assets() {
  const [messages, setMessages] = useState(chatMessages);
  const [draft, setDraft] = useState('');
  const threadRef = useRef<HTMLDivElement>(null);
  const canSend = draft.trim().length > 0;

  function scrollThreadToEnd() {
    requestAnimationFrame(() => {
      const viewport = threadRef.current?.querySelector('[data-slot="scroll-area-viewport"]');

      if (viewport instanceof HTMLElement) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    });
  }

  function sendMessage() {
    const content = draft.trim();

    if (!content) {
      return;
    }

    setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'user', content }]);
    setDraft('');
    scrollThreadToEnd();
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage();
  }

  function handleDraftKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className='mx-auto flex w-full max-w-240 flex-col gap-10 px-4 pt-24'>
      <div className='flex flex-col gap-5'>
        <h1 className='text-4xl font-bold'>FinAI 자산 분석 & 금융 어시스턴트</h1>
        <p className='text-base text-secondary-foreground'>
          가계부 내역과 AI 지출 예측을 바탕으로 FinAI와 자유롭게 대화하고, 맞춤형 소비 분석과 지출
          관리 조언을 받아보세요.
        </p>
      </div>
      <div className='flex h-[calc(100dvh-18rem)] min-h-120 w-full flex-col overflow-hidden rounded-2xl bg-white shadow-md'>
        <div className='flex w-full flex-row gap-4 border-b p-6'>
          <BotIcon className='size-12 rounded-full bg-secondary p-2 text-primary' />
          <div>
            <p className='text-xl font-bold'>FinAI 에이전트</p>
            <p className='text-base text-gray-500'>
              가계부 내역과 AI 지출 예측 기반 맞춤형 소비 상담
            </p>
          </div>
        </div>
        <ScrollArea ref={threadRef} className='min-h-0 flex-1'>
          <div className='flex flex-col gap-4 px-6 py-5'>
            {messages.map((message) =>
              message.role === 'assistant' ? (
                <div key={message.id} className='flex items-start gap-3'>
                  <div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary'>
                    <BotIcon className='size-4 text-primary' />
                  </div>
                  <p className='max-w-[75%] rounded-2xl bg-[#eff4ff] px-4 py-3 text-sm leading-6'>
                    {message.content}
                  </p>
                </div>
              ) : (
                <div key={message.id} className='flex justify-end'>
                  <p className='max-w-[75%] rounded-2xl bg-primary px-4 py-3 text-sm leading-6 text-primary-foreground'>
                    {message.content}
                  </p>
                </div>
              ),
            )}
          </div>
        </ScrollArea>
        <form className='flex items-end gap-2 border-t px-6 py-4' onSubmit={handleSubmit}>
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleDraftKeyDown}
            placeholder='메시지를 입력하세요'
            rows={1}
            className='max-h-32 min-h-12 flex-1 resize-none overflow-y-auto bg-[#eff4ff]'
          />
          <Button type='submit' disabled={!canSend} className='h-12 rounded-xl px-4'>
            전송
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Assets;
