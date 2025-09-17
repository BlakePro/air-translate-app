'use client';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { DrawerTitle } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneOutgoingIcon, PlayIcon, WaveformIcon } from '@phosphor-icons/react/dist/ssr';
import { Link, useTransitionRouter } from 'next-view-transitions';
import { ReactNode, useState } from 'react';

export const Dashboard = ({ session }: { session: any }): ReactNode => {
  const router = useTransitionRouter();
  const [open, setOpen] = useState<boolean>(false);

  const onRoom = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    const elem = document.getElementById('roomId') as HTMLInputElement;
    const roomId = (elem?.value ?? '').toString();
    if (roomId !== '') router.push(`/room/${roomId}`);
  };

  const onModal = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setOpen(!open);
  };

  return (
    <>
      <div className='w-full flex flex-col gap-6'>
        <div className='w-full flex flex-row gap-6'>
          <Link href={`/room/${session?.user?.name}`} className='w-full p-8 shadow-xs flex flex-col items-center justify-center gap-3 border hover:border-slate-800 dark:hover:border-slate-400 rounded-lg'>
            <PlayIcon className='size-12' />
            Start
          </Link>
          <button type='button' onClick={onModal} className='w-full p-8 shadow-xs flex flex-col items-center justify-center gap-3 border hover:border-slate-800 dark:hover:border-slate-400 rounded-lg'>
            <PhoneOutgoingIcon className='size-12' />
            Join
          </button>
        </div>
        <Link type='button' href={'/voice'} className='w-full p-8 shadow-xs col-span-2 flex flex-col items-center justify-center gap-3 border hover:border-slate-800 dark:hover:border-slate-400 rounded-lg'>
          <WaveformIcon className='size-12' />
          Customize my voice
        </Link>
      </div>
      <Modal open={open} onOpenChange={setOpen}>
        <div className='w-full md:max-w-lg mx-auto p-6 flex flex-col justify-center items-center gap-6'>
          <DrawerTitle className='hidden'>Join</DrawerTitle>
          <div className='w-full flex flex-col gap-2'>
            <Label htmlFor='roomId'>Name</Label>
            <Input id='roomId' defaultValue='' />
          </div>
          <Button onClick={onRoom} size='lg'>
            <PhoneOutgoingIcon className='size-5' />
            Join
          </Button>
        </div>
      </Modal>
    </>
  );
};
