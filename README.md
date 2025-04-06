# Task Manager

Task Manager - это современное веб-приложение для управления задачами, построенное с использованием Next.js 15, TypeScript и Tailwind CSS. Приложение поддерживает drag-and-drop функциональность и позволяет эффективно организовывать задачи по статусам.

🔗 **Демо:** [https://task-manager-eta-ashy.vercel.app/](https://task-manager-eta-ashy.vercel.app/)

## 🚀 Основные возможности

- 📋 Создание, редактирование и удаление задач
- 🔄 Drag-and-drop для перемещения задач между статусами
- 📅 Установка дедлайнов для задач
- 🎨 Современный и отзывчивый интерфейс
- 🔒 Подтверждение удаления задач
- 📝 Детальное редактирование задач

## 🛠 Технологии

- [Next.js 15](https://nextjs.org/) - React фреймворк
- [TypeScript](https://www.typescriptlang.org/) - Типизированный JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Утилитарный CSS фреймворк
- [@dnd-kit](https://dnd-kit.com/) - Библиотека для drag-and-drop функциональности
- [dayjs](https://day.js.org/) - Легковесная библиотека для работы с датами
- [Redux Toolkit + RTK Query](https://redux-toolkit.js.org/rtk-query/overview) - Управление состоянием и запросами к API
- [PostgreSQL](https://www.postgresql.org/) - База данных
- [Prisma](https://www.prisma.io/) - ORM для работы с базой данных

## 📦 Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/your-username/task-manager.git
```

2. Перейдите в директорию проекта:
```bash
cd task-manager
```

3. Установите зависимости:
```bash
npm install
```

4. Настройте переменные окружения:
```bash
# Скопируйте пример файла конфигурации
cp .env.example .env

# Отредактируйте .env файл, добавив свои значения
```

5. Настройте базу данных:
```bash
# Создайте базу данных PostgreSQL
# Примените миграции
npx prisma migrate dev
```

6. Запустите проект в режиме разработки:
```bash
npm run dev
```

7. Откройте [http://localhost:3000](http://localhost:3000) в вашем браузере.

## 🔧 Настройка окружения

Создайте файл `.env` на основе `.env.example` и настройте следующие переменные:

- `DATABASE_URL` - URL подключения к базе данных PostgreSQL
- `NEXT_PUBLIC_VERCEL_URL` - URL вашего приложения (опционально)

Пример конфигурации для локальной разработки:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager"
NEXT_PUBLIC_VERCEL_URL="http://localhost:3000"
```