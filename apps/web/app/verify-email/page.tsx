import type { Metadata } from 'next';
import Link from 'next/link';
import { VerificationForm } from '../../features/account/account-form';

export const metadata: Metadata = { referrer: 'no-referrer' };

export default async function VerifyEmail({ searchParams }: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main className="shell detail-page">
      <section className="detail-card">
        <h1>Подтверждение почты</h1>
        {typeof token === 'string' && token.length === 43
          ? <VerificationForm token={token} />
          : <p>Откройте ссылку из письма или повторите регистрацию.</p>}
        <Link className="text-link" href="/account">Ко входу</Link>
      </section>
    </main>
  );
}
