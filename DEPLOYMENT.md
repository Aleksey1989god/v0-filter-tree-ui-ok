# 🚀 Руководство по развертыванию

## Развертывание на Vercel

### Шаг 1: Подготовка проекта

Убедитесь, что ваш проект готов к развертыванию:

\`\`\`bash
# Проверьте, что проект собирается локально
pnpm build

# Убедитесь, что все изменения закоммичены
git status
\`\`\`

### Шаг 2: Исправление ошибки lockfile

Если при развертывании возникает ошибка `ERR_PNPM_OUTDATED_LOCKFILE`, выполните:

\`\`\`bash
# 1. Удалите существующий lockfile
rm pnpm-lock.yaml

# 2. Переустановите зависимости (это создаст новый lockfile)
pnpm install

# 3. Проверьте, что проект собирается
pnpm build

# 4. Закоммитьте обновленный lockfile
git add pnpm-lock.yaml package.json
git commit -m "fix: update pnpm lockfile for Vercel deployment"
git push origin main
\`\`\`

### Шаг 3: Развертывание на Vercel

#### Через веб-интерфейс Vercel:

1. Перейдите на [vercel.com](https://vercel.com)
2. Нажмите "Add New Project"
3. Импортируйте ваш GitHub репозиторий
4. Vercel автоматически определит настройки Next.js
5. Нажмите "Deploy"

#### Через Vercel CLI:

\`\`\`bash
# Установите Vercel CLI
npm i -g vercel

# Войдите в аккаунт
vercel login

# Разверните проект
vercel

# Для продакшн развертывания
vercel --prod
\`\`\`

## Развертывание на других платформах

### Netlify

\`\`\`bash
# Установите Netlify CLI
npm install -g netlify-cli

# Войдите
netlify login

# Разверните
netlify deploy --prod
\`\`\`

**netlify.toml:**
\`\`\`toml
[build]
  command = "pnpm build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
\`\`\`

### Docker

**Dockerfile:**
\`\`\`dockerfile
FROM node:18-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
\`\`\`

**Запуск Docker:**
\`\`\`bash
# Соберите образ
docker build -t filter-tree-ui .

# Запустите контейнер
docker run -p 3000:3000 filter-tree-ui
\`\`\`

## Устранение проблем

### Проблема: Ошибка при установке зависимостей

**Решение:**
\`\`\`bash
# Очистите кэш pnpm
pnpm store prune

# Удалите node_modules и lockfile
rm -rf node_modules pnpm-lock.yaml

# Переустановите
pnpm install
\`\`\`

### Проблема: Ошибка сборки на Vercel

**Решение:**
1. Проверьте логи сборки в Vercel Dashboard
2. Убедитесь, что используется Node.js 18+
3. Проверьте, что все зависимости в package.json

### Проблема: Приложение не работает после развертывания

**Решение:**
1. Откройте консоль браузера (F12)
2. Проверьте наличие ошибок JavaScript
3. Убедитесь, что все статические файлы загружаются
4. Проверьте, что localStorage доступен (для аутентификации)

## Оптимизация продакшн сборки

### Анализ размера бандла

\`\`\`bash
# Установите анализатор
pnpm add -D @next/bundle-analyzer

# Добавьте в next.config.mjs
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({})

# Запустите анализ
ANALYZE=true pnpm build
\`\`\`

### Кэширование

Vercel автоматически кэширует:
- Статические файлы (/_next/static/*)
- Изображения (оптимизированные через next/image)
- API routes (с правильными заголовками Cache-Control)

## Мониторинг

### Vercel Analytics

Проект уже включает `@vercel/analytics`. После развертывания на Vercel:

1. Перейдите в Dashboard → Analytics
2. Просматривайте метрики производительности
3. Отслеживайте Web Vitals

### Логирование ошибок

Для продакшн мониторинга рекомендуется добавить:

- [Sentry](https://sentry.io) - отслеживание ошибок
- [LogRocket](https://logrocket.com) - session replay
- [Datadog](https://www.datadoghq.com) - APM мониторинг

## Обновление развертывания

\`\`\`bash
# 1. Внесите изменения в код
git add .
git commit -m "feat: add new feature"

# 2. Отправьте в GitHub
git push origin main

# 3. Vercel автоматически пересоберет и развернет
\`\`\`

## Откат к предыдущей версии

В Vercel Dashboard:
1. Перейдите в Deployments
2. Найдите стабильную версию
3. Нажмите "..." → "Promote to Production"

## Переменные окружения

Если в будущем потребуются переменные окружения:

1. В Vercel Dashboard перейдите в Settings → Environment Variables
2. Добавьте необходимые переменные
3. Пересоберите проект

Текущая версия приложения не требует дополнительных переменных окружения.

## GitHub Actions CI/CD

Проект включает готовые GitHub Actions workflows для автоматизации:

### Доступные workflows

1. **CI Pipeline** (`.github/workflows/ci.yml`)
   - Запускается при push в main/develop и при PR
   - Проверяет код линтером
   - Выполняет type checking
   - Собирает проект

2. **Deploy to Vercel** (`.github/workflows/deploy-vercel.yml`)
   - Запускается при push в main
   - Автоматически деплоит на Vercel production
   - Можно запустить вручную через workflow_dispatch

3. **Preview Deployments** (`.github/workflows/preview.yml`)
   - Создает preview окружение для каждого PR
   - Добавляет комментарий с URL preview в PR

### Настройка GitHub Actions

#### Шаг 1: Получение Vercel токенов

\`\`\`bash
# Установите Vercel CLI
npm i -g vercel

# Войдите в аккаунт
vercel login

# Свяжите проект с Vercel
vercel link
\`\`\`

#### Шаг 2: Получение ID проекта

После выполнения `vercel link` будет создана папка `.vercel/`:

\`\`\`bash
# Просмотрите содержимое
cat .vercel/project.json
\`\`\`

Вы увидите:
\`\`\`json
{
  "orgId": "team_xxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxx"
}
\`\`\`

#### Шаг 3: Создание Vercel токена

1. Перейдите на https://vercel.com/account/tokens
2. Нажмите "Create Token"
3. Дайте имя токену (например, "GitHub Actions")
4. Выберите scope (рекомендуется Full Account)
5. Скопируйте созданный токен

#### Шаг 4: Добавление секретов в GitHub

1. Откройте ваш репозиторий на GitHub
2. Перейдите в **Settings** → **Secrets and variables** → **Actions**
3. Нажмите **New repository secret**
4. Добавьте следующие секреты:

| Имя секрета | Значение |
|-------------|----------|
| `VERCEL_TOKEN` | Токен из шага 3 |
| `VERCEL_ORG_ID` | `orgId` из .vercel/project.json |
| `VERCEL_PROJECT_ID` | `projectId` из .vercel/project.json |

#### Шаг 5: Проверка работы

1. Сделайте commit и push в main:
   \`\`\`bash
   git add .
   git commit -m "test: trigger deployment"
   git push origin main
   \`\`\`

2. Перейдите в **Actions** tab на GitHub
3. Вы увидите запущенные workflows
4. После успешного выполнения проект будет задеплоен на Vercel

### Локальное тестирование workflows

Для тестирования GitHub Actions локально используйте [act](https://github.com/nektos/act):

\`\`\`bash
# Установите act
brew install act  # macOS
# или
choco install act-cli  # Windows

# Запустите workflow локально
act push

# Запустите конкретный workflow
act -W .github/workflows/ci.yml
\`\`\`

### Отключение автоматического деплоя

Если вы хотите деплоить вручную, удалите или отключите workflows:

\`\`\`bash
# Переместите workflows в другую папку
mkdir .github/workflows-disabled
mv .github/workflows/*.yml .github/workflows-disabled/
