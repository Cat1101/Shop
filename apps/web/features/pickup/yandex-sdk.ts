type MapsApi = typeof import('@yandex/ymaps3-types');

declare global {
  interface Window {
    ymaps3?: MapsApi;
  }
}

let loading: Promise<MapsApi> | undefined;

export function loadYandexMaps(key: string) {
  if (loading) {
    return loading;
  }

  const script = document.createElement('script');
  const source = new URL('https://api-maps.yandex.ru/v3/');
  source.searchParams.set('apikey', key);
  source.searchParams.set('lang', 'ru_RU');
  script.src = source.href;
  script.async = true;
  script.referrerPolicy = 'origin';

  loading = new Promise<MapsApi>((resolve, reject) => {
    const timeout = window.setTimeout(fail, 15_000);

    function fail() {
      window.clearTimeout(timeout);
      script.remove();
      reject(new Error('Yandex Maps could not initialize'));
    }

    async function initialize() {
      const api = window.ymaps3;
      if (!api) {
        fail();
        return;
      }

      try {
        await api.ready;
        window.clearTimeout(timeout);
        resolve(api);
      } catch {
        fail();
      }
    }

    if (window.ymaps3) {
      void initialize();
    } else {
      script.addEventListener('load', initialize, { once: true });
      script.addEventListener('error', fail, { once: true });
      document.head.append(script);
    }
  }).catch((error: unknown) => {
    loading = undefined;
    throw error;
  });

  return loading;
}
