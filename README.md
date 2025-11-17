# Belimbing.ai Bank Saving System

A complete Next.js fullstack banking application implementing a Bank Saving System using MVC principles, with **Supabase Postgres** as the database and **Drizzle ORM**.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Database**: Supabase Postgres
- **ORM**: Drizzle ORM (postgres-js driver)
- **UI**: shadcn/ui + TailwindCSS
- **Validation**: Zod
- **State/Data**: React Query (TanStack Query)
- **Deploy**: Vercel (App) + Supabase (DB)

## ✨ Features

### Banking System Management

- **Customers** (CRUD)
  - Create, read, update, and delete customers
  - Search customers by name

- **Accounts** (CRUD)
  - Create accounts for customers
  - Link accounts to deposito types
  - View account balances and details

- **Deposito Types** (CRUD)
  - Manage deposito types (Bronze, Silver, Gold)
  - Configure yearly return rates
  - Unique name validation

- **Transactions**
  - **Deposit**: Add funds to accounts
  - **Withdraw**: Withdraw funds with interest calculation
  - View transaction history per account
  - Interest calculation breakdown on withdrawal

### Interest Calculation

The system calculates interest based on:
- Starting balance
- Months from account creation to withdrawal date
- Yearly return rate from deposito type
- Formula: `endingBalance = startingBalance * (1 + monthlyReturn * months)`

## 📦 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd banking-saving-system
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update `.env` with your Supabase connection strings:

```env
# Supabase → Project Settings → Database → Connection strings
# Use "Pooled" (pgBouncer 6543) for DATABASE_URL (runtime),
# and "Direct" (5432) for DIRECT_URL (migrations/seed).

DATABASE_URL="postgresql://<USER>:<PASSWORD>@<HOST>.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://<USER>:<PASSWORD>@<HOST>.supabase.co:5432/postgres"
```

### Setting up Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. Go to **Project Settings** → **Database**
3. Copy the connection strings:
   - **Pooled connection** (port 6543) → Use for `DATABASE_URL`
   - **Direct connection** (port 5432) → Use for `DIRECT_URL`
4. Replace `<USER>`, `<PASSWORD>`, and `<HOST>` with your actual credentials

## 🛠️ Development

### Database Setup

1. Generate migrations from schema:

```bash
pnpm db:generate
```

2. Push schema to Supabase:

```bash
pnpm db:push
```

3. Seed the database with initial data:

```bash
pnpm db:seed
```

This will create:
- 3 deposito types (Bronze: 3%, Silver: 5%, Gold: 7%)
- 1 sample customer (John Miller)
- 1 sample account (Gold type, 1,000,000 balance)

### Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📜 Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate Drizzle migrations from schema
- `pnpm db:push` - Push schema changes to Supabase
- `pnpm db:studio` - Open Drizzle Studio (database GUI)
- `pnpm db:seed` - Seed database with initial data

## 🗄️ Database Schema

### Tables

- **customers**: Customer information
  - `id` (serial, primary key)
  - `name` (text, not null)

- **deposito_types**: Types of deposito accounts
  - `id` (serial, primary key)
  - `name` (text, unique, not null)
  - `yearly_return` (numeric, precision 12, scale 6)

- **accounts**: Customer accounts
  - `id` (serial, primary key)
  - `packet` (text, not null)
  - `balance` (numeric, precision 18, scale 2, default 0)
  - `customer_id` (integer, foreign key → customers)
  - `deposito_type_id` (integer, foreign key → deposito_types)
  - `created_at` (timestamp, default now)

- **transactions**: Account transactions
  - `id` (serial, primary key)
  - `type` (enum: 'deposit' | 'withdraw')
  - `amount` (numeric, precision 18, scale 2)
  - `date` (timestamp)
  - `account_id` (integer, foreign key → accounts)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (REST endpoints)
│   ├── customers/         # Customer pages
│   ├── accounts/          # Account pages
│   ├── deposito-types/    # Deposito type pages
│   └── transactions/      # Transaction pages
├── db/                    # Database configuration
│   ├── schema.ts          # Drizzle schema definitions
│   ├── index.ts           # Database connection
│   └── seed.ts            # Seed script
├── features/              # Feature modules (MVC structure)
│   ├── customers/
│   │   ├── api/           # API client functions
│   │   ├── services/      # Business logic
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   └── types/         # TypeScript types
│   ├── accounts/
│   ├── deposito-types/
│   └── transactions/
├── lib/                   # Shared utilities
│   ├── calc.ts            # Interest calculation
│   ├── validations.ts     # Zod schemas
│   └── errors.ts          # Error helpers
└── shared/                # Shared components and utilities
    ├── components/        # Reusable UI components
    ├── hooks/             # Custom React hooks
    └── utils/             # Utility functions
```

## 🧮 Interest Calculation

The interest calculation formula:

```typescript
function calculateEndingBalance(
  starting: number,
  yearlyReturn: number,
  months: number
) {
  const monthly = yearlyReturn / 12;
  return starting * (1 + monthly * months);
}
```

**Example:**
- Starting balance: 1,000,000 IDR
- Yearly return: 7% (0.07)
- Months: 12
- Monthly return: 0.07 / 12 = 0.00583
- Ending balance: 1,000,000 * (1 + 0.00583 * 12) = 1,070,000 IDR

## ☁️ Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel:
   - `DATABASE_URL` (pooled connection)
   - `DIRECT_URL` (direct connection)
4. Deploy

### Database Migrations

Run migrations from local before deploying:

```bash
pnpm db:generate
pnpm db:push
```

Or use Vercel's build command to run migrations automatically.

## 📝 Notes

- The application uses **pgBouncer** (pooled connection) for runtime queries
- Use **direct connection** only for migrations and seeding
- All numeric values are stored as strings in the database (Drizzle numeric type)
- Transaction dates are stored as timestamps without timezone
- Account balance is updated automatically on deposit/withdraw

## 🔒 Security

- Environment variables are not committed to the repository
- Database credentials should be kept secure
- Use Supabase Row Level Security (RLS) for production if needed

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

## 🐛 Troubleshooting

### Database Connection Issues

- Verify your Supabase connection strings are correct
- Check that your IP is allowed in Supabase settings
- Ensure you're using the correct port (6543 for pooled, 5432 for direct)

### Migration Issues

- Make sure `DIRECT_URL` is set correctly
- Run `pnpm db:generate` before `pnpm db:push`
- Check Drizzle logs for specific errors

### Build Issues

- Clear `.next` folder and rebuild
- Check TypeScript errors with `pnpm lint`
- Verify all dependencies are installed

---

Built with ❤️ for Belimbing.ai Full Stack Engineer Test
