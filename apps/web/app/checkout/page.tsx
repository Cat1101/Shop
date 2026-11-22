import { randomUUID } from 'node:crypto';
import { redirect } from 'next/navigation';
import { getViewer } from '../../features/account/session';
import { fetchProducts } from '../../features/catalog/data';
import { CheckoutForm } from '../../features/checkout/checkout-form';
import { DetailLayout } from '../../shared/detail-layout';

export default async function Checkout() {
  if (!(await getViewer())) {
    redirect('/account?next=checkout');
  }

  return (
    <DetailLayout wide>
      <CheckoutForm products={await fetchProducts()} requestId={randomUUID()} />
    </DetailLayout>
  );
}
