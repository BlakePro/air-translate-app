import { Login } from '@/layouts/Login';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function PageLogin() {
  const session = await auth();
  if (session?.user) return redirect('/dashboard');
  return <Login />;
}
