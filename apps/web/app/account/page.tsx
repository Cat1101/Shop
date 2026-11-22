import Link from 'next/link';
import { AccountForm } from '../../features/account/account-form';
import { logoutAccount } from '../../features/account/actions';
import { getViewer } from '../../features/account/session';

interface Props {
  searchParams: Promise<{ register?: string; next?: string }>;
}

export default async function Account({ searchParams }: Props) {
  const { register, next } = await searchParams;
  const viewer = await getViewer();
  const nextQuery = next === 'checkout' ? 'next=checkout' : '';
  const loginUrl = nextQuery ? `/account?${nextQuery}` : '/account';
  const registerUrl = nextQuery ? `/account?register=1&${nextQuery}` : '/account?register=1';

  return (
    <main className="shell detail-page">
      <Link className="text-link" href="/">К каталогу</Link>
      <section className="detail-card">
        {viewer ? (
          <>
            <h1>Аккаунт</h1>
            <p>{viewer.email}</p>
            <form action={logoutAccount}><button className="primary">Выйти</button></form>
          </>
        ) : (
          <>
            <h1>{register === '1' ? 'Регистрация' : 'Вход в аккаунт'}</h1>
            <AccountForm key={register ?? 'login'} register={register === '1'} next={next} />
            <Link className="text-link" href={register === '1' ? loginUrl : registerUrl}>
              {register === '1' ? 'У меня уже есть аккаунт' : 'Создать аккаунт'}
            </Link>
          </>
        )}
      </section>
    </main>
  );
}
