'use client';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoonStarsIcon, SunIcon } from '@phosphor-icons/react/dist/ssr';
import { useTheme } from 'next-themes';

export function ModeToggle() {
  const { setTheme } = useTheme();

  const onTheme =
    (option: string) =>
    (e: React.MouseEvent<HTMLDivElement>): void => {
      e.preventDefault();
      setTheme(option);
    };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='lg' variant='link'>
          <div className='flex items-center justify-center'>
            <SunIcon className='dark:hidden size-5' />
            <MoonStarsIcon className='hidden dark:block size-5' />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={onTheme('light')}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={onTheme('dark')}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={onTheme('system')}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
