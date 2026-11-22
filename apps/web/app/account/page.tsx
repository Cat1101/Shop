import { UserRound } from 'lucide-react';
import Link from 'next/link';
import { AccountForm } from '../../features/account/account-form';
import { logoutAccount } from '../../features/account/actions';
import { getViewer, readSession } from '../../features/account/session';
import { OrderHistory } from '../../features/checkout/order-history';
import { getOrders } from '../../features/checkout/orders';
import { DetailLayout } from '../../shared/detail-layout';
import { SubmitButton } from '../../shared/submit-button';

interface Props {
  searchParams: Promise<{ register?: string; next?: string }>;
}

export default async function Account({ searchParams }: Props) {
  const { register, next } = await searchParams;
  const token = await readSession();
  const viewer = token ? await getViewer() : null;
  const orders = token && viewer ? await getOrders(token) : [];
  const nextQuery = next === 'checkout' ? 'next=checkout' : '';
  const loginUrl = nextQuery ? `/account?${nextQuery}` : '/account';
  const registerUrl = nextQuery ? `/account?register=1&${nextQuery}` : '/account?register=1';

  return (
    <DetailLayout>
      {viewer ? (
        <>
          <section className="detail-card flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Аккаунт</h1>
              <p className="mt-1 break-all text-muted">{viewer.email}</p>
            </div>
            <form action={logoutAccount}>
              <SubmitButton pendingText="Выходим…" secondary>Выйти</SubmitButton>
            </form>
          </section>
          <OrderHistory orders={orders} />
        </>
      ) : (
        <section className="detail-card mx-auto max-w-md border-t-4 border-t-cobalt">
          <span className="mb-4 grid size-11 place-items-center rounded-lg bg-tint text-cobalt">
            <UserRound size={23} aria-hidden="true" />
          </span>
          <h1 className="mb-6 text-3xl font-extrabold tracking-tight">
            {register === '1' ? 'Регистрация' : 'Вход в аккаунт'}
          </h1>
          <AccountForm key={register ?? 'login'} register={register === '1'} next={next} />
          <div className="mt-5 border-t border-line pt-3 text-center">
            <Link className="text-link text-sm" href={register === '1' ? loginUrl : registerUrl}>
              {register === '1' ? 'У меня уже есть аккаунт' : 'Создать аккаунт'}
            </Link>
          </div>
        </section>
      )}
    </DetailLayout>
  );
}
