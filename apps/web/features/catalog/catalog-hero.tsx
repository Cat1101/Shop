import { Search, X } from 'lucide-react';
import { useRef, type PointerEvent } from 'react';
import type { Category } from './model';

interface CatalogHeroProps {
  categories: Category[];
  activeCategory: string;
  search: string;
  onSearch: (value: string) => void;
  onCategory: (slug: string) => void;
}

function showResults() {
  document.getElementById('catalog-title')?.focus();
}

function trackBoard(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  const plate = event.currentTarget;
  const bounds = plate.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  plate.style.setProperty('--board-x', `${x * 12}px`);
  plate.style.setProperty('--board-y', `${y * 10}px`);
  plate.style.setProperty('--board-angle', `${x * 2}deg`);
}

export function CatalogHero({ categories, activeCategory, search, onSearch, onCategory }: CatalogHeroProps) {
  const searchField = useRef<HTMLInputElement>(null);

  return (
    <section className="hero-spread" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title"><span><b>Компоненты</b></span><span><b>для электроники</b></span></h1>
        <form
          className="hero-search"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            showResults();
          }}
        >
          <input
            type="search"
            ref={searchField}
            placeholder="Найти плату, датчик или модуль"
            aria-label="Найти плату, датчик или модуль"
            aria-controls="catalog"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
          />
          {search && (
            <button type="button" aria-label="Очистить поиск" onClick={() => {
              onSearch('');
              searchField.current?.focus();
            }}>
              <X size={18} />
            </button>
          )}
          <button className="search-submit" type="submit" aria-label="Показать результаты поиска">
            <Search size={21} />
          </button>
        </form>
        <nav className="category-links" aria-label="Категории товаров">
          {categories.map(({ slug, name }) => (
            <a key={slug} href="#catalog" aria-current={activeCategory === slug ? 'true' : undefined}
              onClick={() => onCategory(slug)}>{name}</a>
          ))}
        </nav>
      </div>
      <figure className="hero-plate" onPointerMove={trackBoard} onPointerLeave={(event) => {
        const { style } = event.currentTarget;
        style.removeProperty('--board-x');
        style.removeProperty('--board-y');
        style.removeProperty('--board-angle');
      }}>
        <div className="plate-grid" aria-hidden="true" />
        <img className="hero-board" src="/images/esp32-studio.webp" alt="Плата ESP32 DevKit с металлическим экраном радиомодуля и двумя рядами выводов" width="1200" height="800" fetchPriority="high" />
        <figcaption className="plate-caption">
          <strong>ESP32 DevKit</strong>
          <span>Wi-Fi · Bluetooth</span>
        </figcaption>
      </figure>
    </section>
  );
}
