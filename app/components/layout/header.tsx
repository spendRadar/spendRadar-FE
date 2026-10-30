import { Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { Outlet, useLocation, useNavigate } from 'react-router';

const navItems = [
  { label: '가계부', path: 'home' },
  { label: '자산 분석', path: 'assets' },
  { label: '예산 & 목표', path: 'dashboard' },
];

function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const activeTab = navItems.findIndex((item) => pathname === `/${item.path}`);

  function handleTabClick(index: number) {
    navigate(`/${navItems[index].path}`);
  }

  return (
    <>
      <header className='fixed top-0 right-0 left-0 z-50 flex h-16 w-full items-center justify-between bg-white px-6'>
        <div className='mx-auto flex w-240 items-center justify-between'>
          <div className='flex items-center justify-center gap-2'>
            <img src='/logos/spendradar-logo.svg' alt='SpendRadar' className='size-10' />
            <div className='text-xl font-bold'>SpendRadar</div>
          </div>
          <nav className='items-center rounded-full bg-[#eff4ff] p-1 gap-2 hidden sm:flex'>
            {navItems.map((item, index) => (
              <Button
                key={item.label}
                type='button'
                variant={activeTab === index ? 'default' : 'ghost'}
                className={
                  activeTab === index
                    ? 'h-auto rounded-full px-4 py-2 text-sm font-semibold shadow-sm'
                    : 'h-auto rounded-full px-4 py-2 text-sm font-semibold text-secondary-foreground hover:bg-tertiary/10'
                }
                onClick={() => handleTabClick(index)}
              >
                {item.label}
              </Button>
            ))}
          </nav>
          <div className='flex items-center justify-center'>
            <Button variant='ghost' className='hover:bg-tertiary/10 rounded-full p-2'>
              <div className='relative'>
                <Bell className='size-5' />
                <div className='absolute -top-1 -right-1 size-2 rounded-full bg-red-500' />
              </div>
            </Button>
          </div>
        </div>
      </header>
      <Outlet />
    </>
  );
}

export default Header;
