// ================================================
// TALLY V2 - TypeScript Types (Extended)
// ================================================
// Type-safe database models with Stock, Subscriptions, and Recurring Expenses

/**
 * Database entity with common fields
 */

export interface BaseEntity {
    id: string;
    created_at: string;
    updated_at: string;
};

/**
 * Category types
 */
export type CategoryType = 'service' | 'income' | 'spending';

/**
 * Payment methods supported
*/
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'paypal' | 'other';

/* Billing/Payment frequency */
export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | ' quarterly' | 'yearly';

/**
 * Inventory Transaction types
*/
export type InventoryTransactionType = 'purchase' | 'usage' | 'adjustment' | 'waste';

// ================================================
// EXISTING DATABASE MODELS
// ================================================

export interface Category extends BaseEntity {
    user_id: string;
    name: string;
    type: CategoryType;
    color?: string; // Optional - not currently used
}
    
export interface Service extends BaseEntity {
    user_id: string;
    name: string;
    category_id: string | null;
    default_price: number
    description: string | null;
    is_active: boolean;
}

export interface IncomeTransaction extends BaseEntity {
    user_id: string;
    date: string;
    client_name: string | null;
    service_id: string | null;
    price: number;
    discount: number;
    total_received: number;
    payment_method: PaymentMethod;
    notes: string | null;
}

export interface SpendingTransaction extends BaseEntity {
    user_id: string;
    date: string;
    description: string;
    category_id: string | null;
    amount: number;
    payment_method: PaymentMethod;
    notes: string | null;
}

/* Inventory item - materials, supplies, tools */

export interface InventoryItem extends BaseEntity {
    user_id: string;
    name: string;
    description: string | null;
    sku: string | null;
    category: string | null;
    unit_of_measure: string; /* kg, liter, piece, box, etc. */
    /* Stock levels */
    current_stock: number;
    reorder_point: number;
    reorder_quantity: number;
    /* Pricing */
    unit_cost: number;

    /* Supplier */
    supplier_name: string | null;
    supplier_contact: string | null;

    is_active: boolean;
}

/* Inventory Transaction - stock movements */
export interface InventoryTransaction extends BaseEntity {
    user_id: string;
    inventory_item_id: string;
    transaction_type: InventoryTransactionType;
    quantity: number;
    unit_cost: number | null;
    total_cost: number | null;
    date: string;
    reference: string | null;
    notes: string | null;
    stock_after: number | null;
}

/* Subscription - recurring services/expenses (Youtube, software, etc.) */
export interface Subscription extends BaseEntity {
    user_id: string;
    name: string;
    description: string | null;
    category: string | null;
    amount: number;
    currency: string;
    billing_frequency: BillingFrequency;
    start_date: string;
    next_billing_date: string;
    end_date: string | null;
    is_active: boolean;
    auto_renew: boolean;
    payment_method: PaymentMethod | null;
    remind_days_before: number;
    notes: string | null;
}

/* Subscription Payment History */
export interface SubscriptionPayment extends BaseEntity {
    user_id: string;
    subscription_id: StorageManager;
    payment_date: string;
    amount: number;
    payment_method: PaymentMethod | null;
    spending_transaction_id: string | null;
    notes: string | null;
}

/* Recurring expenses (Rent, etc...) */
export interface RecurringExpense extends BaseEntity {
    user_id: string;
    name: string;
    description: string | null;
    category: string | null;
    amount: number;
    currency: string;
    frequency: BillingFrequency;
    start_date: string;
    next_due_date: string;
    end_date: string | null;
    payment_method: PaymentMethod | null;
    is_active: boolean;
    auto_create_spending: boolean;
    notes: string | null;
}

/**
 * Recurring expense payment history
 */
export interface RecurringExpensePayment extends BaseEntity {
  user_id: string;
  recurring_expense_id: string;
  payment_date: string;
  amount: number;
  period_start: string | null;
  period_end: string | null;
  payment_method: PaymentMethod | null;
  spending_transaction_id: string | null;
  notes: string | null;
}

