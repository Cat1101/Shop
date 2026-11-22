import { Check, Plus } from 'lucide-react';
import { formatPrice } from '../../shared/money';
import type { Product } from './model';
import { ProductArt } from './product-art';

export function ProductCard({ product, category, quantity, onAdd, onOpenCart }: {
  product: Product;
  category?: string;
  quantity: number;
  onAdd: () => void;
  onOpenCart: () => void;
}) {
  const inCart = quantity > 0;
  const available = product.stock > 0;

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-line bg-white transition-shadow hover:shadow-md hover:shadow-slate-900/5 motion-reduce:transition-none">
      <ProductArt slug={product.slug} />
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {category && <p className="text-xs font-extrabold tracking-wide text-muted">{category}</p>}
        <h3 className="mt-1 text-xl leading-tight font-extrabold tracking-tight">{product.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{product.description}</p>
        <div className="mt-auto pt-5">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <strong className="text-2xl font-extrabold tracking-tight tabular-nums">
              {formatPrice(product.priceKopecks)}
            </strong>
            {available && (
              <span className="text-xs font-bold text-muted">В наличии · {product.stock} шт.</span>
            )}
          </div>
          <button
            type="button"
            className={`control w-full ${inCart ? 'control-selected' : 'control-primary'}`}
            disabled={!available}
            aria-label={available
              ? inCart
                ? `Открыть корзину, ${product.name}: ${quantity} шт.`
                : `Добавить ${product.name} в корзину`
              : `${product.name}: нет в наличии`}
            onClick={inCart ? onOpenCart : onAdd}
          >
            {available && (inCart
              ? <Check size={17} strokeWidth={2.4} aria-hidden="true" />
              : <Plus size={17} strokeWidth={2.4} aria-hidden="true" />)}
            {available ? inCart ? `В корзине · ${quantity}` : 'В корзину' : 'Нет в наличии'}
          </button>
        </div>
      </div>
    </article>
  );
}
