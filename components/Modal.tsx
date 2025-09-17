'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useWindowSize } from '@uidotdev/usehooks';
import { ReactNode } from 'react';

export function Modal({ open, onOpenChange, children }: { open: boolean; onOpenChange: any; children: ReactNode }): ReactNode {
  const size: any = useWindowSize();

  if (size.width > 768) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-[425px]'>{children}</DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>{children}</DrawerContent>
    </Drawer>
  );
}
