const positions: Record<string, string> = {
  'esp32-devkit': '0% 0%',
  'raspberry-pi-pico': '50% 0%',
  bme280: '100% 0%',
  'hc-sr04': '0% 100%',
  ssd1306: '50% 100%',
  lm2596: '100% 100%',
};

export function ProductArt({ slug }: { slug: string }) {
  const position = positions[slug];
  return position ? <span className="product-art" aria-hidden="true" style={{ backgroundPosition: position }} /> : null;
}
