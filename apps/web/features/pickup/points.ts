import type { LngLat } from '@yandex/ymaps3-types';

export interface PickupPoint {
  id: string;
  name: string;
  address: string;
  coordinates: LngLat;
  hours: string;
  instructions?: string;
  phone?: string;
  demo?: boolean;
}

export const pickupPoints: PickupPoint[] = [
  {
    id: 'demo-arbat',
    name: 'Арбат',
    address: 'Москва, район Арбат',
    coordinates: [37.598, 55.750],
    hours: 'Пн–Сб, 10:00–20:00',
    demo: true,
  },
  {
    id: 'demo-sokolniki',
    name: 'Сокольники',
    address: 'Москва, район Сокольники',
    coordinates: [37.680, 55.789],
    hours: 'Ежедневно, 10:00–21:00',
    demo: true,
  },
  {
    id: 'demo-taganka',
    name: 'Таганка',
    address: 'Москва, Таганский район',
    coordinates: [37.656, 55.740],
    hours: 'Пн–Пт, 09:00–19:00',
    demo: true,
  },
];