// ================================================
// EXTENDED TYPES WITH RELATIONS
// ================================================

export interface ServiceWithCategory extends Service {
  category: Category | null;
}

export interface IncomeTransactionWithDetails extends IncomeTransaction {
  service: ServiceWithCategory | null;
}

export interface SpendingTransactionWithDetails extends SpendingTransaction {
  category: Category | null;
}

export interface InventoryItemWithTransactions extends InventoryItem {
  recent_transactions: InventoryTransaction[];
  total_value: number; // current_stock * unit_cost
}

export interface SubscriptionWithPayments extends Subscription {
  payments: SubscriptionPayment[];
  total_paid: number;
}

export interface RecurringExpenseWithPayments extends RecurringExpense {
  payments: RecurringExpensePayment[];
  total_paid: number;
}

// ================================================
// FORM INPUT TYPES
// ================================================

// Existing inputs...
export interface CreateCategoryInput {
  name: string;
  type: CategoryType;
  color?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  color?: string;
}

export interface CreateServiceInput {
  name: string;
  category_id?: string | null;
  default_price: number;
  description?: string | null;
}

export interface UpdateServiceInput {
  name?: string;
  category_id?: string | null;
  default_price?: number;
  description?: string | null;
  is_active?: boolean;
}

export interface CreateIncomeTransactionInput {
  date: string;
  client_name?: string | null;
  service_id?: string | null;
  price: number;
  discount?: number;
  payment_method?: PaymentMethod;
  notes?: string | null;
}

export interface UpdateIncomeTransactionInput {
  date?: string;
  client_name?: string | null;
  service_id?: string | null;
  price?: number;
  discount?: number;
  payment_method?: PaymentMethod;
  notes?: string | null;
}

export interface CreateSpendingTransactionInput {
  date: string;
  description: string;
  category_id?: string | null;
  amount: number;
  payment_method?: PaymentMethod;
  notes?: string | null;
}

export interface UpdateSpendingTransactionInput {
  date?: string;
  description?: string;
  category_id?: string | null;
  amount?: number;
  payment_method?: PaymentMethod;
  notes?: string | null;
}

// New inventory inputs
export interface CreateInventoryItemInput {
  name: string;
  description?: string | null;
  sku?: string | null;
  category?: string | null;
  unit_of_measure?: string;
  current_stock?: number;
  reorder_point?: number;
  reorder_quantity?: number;
  unit_cost?: number;
  supplier_name?: string | null;
  supplier_contact?: string | null;
}

export interface UpdateInventoryItemInput {
  name?: string;
  description?: string | null;
  sku?: string | null;
  category?: string | null;
  unit_of_measure?: string;
  reorder_point?: number;
  reorder_quantity?: number;
  unit_cost?: number;
  supplier_name?: string | null;
  supplier_contact?: string | null;
  is_active?: boolean;
}

export interface CreateInventoryTransactionInput {
  inventory_item_id: string;
  transaction_type: InventoryTransactionType;
  quantity: number;
  unit_cost?: number;
  date: string;
  reference?: string | null;
  notes?: string | null;
}

// New subscription inputs
export interface CreateSubscriptionInput {
  name: string;
  description?: string | null;
  category?: string | null;
  amount: number;
  billing_frequency: BillingFrequency;
  start_date: string;
  payment_method?: PaymentMethod | null;
  remind_days_before?: number;
  notes?: string | null;
}

export interface UpdateSubscriptionInput {
  name?: string;
  description?: string | null;
  category?: string | null;
  amount?: number;
  billing_frequency?: BillingFrequency;
  end_date?: string | null;
  is_active?: boolean;
  auto_renew?: boolean;
  payment_method?: PaymentMethod | null;
  remind_days_before?: number;
  notes?: string | null;
}

