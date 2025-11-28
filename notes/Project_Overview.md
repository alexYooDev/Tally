# Agile Web/Mobile Application Development
- Produce working prototypes deployable to the market

## Background:
- Final year Master of Computer Science student
- Learned Web Development, Object Oriented Programming and Design, Cloud Computing, Software Life Cycle Management, and Basics of Machine Learning (Data Science).
- End goal is to become an independent developer that earns passive income from multiple products

## Aim:
- Producing multiple apps that can turn into passive income flow
- Building portfolio as app developers that can do full-stack development
- Start from the target users around me and then expend
- Provide apps that solve problems for target users 
- For initial stage, aggressively adopt exiting (Selling the ownership of the product or business)

## Preferred Tech Stacks (For Agile development)
- Frontend: Next.st 16 (or LTS)
- Backend&Database: Supabase / PostgreSQL
- Cache Store: Redis
- Deployment: Vercel/Netlify (Depending on the purpose of use)

---


## 📌 PROJECT OVERVIEW: TALLY - Accounting App for Indie Business Owners

### Purpose
Build a cross-platform accounting application for small/independent business owners to track income and spending flows, manage inventory, and visualize cash flow.

### Target Users
- Small business owners
- Independent contractors
- Service providers (focus: lash technicians, beauty professionals)
- Solo entrepreneurs

### Primary Use Case
**Sarah** - Independent Lash Technician
- Tracks income from lash services (Classic, Volume, Fills, Removals)
- Manages service pricing and categories
- Monitors cash flow and client payments
- Plans to expand to inventory and subscription tracking

### Timeline
- **Start Date**: November 26, 2024
- **Target Completion**: 3-4 weeks (Mid-December 2024)
- **MVP Launch**: End of December 2024

### Business Model
- Launch as MVP for target users
- Gain initial traction
- Aggressively pursue exit (sell ownership) once successful
- Build portfolio as full-stack developer
- Multiple products for passive income

---

## 🛠️ TECH STACK

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Hooks, Server Components

### Backend & Database
- **Backend**: Next.js Server Actions
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **API**: Supabase Client Libraries

### Deployment
- **Platform**: Vercel (primary) / Netlify (alternative)
- **Database Hosting**: Supabase Cloud
- **Domain**: TBD

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm
- **IDE**: VS Code (assumed)

---

## 📋 REQUIREMENTS & USER STORIES

### Core Features (MVP)

#### 1. Services Management ✅ COMPLETE
**As a Business Owner:**
- ✅ I want to create and manage my services/products
- ✅ I want to categorize services for better organization
- ✅ I want to set default prices for each service
- ✅ I want to add descriptions to services
- ✅ I want to edit service details when needed
- ✅ I want to delete services I no longer offer

**Acceptance Criteria:**
- ✅ CRUD operations for services
- ✅ Category management (auto-create/select existing)
- ✅ Price formatting in AUD
- ✅ Validation for required fields
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Delete confirmation to prevent accidents

**Technical Requirements:**
- ✅ Server-side operations for security
- ✅ Type-safe with TypeScript
- ✅ Proper foreign key relationships
- ✅ RLS policies for data isolation

---