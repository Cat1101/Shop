import { PrismaClient } from '../generated/prisma/client';
import { createDatabaseAdapter } from './database.service';

const categories = [
  { slug: 'controllers', name: 'Микроконтроллеры' },
  { slug: 'sensors', name: 'Датчики' },
  { slug: 'modules', name: 'Модули' },
];

const products = [
  {
    category: 'controllers',
    slug: 'esp32-devkit',
    name: 'ESP32 DevKit',
    description: 'Плата разработки с Wi-Fi и Bluetooth для прототипов и IoT.',
    priceKopecks: 89_000,
    stock: 18,
  },
  {
    category: 'controllers',
    slug: 'raspberry-pi-pico',
    name: 'Raspberry Pi Pico',
    description: 'Плата на RP2040 с программируемыми блоками ввода-вывода.',
    priceKopecks: 69_000,
    stock: 12,
  },
  {
    category: 'sensors',
    slug: 'bme280',
    name: 'Bosch BME280',
    description: 'Датчик температуры, влажности и атмосферного давления.',
    priceKopecks: 54_000,
    stock: 9,
  },
  {
    category: 'sensors',
    slug: 'hc-sr04',
    name: 'HC-SR04',
    description: 'Ультразвуковой модуль для измерения расстояния.',
    priceKopecks: 19_000,
    stock: 24,
  },
  {
    category: 'modules',
    slug: 'ssd1306',
    name: 'OLED SSD1306',
    description: 'Монохромный дисплей 128 × 64 с интерфейсом I²C.',
    priceKopecks: 43_000,
    stock: 7,
  },
  {
    category: 'modules',
    slug: 'lm2596',
    name: 'DC-DC LM2596',
    description: 'Регулируемый понижающий преобразователь напряжения.',
    priceKopecks: 31_000,
    stock: 0,
  },
];

async function seed() {
  const database = new PrismaClient({ adapter: createDatabaseAdapter() });
  try {
    await database.$transaction(async (transaction) => {
      const marker = await transaction.seedRun.createMany({
        data: [{ name: 'demo-catalog-v1' }],
        skipDuplicates: true,
      });
      if (marker.count === 0) {
        return;
      }

      await transaction.category.createMany({ data: categories, skipDuplicates: true });
      const rows = await transaction.category.findMany();
      const categoryIds = new Map(rows.map(({ slug, id }) => [slug, id]));
      await transaction.product.createMany({
        data: products.map(({ category, ...product }) => {
          const categoryId = categoryIds.get(category);
          if (categoryId === undefined) {
            throw new Error(`Unknown demo category: ${category}`);
          }
          return { categoryId, ...product };
        }),
        skipDuplicates: true,
      });
    });
  } finally {
    await database.$disconnect();
  }
}

seed().catch((error: unknown) => {
  console.error('Demo seeding failed', error);
  process.exitCode = 1;
});
