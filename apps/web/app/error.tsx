'use client';

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="shell error-page">
      <h1>Каталог временно недоступен</h1>
      <button className="primary" onClick={reset}>Повторить</button>
    </main>
  );
}
