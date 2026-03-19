# stream.rodion.pro

Персональный стриминг-хаб для Kick-стримера **WizardJIOCb**. Интерактивная платформа, где зрители влияют на стрим через Channel Points, награды и предсказания.

**Production:** https://stream.rodion.pro

## Стек

| Слой | Технологии |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query, React Router v7 |
| Backend | Express, TypeScript, Zod |
| Database | PostgreSQL, Drizzle ORM |
| Deploy | PM2, Nginx, Let's Encrypt |

## Структура проекта

```
src/
  frontend/           # React SPA
    components/       # UI-компоненты (home/, layout/, ui/)
    hooks/            # TanStack Query хуки
    lib/              # Утилиты, API клиент, аналитика
    pages/            # Страницы и admin-табы
    styles/           # Tailwind + кастомные стили
    public/           # Статические ассеты (images/)
  server/             # Express API
    db/               # Drizzle схема, подключение, сид
    middleware/        # Auth, rate-limit, error-handler
    routes/           # public, admin, analytics, webhooks
    integrations/     # Kick API стабы (Phase 3)
  shared/             # Общие типы и константы
nginx/                # Конфиг Nginx
```

## Локальная разработка

### Требования

- Node.js 20+
- PostgreSQL 15+
- Docker (опционально, для БД)

### Установка

```bash
git clone https://github.com/WizardJIOCb/stream.rodion.pro.git
cd stream.rodion.pro
npm install
```

### Настройка окружения

```bash
cp .env.example .env
```

Заполнить `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/stream_rodion
ADMIN_PASSWORD_HASH=<bcrypt hash>
JWT_SECRET=<random 32+ char string>
```

Сгенерировать хеш пароля админа:

```bash
node -e "require('bcrypt').hash('yourpassword', 10).then(h => console.log(h))"
```

### База данных

```bash
npm run db:push    # Применить схему
npm run db:seed    # Загрузить начальные данные
```

### Запуск

```bash
npm run dev
```

Или на Windows — `start-dev.bat` (проверит Docker, БД, зависимости и запустит).

- Frontend: http://localhost:5173
- API: http://localhost:3012
- Админка: http://localhost:5173/admin

## NPM-скрипты

| Скрипт | Описание |
|---|---|
| `npm run dev` | Vite + Express (development) |
| `npm run build` | Сборка frontend + backend |
| `npm start` | Запуск production-сборки |
| `npm run db:push` | Применить Drizzle-схему к БД |
| `npm run db:seed` | Сидирование начальных данных |
| `npm run db:generate` | Генерация Drizzle-миграций |

## Production deploy

### Сервер

```bash
# Клонировать и собрать
cd /var/www/stream.rodion.pro
git pull origin main
npm install
npm run build
cp -r src/frontend/public/images dist/frontend/

# БД (первый раз)
npm run db:push
npm run db:seed

# PM2
pm2 start ecosystem.config.cjs
pm2 save
```

### Обновление

```bash
cd /var/www/stream.rodion.pro
git pull origin main
npm install
npm run build
cp -r src/frontend/public/images dist/frontend/
pm2 restart stream-rodion
```

### Nginx

Конфиг: `/etc/nginx/sites-available/stream.rodion.pro`
SSL: Let's Encrypt (certbot, автообновление)

### Health check

```
GET /api/health → {"status":"ok","timestamp":"..."}
```

## API endpoints

### Public

| Метод | Путь | Описание |
|---|---|---|
| GET | `/api/public/state` | Состояние сайта (статус, игра, формат, хук) |
| GET | `/api/public/rewards` | Список активных наград |
| GET | `/api/public/clips` | Featured клипы |
| GET | `/api/public/feed` | Лента событий |
| GET | `/api/public/formats` | Форматы стримов |
| GET | `/api/public/games/:slug` | Данные по игре |

### Admin (JWT auth, httpOnly cookie)

| Метод | Путь | Описание |
|---|---|---|
| POST | `/api/admin/login` | Авторизация |
| POST | `/api/admin/logout` | Выход |
| GET | `/api/admin/check` | Проверка сессии |
| POST | `/api/admin/state` | Обновить состояние сайта |
| GET/POST/PATCH/DELETE | `/api/admin/clips[/:id]` | CRUD клипов |
| GET/POST/PATCH/DELETE | `/api/admin/rewards[/:id]` | CRUD наград |
| GET/POST/PATCH/DELETE | `/api/admin/feed-events[/:id]` | CRUD событий ленты |
| GET/PUT | `/api/admin/predictions[/:gameSlug]` | Управление предсказаниями |

### Analytics

| Метод | Путь | Описание |
|---|---|---|
| POST | `/api/analytics/event` | Трекинг событий (fire-and-forget) |

## БД: 9 таблиц

`site_settings`, `games`, `formats`, `featured_clips`, `reward_cache`, `stream_sessions`, `admin_sessions`, `site_feed_events`, `analytics_events`

## Roadmap

- [ ] Phase 3: Kick API интеграция (OAuth, webhook, автосинхронизация наград/статуса)
- [ ] Realtime обновления (WebSocket / SSE)
- [ ] Расширенная аналитика с дашбордом
- [ ] Множественные игры и переключение через админку
