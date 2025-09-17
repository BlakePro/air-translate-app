import { Layout } from '@/layouts/Layout';
import { Room } from '@/layouts/Room';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const defaultListLanguage: any = {
  en: 'eng',
  es: 'spa',
};

export default async function PageRoom(props: any) {
  const session = await auth();
  const { id } = await props?.params;
  const headersList: any = await headers();

  const acceptLanguage = (headersList.get('accept-language') ?? 'en').toString();
  const language = acceptLanguage?.split(',')?.[0]?.split('-')?.[0];
  const defaultLanguage = defaultListLanguage?.[language] ?? 'en';

  return (
    <Layout session={session} className='bg-green-200 border-green-400 dark:bg-green-700 dark:border-green-600'>
      <Room id={id} defaultLanguage={defaultLanguage} />
    </Layout>
  );
}
