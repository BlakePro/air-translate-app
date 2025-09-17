import { ReactNode } from 'react';

export const Layout = ({ session, className, children }: { session: any; className: string; children: ReactNode }): ReactNode => {
  return (
    <div className='w-full max-w-6xl mx-auto p-4 flex flex-col'>
      {session?.user ? (
        <div className='fixed left-0 z-20 mx-auto top-6 w-full flex flex-row items-center gap-6 justify-center'>
          <div className={`flex flex-row items-center gap-1.5 border shadow-xs p-0.5 pr-4 rounded-full ${className}`}>
            <div className=''>
              <img src={session?.user?.image} alt={session?.user?.name} className='size-9 rounded-full' loading='lazy' />
            </div>
            <div className='w-32 text-center truncate font-semibold'>{session?.user?.name}</div>
          </div>
        </div>
      ) : null}
      <div className='w-full h-[95vh] flex items-center justify-center py-4'>{children}</div>
    </div>
  );
};