export interface CreateSubscriptionPaymentInput {
  subscription_id: string;
  payment_date: string;
  amount: number;
  payment_method?: PaymentMethod | null;
  notes?: string | null;
}

// New recurring expense inputs
export interface CreateRecurringExpenseInput {
  name: string;
  description?: string | null;
  category?: string | null;
  amount: number;
  frequency: BillingFrequency;
  start_date: string;
  payment_method?: PaymentMethod | null;
  auto_create_spending?: boolean;
  notes?: string | null;
}

export interface UpdateRecurringExpenseInput {
  name?: string;
  description?: string | null;
  category?: string | null;
  amount?: number;
  frequency?: BillingFrequency;
  end_date?: string | null;
  is_active?: boolean;
  payment_method?: PaymentMethod | null;
  auto_create_spending?: boolean;
  notes?: string | null;
}

export interface CreateRecurringExpensePaymentInput {
  recurring_expense_id: string;
  payment_date: string;
  amount: number;
  period_start?: string | null;
  period_end?: string | null;
  payment_method?: PaymentMethod | null;
  notes?: string | null;
}

// ================================================
// ANALYTICS & DASHBOARD TYPES
// ================================================

export interface CashFlowSummary {
  period: string;
  total_income: number;
  total_spending: number;
  net_flow: number;
  transaction_count: number;
}

export interface ServicePerformance {
  service_id: string;
  service_name: string;
  times_sold: number;
  total_revenue: number;
  avg_revenue: number;
}

export interface CategorySpending {
  category_id: string | null;
  category_name: string;
  total_amount: number;
  percentage: number;
}

export type TimePeriod = 'day' | 'week' | 'month' | 'year' | 'custom';

export interface DateRange {
  start_date: string;
  end_date: string;
}

export interface DashboardStats {
  total_income: number;
  total_spending: number;
  net_profit: number;
  income_transactions: number;
  spending_transactions: number;
  period: TimePeriod;
  date_range: DateRange;
}

// New analytics types
export interface LowStockAlert {
  item_id: string;
  item_name: string;
  current_stock: number;
  reorder_point: number;
  stock_deficit: number;
  unit_cost: number;
  estimated_reorder_cost: number;
}

export interface UpcomingPayment {
  payment_id: string;
  payment_type: 'subscription' | 'recurring_expense';
  name: string;
  amount: number;
  due_date: string;
  frequency: BillingFrequency;
  days_until_due: number;
}

export interface MonthlyRecurringCosts {
  subscriptions_total: number;
  recurring_expenses_total: number;
  total_monthly_cost: number;
}

export interface InventoryValue {
  total_inventory_value: number;
  total_items: number;
  items_needing_reorder: number;
}

export interface ExtendedDashboardStats extends DashboardStats {
  inventory_value: number;
  monthly_recurring_costs: number;
  upcoming_payments: UpcomingPayment[];
  low_stock_items: LowStockAlert[];
}

// ================================================
// API RESPONSE TYPES
// ================================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

// ================================================
// USER PREFERENCES & SETTINGS
// ================================================

export interface UserPreferences {
  currency: string;
  date_format: string;
  theme: 'light' | 'dark' | 'system';
  default_payment_method: PaymentMethod;
  
  // New preferences
  low_stock_notifications: boolean;
  upcoming_payment_notifications: boolean;
  notification_days_before: number;
}

// ================================================
// UTILITY TYPES
// ================================================

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * AI Insight Generation record for rate limiting
 */
export interface AIInsightGeneration extends BaseEntity {
    user_id: string;
}

export type TableName = 
  | 'categories' 
  | 'services' 
  | 'income_transactions' 
  | 'spending_transactions'
  | 'inventory_items'
  | 'inventory_transactions'
  | 'subscriptions'
  | 'subscription_payments'
  | 'recurring_expenses'
  | 'recurring_expense_payments'
  | 'ai_insight_generations';