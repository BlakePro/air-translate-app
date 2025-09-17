import { Login } from '@/layouts/Login';
import { auth } from '@/lib/auth';

export default async function PageLogin() {
  const _session = await auth();
  //if (session?.user) return redirect('/dashboard');
  return <Login />;
}
