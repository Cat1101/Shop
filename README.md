# MicroShop

Магазин микроконтроллеров, датчиков и модулей на Next.js, NestJS и PostgreSQL с Prisma.

## Первая версия

- Каталог с поиском, категориями и остатками. Корзина сохраняется в браузере.
- Регистрация по электронной почте и паролю. Адрес подтверждается по ссылке из письма.
- Заказ на самовывоз. Покупатель указывает имя и телефон, оплачивает заказ при получении и видит его в аккаунте.

## Локальный запуск

Запустите Docker Desktop с Linux-контейнерами и выполните в корне Git worktree:

```sh
docker compose up --build -d --wait
```

- Витрина: <http://localhost:3000>.
- Проверка API и базы: <http://localhost:3001/api/health>.
- Каталог в JSON: <http://localhost:3001/api/products>.
- Входящие письма Mailpit: <http://localhost:8025>.

Порты можно переопределить через `WEB_PORT`, `API_PORT` и `MAIL_PORT` в локальном `.env`. PostgreSQL и SMTP доступны внутри сети Compose. Отдельный сервис применяет миграции Prisma и добавляет демокаталог в новую базу. Чтобы запустить с пустым каталогом, задайте `SEED_DEMO=false` до первого запуска.

```sh
docker compose ps
docker compose logs -f web api migrate db mail
docker compose down
```

PostgreSQL хранит данные в именованном томе. Обычная остановка Compose сохраняет его.

## Структура

| Путь | Назначение |
| --- | --- |
| `apps/web` | Витрина, корзина, аккаунт и оформление заказа |
| `apps/api/src` | NestJS API и бизнес-операции |
| `apps/api/prisma` | Схема PostgreSQL и миграции Prisma |
| `compose.yaml` | Локальное окружение |
| `AGENTS.md` | Правила работы с проектом |
