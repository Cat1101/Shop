'use client';

import type { LngLat, YMap, YMapLocationRequest, YMapMarker } from '@yandex/ymaps3-types';
import { LoaderCircle, MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { PickupPoint } from './points';
import { loadYandexMaps } from './yandex-sdk';

type SelectPoint = (pointId: string, trigger: HTMLButtonElement) => void;

function initialLocation(points: PickupPoint[]): YMapLocationRequest {
  const first = points[0].coordinates;
  if (points.every(({ coordinates }) => coordinates[0] === first[0] && coordinates[1] === first[1])) {
    return { center: first, zoom: 15 };
  }

  const longitudes = points.map(({ coordinates }) => coordinates[0]);
  const latitudes = points.map(({ coordinates }) => coordinates[1]);
  return {
    bounds: [
      [Math.min(...longitudes), Math.max(...latitudes)],
      [Math.max(...longitudes), Math.min(...latitudes)],
    ],
  };
}

const markerClass = 'pickup-marker grid size-11 cursor-pointer place-items-center rounded-full border-2 border-white bg-accent font-extrabold text-white shadow-lg hover:bg-accent-hover focus-visible:outline-accent-pressed active:bg-accent-pressed aria-pressed:bg-hero';

interface Marker {
  entity: YMapMarker;
  button: HTMLButtonElement;
}

interface Props {
  mapKey?: string;
  points: PickupPoint[];
  selectedId: string | null;
  onSelect: SelectPoint;
}

export function YandexMap({ mapKey, points, selectedId, onSelect }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<YMap | null>(null);
  const markers = useRef(new Map<string, Marker>());
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    if (!mapKey || !container.current || points.length === 0) {
      return;
    }

    const element = container.current;
    const pointMarkers = markers.current;
    let disposed = false;

    async function initialize(key: string) {
      try {
        const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } =
          await loadYandexMaps(key);
        if (disposed) {
          return;
        }

        const instance = new YMap(element, {
          location: initialLocation(points),
          margin: [44, 44, 44, 44],
        });
        map.current = instance;
        instance.addChild(new YMapDefaultSchemeLayer({}));
        instance.addChild(new YMapDefaultFeaturesLayer({}));

        points.forEach((point, index) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = markerClass;
          button.textContent = String(index + 1);
          button.setAttribute('aria-label', `Пункт ${point.name}`);
          button.setAttribute('aria-pressed', 'false');
          button.addEventListener('click', (event) => {
            event.stopPropagation();
            onSelect(point.id, button);
          });

          const entity = new YMapMarker({ coordinates: point.coordinates, blockBehaviors: true }, button);
          instance.addChild(entity);
          pointMarkers.set(point.id, { entity, button });
        });
        setStatus('ready');
      } catch {
        if (!disposed) {
          map.current?.destroy();
          map.current = null;
          pointMarkers.clear();
          setStatus('error');
        }
      }
    }

    void initialize(mapKey);

    return () => {
      disposed = true;
      map.current?.destroy();
      map.current = null;
      pointMarkers.clear();
    };
  }, [mapKey, points, onSelect]);

  useEffect(() => {
    if (status !== 'ready' || !map.current) {
      return;
    }

    for (const [id, { button, entity }] of markers.current) {
      const selected = id === selectedId;
      button.setAttribute('aria-pressed', String(selected));
      entity.update({ zIndex: selected ? 1 : 0 });
    }

    const point = points.find(({ id }) => id === selectedId);
    if (point) {
      const center: LngLat = point.coordinates;
      const animate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      map.current.setLocation({ center, duration: animate ? 340 : 0 });
    }
  }, [points, selectedId, status]);

  const unavailable = !mapKey || status === 'error';
  return (
    <section
      aria-label="Карта пунктов самовывоза"
      className="relative isolate min-h-72 overflow-hidden bg-tint sm:min-h-96 lg:min-h-[34rem]"
    >
      <div ref={container} className="absolute inset-0" aria-hidden={status !== 'ready'} />

      {(unavailable || status === 'loading') && (
        <div className="absolute inset-0 grid place-items-center p-5">
          <div role="status" className="max-w-sm rounded-xl border border-line bg-white px-5 py-4 text-center shadow-sm">
            {unavailable
              ? <MapPin size={25} className="mx-auto mb-2 text-accent" aria-hidden="true" />
              : <LoaderCircle size={25} className="mx-auto mb-2 text-accent motion-safe:animate-spin" aria-hidden="true" />}
            <p className="font-extrabold">
              {unavailable ? 'Карта временно недоступна' : 'Загружаем карту…'}
            </p>
            {unavailable && <p className="mt-1 text-sm text-muted">Адреса и часы работы доступны в списке.</p>}
          </div>
        </div>
      )}
    </section>
  );
}
