const rubles = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  minimumFractionDigits: 0,
});

export function formatPrice(kopecks: number) {
  return rubles.format(kopecks / 100);
}
