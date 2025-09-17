import { Dashboard } from '@/layouts/Dashboard';
import { Layout } from '@/layouts/Layout';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function PageHome() {
  const session = await auth();
  if (!session?.user) return redirect('/');
  return (
    <Layout session={session} className='bg-white dark:bg-slate-900'>
      <div className='w-full sm:max-w-md flex flex-col gap-2'>
        <Dashboard session={session} />
      </div>
    </Layout>
  );
}
