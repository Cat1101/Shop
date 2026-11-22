import { randomUUID } from 'node:crypto';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getViewer } from '../../features/account/session';
import { fetchProducts } from '../../features/catalog/data';
import { CheckoutForm } from '../../features/checkout/checkout-form';

export default async function Checkout() {
  if (!(await getViewer())) {
    redirect('/account?next=checkout');
  }

  return (
    <main className="shell detail-page">
      <Link className="text-link" href="/">К каталогу</Link>
      <section className="detail-card">
        <CheckoutForm products={await fetchProducts()} requestId={randomUUID()} />
      </section>
    </main>
  );
}
