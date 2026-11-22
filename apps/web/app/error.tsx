'use client';

import { DetailLayout } from '../shared/detail-layout';

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <DetailLayout>
      <section className="detail-card">
        <h1 className="text-3xl font-extrabold tracking-tight">Страница временно недоступна</h1>
        <button type="button" className="control control-primary mt-5" onClick={reset}>Повторить</button>
      </section>
    </DetailLayout>
  );
}
