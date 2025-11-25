-- Services/Products table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  default_price DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Income transactions
CREATE TABLE income_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  client_name VARCHAR(255),
  service_id UUID REFERENCES services(id),
  price DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  total_received DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50), -- 'cash', 'card', 'transfer', etc.
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spending transactions
CREATE TABLE spending_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  description VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table (for both services and spending)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'service' or 'spending'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name, type)
);

-- Indexes for performance
CREATE INDEX idx_income_user_date ON income_transactions(user_id, date DESC);
CREATE INDEX idx_spending_user_date ON spending_transactions(user_id, date DESC);
CREATE INDEX idx_services_user ON services(user_id);
```

---

## Project Structure
```
accounting-app/
├── src/
│   ├── app/                    # Next.js 14+ App Router
│   │   ├── (auth)/            # Auth routes
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (dashboard)/       # Protected routes
│   │   │   ├── dashboard/
│   │   │   ├── income/
│   │   │   ├── spending/
│   │   │   └── services/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/            # Reusable components
│   │   ├── ui/               # Basic UI components
│   │   ├── forms/            # Form components
│   │   ├── charts/           # Chart components
│   │   └── layout/           # Layout components
│   ├── lib/                   # Utilities
│   │   ├── supabase/         # Supabase client & helpers
│   │   ├── utils.ts          # Helper functions
│   │   └── validations.ts    # Zod schemas
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript types
│   └── store/                 # Zustand state management
├── public/
└── package.json