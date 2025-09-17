'use client';
import { ModeToggle } from '@/components/ModeToggle';
import { Button } from '@/components/ui/button';
import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr';
import { useTransitionRouter } from 'next-view-transitions';
import { ReactNode } from 'react';

export const Layout = ({ session, isBack, className, children }: { session: any; isBack: boolean; className: string; children: ReactNode }): ReactNode => {
  const router = useTransitionRouter();

  const onBack = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    router.back();
  };

  return (
    <>
      {session?.user ? (
        <div className='fixed left-0 z-20 mx-auto top-6 w-full'>
          <div className='w-full max-w-6xl mx-auto px-4'>
            <div className='w-full flex items-center justify-between'>
              <div className='w-32'>
                {isBack ? (
                  <Button variant='link' onClick={onBack}>
                    <CaretLeftIcon className='size-5' />
                    Back
                  </Button>
                ) : null}
              </div>
              <div className={`w-fit flex flex-row items-center gap-1.5 border shadow-xs p-0.5 pr-4 rounded-full ${className}`}>
                <div className=''>
                  <img src={session?.user?.image} alt={session?.user?.name} className='size-9 rounded-full' loading='lazy' />
                </div>
                <div className='w-32 text-center truncate font-semibold'>{session?.user?.name}</div>
              </div>
              <div className='w-fit'>
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className='w-full max-w-6xl mx-auto p-4'>
        <div className='w-full h-[95vh] flex items-center justify-center py-4'>{children}</div>
      </div>
    </>
  );
};
