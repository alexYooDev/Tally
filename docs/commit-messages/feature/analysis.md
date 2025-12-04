```
feat: Add analytics dashboard, pagination, and reusable UI components

## Features
- Analytics Dashboard with multiple chart types (line, pie, bar)
  - Time-series cash flow visualization
  - Category breakdown pie chart
  - Payment method distribution
  - Monthly comparison chart
  - Time range filtering (7d, 30d, 90d, all)
  
- Pagination System
  - Reusable pagination component with custom hook
  - Integrated across income, spending, services, and cash flow views
  - Configurable items per page (default: 15)
  - Mobile-optimized UI

- Reusable UI Components
  - TransactionTable: Generic table with mobile card view
  - FilterTabs: Reusable tab navigation with counts
  - SummaryCardGrid: Responsive summary card layout
  - EntityActionsMenu: Consistent dropdown menu for all entities
  - Chart components: Line, Pie, Bar charts with dark mode support

## Improvements
- Enhanced data relationships: Added category information to service queries
- Category deletion protection: Validate usage before allowing deletion
- Centralized date formatting utility
- Refactored cash flow view to use reusable components
- Added services list pagination and improved layout

## Bug Fixes
- Fixed TypeScript error: Property 'category' does not exist on service type
- Updated Supabase queries to include nested category data
- Modified ServiceMinimal type to support both raw and transformed data

## Dependencies
- Added recharts@^2.14.1 for data visualization

## Files Changed
- Modified: 14 files
- Created: 12 new files (components, utilities, analytics)

Breaking Changes: None
```