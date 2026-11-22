# MicroShop

Стартовый магазин микроконтроллеров, датчиков и модулей. Витрина на Next.js показывает каталог из NestJS API. Категории, товары, цены и остатки хранятся в PostgreSQL. Корзина сохраняется в браузере.

## Локальный запуск

Запустите Docker Desktop с Linux-контейнерами. В корне Git worktree выполните:

```sh
docker compose up --build -d --wait
```

- Витрина: <http://localhost:3000>.
- Проверка API и базы: <http://localhost:3001/api/health>.
- Каталог в JSON: <http://localhost:3001/api/products>.
- Список категорий: <http://localhost:3001/api/categories>.

Порты можно переопределить через `WEB_PORT` и `API_PORT` в локальном `.env`. Docker Compose использует локальные учётные данные по умолчанию. База доступна сервисам внутри сети Compose.

```sh
docker compose logs -f web api db
docker compose down
```

PostgreSQL хранит данные в именованном томе. Скрипты схемы и демоданных выполняются при первом запуске с пустым томом.

## Структура

| Путь | Назначение |
| --- | --- |
| `apps/web` | Витрина и корзина |
| `apps/api` | API каталога и подключение к PostgreSQL |
| `infra/postgres/init` | Начальная схема и демоданные |
| `compose.yaml` | Локальное окружение |
| `AGENTS.md` | Правила работы с проектом |
