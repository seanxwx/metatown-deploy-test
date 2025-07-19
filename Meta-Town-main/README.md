# 📌 Meta Town

Meta Town is a **Next.js** project designed to create a dynamic virtual world where users can interact, communicate, and explore.

## 🛠️ Tech Stack

- **Framework:** Next.js
- **Backend:** Supabase (PostgreSQL, Authentication, Storage)
- **Database ORM:** Prisma (Schema & Migrations)
- **UI:** TailwindCSS, Lucide Icons
- **Linting & Formatting:** ESLint, Prettier
- **Testing:** Vitest, React Testing Library
- **Tooling:** Storybook, Husky, Commitlint

## 📦 Installation

### 1. **Clone the repository**

```sh
git clone https://github.com/your-repo/meta-town.git
cd meta-town
```

### 2. **Install dependencies**

```sh
npm install
```

### 3. **Run development server**

```sh
npm run dev
```

The application will be available at: [http://localhost:3000](http://localhost:3000)

## 🌍 Environment Variables

All required environment variables are defined in the `.env.example` file. Copy and rename it to `.env.local` and update with your values:

```sh
cp .env.example .env.local
```

> **Note:** Replace example values with your actual credentials.

## 🛠 Development Guide

### **Development Workflow**

When pulling the latest changes from `main`, make sure to:

1. **Apply any pending database migrations**

   ```sh
   npx prisma migrate deploy
   ```

2. **Generate updated Supabase types**

   ```sh
   npx dotenv -- npm run gen-types
   ```

   This will fetch the schema from your Supabase instance and generate type definitions in `database.types.ts`.

3. **Run the development server**

   ```sh
   npm run dev
   ```

### **Managing Database with Prisma**

If you need to modify the database schema, you must do so via Prisma migrations. This ensures that all changes are versioned and can be applied consistently across different environments.

#### **1. Create and Apply a New Migration**

If you make changes to the schema, generate a migration:

```sh
npx prisma migrate dev --name describe-your-change
```

This will:

- Generate a new migration file
- Apply changes to the local database

#### **2. Push Schema Changes (Without a Migration)**

If you need to sync your schema without creating a migration (e.g., in development):

```sh
npx prisma db push
```

This command applies the latest schema changes to the database **without** creating a migration.

#### **3. Open Prisma Studio**

To visually inspect and modify your database, use Prisma Studio:

```sh
npx prisma studio
```

This launches a web-based UI to interact with your database tables.

#### **4. Apply Migrations in Production**

When deploying changes to production, use:

```sh
npx prisma migrate deploy
```

This ensures that all migrations are executed in sequence on the production database.

---

## 🔬 Testing

Run all tests:

```sh
npm run test
```

Run tests in UI mode:

```sh
npm run test:ui
```

---

## 🎨 Storybook

Start Storybook for component development:

```sh
npm run storybook
```

---

## 🔥 Contribution Guidelines

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-branch`
3. Make your changes and commit them using conventional commits
4. Push to your branch: `git push origin feature-branch`
5. Submit a pull request

📢 **Enjoy building with Meta Town! 🚀**
