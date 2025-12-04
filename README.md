# Tally 💰

Tally is a modern accounting app designed for streamlined cashflow logging and tracking, built specifically for small business owners and independent service providers.

## 🚀 Live Demo
[Tally - Your one-stop accountant for small businesses](https://tally-lake.vercel.app/)

## ✨ Features

### 🔐 Authentication
- Secure user authentication with Supabase Auth
- Email/password login and registration
- Protected dashboard routes
- Session management

### 💼 Services Management
- Create, read, update, and delete services
- Organize services by categories (e.g., Lash Extensions, Nails, Hair)
- Set default pricing for each service
- Add descriptions and duration details
- Autocomplete category suggestions

### 💵 Income Tracking
- Log income transactions with detailed information
- Link transactions to services with automatic price filling
- Apply discounts to services
- Track client names for repeat business
- Multiple payment method support (Cash, Card, Bank Transfer, PayPal, Other)
- View income summary with total revenue and transaction count
- Responsive table view (desktop) and card view (mobile)

### 💸 Spending Tracking
- Record business expenses and spending
- Categorize spending (e.g., Supplies, Rent, Marketing)
- Track payment methods
- Add optional notes for additional context
- View spending summary with total expenses and transaction count
- Responsive design for all screen sizes

### 📊 Dashboard
- Quick overview of business finances
- Summary cards for income and spending
- Recent transaction lists
- Mobile-responsive layout

### 📱 Mobile Experience
- Fully responsive design for mobile, tablet, and desktop
- Hamburger menu navigation on mobile devices
- Touch-friendly interfaces
- Optimized card layouts for small screens

### 🌙 Dark Mode
- Full dark mode support across all pages
- Automatic theme detection
- Smooth theme transitions

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **Icons**: Lucide React

## 📁 Project Structure

```
tally-app/
├── src/
│   ├── app/
│   │   ├── (auth)/           # Authentication pages (login, signup)
│   │   ├── dashboard/         # Protected dashboard routes
│   │   │   ├── income/       # Income tracking pages
│   │   │   ├── services/     # Services management pages
│   │   │   ├── spending/     # Spending tracking pages
│   │   │   └── layout.tsx    # Dashboard layout with navigation
│   │   └── page.tsx          # Landing page
│   ├── components/           # Reusable UI components
│   ├── lib/                  # Utility functions and configs
│   └── types/                # TypeScript type definitions
├── supabase/
│   └── migrations/           # Database migration files
└── public/                   # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account and project
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/alexYooDev/tally-app.git
cd tally-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run database migrations:
- Go to your Supabase project SQL Editor
- Run the migration files in `supabase/migrations/` in order

5. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🗄️ Database Schema

### Tables
- `users` - User authentication and profiles
- `services` - Business services catalog
- `income_transactions` - Income records
- `spending_transactions` - Expense records
- `categories` - Service and spending categories (with type filtering)

### Key Relationships
- Services → Categories (many-to-one)
- Income Transactions → Services (many-to-one)
- Income Transactions → Users (many-to-one)
- Spending Transactions → Categories (many-to-one)
- Spending Transactions → Users (many-to-one)

## 🎨 Features in Detail

### Category Management
- Type-based filtering (service vs. spending categories)
- Autocomplete suggestions using HTML5 datalist
- Create categories on-the-fly while adding services/transactions
- Clear category selection with X buttons

### Income Features
- Service-based pricing with automatic price filling
- Discount application
- Total received calculation (price - discount)
- Client name tracking for customer relationship management
- Date validation (cannot select future dates)

### Spending Features
- Flexible categorization
- Description field for transaction details
- Payment method tracking
- Optional notes for additional context

### Responsive Design
- Desktop: Full table views with all transaction details
- Mobile: Card-based layouts optimized for touch
- Tablet: Adaptive layouts that work across breakpoints
- Hamburger menu for mobile navigation

## 🚧 Roadmap

- [ ] Dashboard analytics with charts and graphs
- [ ] Export data to CSV/PDF
- [ ] Category management page
- [X] Date range filtering
- [X] Search and advanced filtering
- [ ] Multi-currency support
- [ ] Recurring transactions
- [ ] Client management system
- [ ] Invoice generation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/alexYooDev/Tally/issues).

## 👨‍💻 Author

**Alex Yoo**
- GitHub: [@alexYooDev](https://github.com/alexYooDev)

---

Built with ❤️ using Next.js and Supabase
