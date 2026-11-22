import Link from 'next/link';

export function CatalogHero() {
  return (
    <section className="relative isolate grid overflow-hidden rounded-2xl bg-hero text-white sm:min-h-[21rem] sm:grid-cols-[52%_48%] lg:min-h-[25rem]">
      <div className="z-10 flex flex-col items-start justify-center px-6 pt-8 pb-6 sm:px-7 sm:py-8 md:px-10 lg:px-12">
        <h1 className="text-[clamp(1.95rem,4.55vw,3.75rem)] leading-[1.05] font-extrabold tracking-[-0.065em]">
          <span className="block">Компоненты</span>
          <span className="block">для электроники</span>
        </h1>
        <p className="mt-4 max-w-xs text-base leading-relaxed text-indigo-100 sm:text-lg">
          Микроконтроллеры, датчики и модули для ваших проектов.
        </p>
        <Link className="control control-light mt-6 focus-visible:outline-white" href="#catalog">
          Открыть каталог
        </Link>
      </div>
      <div
        aria-hidden="true"
        className="relative h-44 bg-[url('/images/workbench.webp')] bg-cover bg-[position:center_57%] sm:h-full sm:bg-center"
      >
        <div className="absolute inset-0 bg-linear-to-b from-hero via-transparent to-transparent sm:bg-linear-to-r" />
      </div>
    </section>
  );
}
