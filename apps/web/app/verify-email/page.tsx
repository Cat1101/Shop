import { MailCheck } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { VerificationForm } from '../../features/account/account-form';
import { DetailLayout } from '../../shared/detail-layout';

export const metadata: Metadata = { referrer: 'no-referrer' };

export default async function VerifyEmail({ searchParams }: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <DetailLayout>
      <section className="detail-card mx-auto grid max-w-lg justify-items-start gap-4 border-t-4 border-t-accent">
        <span className="grid size-11 place-items-center rounded-lg bg-tint text-accent">
          <MailCheck size={23} aria-hidden="true" />
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight">Подтверждение почты</h1>
        {typeof token === 'string' && token.length === 43
          ? <VerificationForm token={token} />
          : <p className="text-muted">Откройте ссылку из письма или повторите регистрацию.</p>}
        <Link className="text-link text-sm" href="/account">Ко входу</Link>
      </section>
    </DetailLayout>
  );
}
