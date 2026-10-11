function Header() {
  return (
    <header className='fixed top-0 right-0 left-0 z-50 flex h-16 w-full items-center justify-between bg-white px-6'>
      <div className='mx-auto flex w-200 items-center justify-between'>
        <div className='flex items-center justify-center gap-2'>
          <img src='/logos/spendradar-logo.svg' alt='SpendRadar' className='size-10' />
          <div className='text-xl font-bold'>SpendRadar</div>
        </div>
      </div>
    </header>
  );
}

export default Header;
