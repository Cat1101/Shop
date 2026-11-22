const artPositions: Record<string, string> = {
  'esp32-devkit': 'bg-left-top',
  'raspberry-pi-pico': 'bg-top',
  bme280: 'bg-right-top',
  'hc-sr04': 'bg-left-bottom',
  ssd1306: 'bg-bottom',
  lm2596: 'bg-right-bottom',
};

export function ProductArt({ slug }: { slug: string }) {
  const position = artPositions[slug];
  if (!position) {
    return null;
  }

  return (
    <div aria-hidden="true" className="relative aspect-[4/3] overflow-hidden border-b border-line bg-tint">
      <div
        className={`absolute inset-x-0 top-1/2 aspect-square -translate-y-1/2 bg-[url('/images/catalog.webp')] bg-size-[300%_200%] bg-no-repeat ${position}`}
      />
    </div>
  );
}
