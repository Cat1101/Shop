'use client';

import { Clock3, Footprints, MapPin, Phone, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PickupPoint } from './points';
import { YandexMap } from './yandex-map';

export function PickupLocations({ points, mapKey }: {
  points: PickupPoint[];
  mapKey?: string;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const detailHeading = useRef<HTMLHeadingElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const selected = points.find(({ id }) => id === selectedId);

  const selectPoint = useCallback((id: string, trigger: HTMLButtonElement) => {
    lastTrigger.current = trigger;
    setSelectedId(id);
  }, []);

  const closePoint = useCallback(() => {
    setSelectedId(null);
    window.requestAnimationFrame(() => lastTrigger.current?.focus({ preventScroll: true }));
  }, []);

  useEffect(() => {
    if (!selectedId) {
      return;
    }

    detailHeading.current?.focus({ preventScroll: true });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePoint();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closePoint, selectedId]);

  if (points.length === 0) {
    return <p className="detail-card text-muted">Адреса пунктов самовывоза появятся здесь.</p>;
  }

  return (
    <div className="grid overflow-hidden rounded-2xl border border-line bg-white lg:grid-cols-[21rem_minmax(0,1fr)]">
      <aside className="relative order-2 min-w-0 border-t border-line lg:order-1 lg:overflow-hidden lg:border-t-0 lg:border-r">
        <div className="p-4 sm:p-5 lg:max-h-[34rem] lg:overflow-y-auto" inert={Boolean(selected)}>
          <h2 className="text-xl font-extrabold">Адреса пунктов</h2>
          {points.some((point) => point.demo) && (
            <p className="mt-1 text-sm font-bold text-muted">Демонстрационные точки</p>
          )}
          <ul className="mt-4 grid gap-2">
            {points.map((point, index) => (
              <li key={point.id}>
                <button
                  type="button"
                  onClick={(event) => selectPoint(point.id, event.currentTarget)}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-line p-3 text-left transition-colors hover:border-cobalt hover:bg-tint active:bg-indigo-200 aria-pressed:border-cobalt aria-pressed:bg-tint"
                  aria-pressed={selectedId === point.id}
                >
                  <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-tint text-sm font-extrabold text-cobalt">
                    {index + 1}
                  </span>
                  <span className="grid min-w-0 gap-1">
                    <span className="font-extrabold">{point.name}</span>
                    <span className="text-sm text-muted">{point.address}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {selected && (
          <section
            key={selected.id}
            aria-labelledby="pickup-detail-title"
            className="pickup-detail fixed inset-x-0 bottom-0 z-30 max-h-[70dvh] overflow-y-auto overscroll-contain rounded-t-2xl border-t border-line bg-white p-5 shadow-2xl sm:p-6 lg:absolute lg:inset-0 lg:max-h-none lg:rounded-none lg:border-t-0 lg:shadow-none"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                {selected.demo && <p className="mb-1 text-sm font-bold text-muted">Демонстрационная точка</p>}
                <h2
                  id="pickup-detail-title"
                  ref={detailHeading}
                  tabIndex={-1}
                  className="text-2xl font-extrabold tracking-tight"
                >
                  {selected.name}
                </h2>
              </div>
              <button
                type="button"
                className="control control-secondary w-11 shrink-0 px-0"
                aria-label="Закрыть информацию о пункте"
                onClick={closePoint}
              >
                <X size={19} aria-hidden="true" />
              </button>
            </div>

            <dl className="mt-5 grid gap-4 border-t border-line pt-5">
              <div className="flex gap-3">
                <MapPin size={19} className="mt-0.5 shrink-0 text-cobalt" aria-hidden="true" />
                <div>
                  <dt className="text-sm font-extrabold">Адрес</dt>
                  <dd className="mt-0.5 text-muted">{selected.address}</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock3 size={19} className="mt-0.5 shrink-0 text-cobalt" aria-hidden="true" />
                <div>
                  <dt className="text-sm font-extrabold">Часы работы</dt>
                  <dd className="mt-0.5 whitespace-pre-line text-muted">{selected.hours}</dd>
                </div>
              </div>
              {selected.instructions && (
                <div className="flex gap-3">
                  <Footprints size={19} className="mt-0.5 shrink-0 text-cobalt" aria-hidden="true" />
                  <div>
                    <dt className="text-sm font-extrabold">Как пройти</dt>
                    <dd className="mt-0.5 whitespace-pre-line text-muted">{selected.instructions}</dd>
                  </div>
                </div>
              )}
              {selected.phone && (
                <div className="flex gap-3">
                  <Phone size={19} className="mt-0.5 shrink-0 text-cobalt" aria-hidden="true" />
                  <div>
                    <dt className="text-sm font-extrabold">Телефон</dt>
                    <dd>
                      <a className="text-link" href={`tel:${selected.phone.replace(/[^\d+]/g, '')}`}>
                        {selected.phone}
                      </a>
                    </dd>
                  </div>
                </div>
              )}
            </dl>
          </section>
        )}
      </aside>
      <div className="order-1 min-w-0 lg:order-2">
        <YandexMap mapKey={mapKey} points={points} selectedId={selectedId} onSelect={selectPoint} />
      </div>
    </div>
  );
}
