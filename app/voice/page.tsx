import { Layout } from '@/layouts/Layout';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function PageVoice() {
  const session = await auth();
  if (!session?.user) return redirect('/');
  return (
    <Layout session={session} isBack={true} className='bg-white dark:bg-slate-900'>
      Voices coming soon!
    </Layout>
  );
}
