import { Check, Plus } from 'lucide-react';
import { formatPrice } from '../../shared/money';
import type { Product } from './model';
import { ProductArt } from './product-art';

interface ProductCardProps {
  product: Product;
  category?: string;
  quantity: number;
  onAdd: () => void;
  onOpenCart: () => void;
}

export function ProductCard({ product, category, quantity, onAdd, onOpenCart }: ProductCardProps) {
  const inCart = quantity > 0;
  const available = product.stock > 0;

  return (
    <article className="product-card">
      <div className="product-stage">
        <ProductArt slug={product.slug} />
        {category && <span className="product-category">{category}</span>}
      </div>
      <div className="flex flex-1 flex-col px-5 pt-5 pb-4">
        <h3 className="font-mono text-[1.35rem] leading-tight font-medium tracking-tight">{product.name}</h3>
        <p className="mt-2 mb-5 text-base leading-snug text-muted">{product.description}</p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 border-t border-line pt-3">
          <div className="grid gap-0.5">
            <strong className="text-2xl font-medium tracking-tight tabular-nums">{formatPrice(product.priceKopecks)}</strong>
            <span className="text-sm text-muted">{available ? `В наличии · ${product.stock} шт.` : 'Нет в наличии'}</span>
          </div>
          <button type="button" disabled={!available}
            className={`control ${inCart ? 'control-selected' : 'control-primary'}`}
            aria-label={inCart ? `Открыть корзину, ${product.name}: ${quantity} шт.` : `Добавить ${product.name} в корзину`}
            onClick={inCart ? onOpenCart : onAdd}>
            <span key={inCart ? 'added' : 'add'} className="buy-label">
              {inCart ? <Check size={16} /> : <Plus size={16} />}
              {inCart ? `В корзине · ${quantity}` : 'В корзину'}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
