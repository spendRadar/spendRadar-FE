import { useState } from 'react';

const navItems = [
  { label: '가계부' },
  { label: '자산 분석' },
  { label: '예산 & 목표' },
  { label: 'AI 리포트' },
];

function Header() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <header className='fixed top-0 right-0 left-0 z-50 flex h-16 w-full items-center justify-between bg-white px-6'>
      <div className='mx-auto flex w-200 items-center justify-between'>
        <div className='flex items-center justify-center gap-2'>
          <img src='/logos/spendradar-logo.svg' alt='SpendRadar' className='size-10' />
          <div className='text-xl font-bold'>SpendRadar</div>
        </div>
        <nav className='items-center rounded-full bg-[#eff4ff] p-1 gap-2 hidden sm:flex'>
          {navItems.map((item, index) => (
            <button
              key={item.label}
              type='button'
              className={
                activeTab === index
                  ? 'rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground'
                  : 'rounded-full px-4 py-2 text-sm font-semibold text-secondary-foreground hover:bg-tertiary/10'
              }
              onClick={() => handleTabClick(index)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
