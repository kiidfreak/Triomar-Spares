# Triomah Spares Ltd - Specialist Car Spare Parts Website

A modern, responsive car spare parts website built with Next.js, specializing in Mazda CX-5, Nissan X-Trail T30, and Toyota Prado parts.

## 🚗 Project Overview

Triomah Spares Ltd is a specialized car spare parts business located in Manchester, UK, providing customers with:
- Vehicle-specific parts for Mazda, Nissan, and Toyota models
- Comprehensive parts catalog by category and vehicle
- Expert knowledge in specific vehicle makes
- Local service with fast delivery
- Quality parts and expert support
- Mobile-responsive design

## 🏗️ Architecture & Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### State Management
- **Zustand** - Lightweight state management
- **React Query** - Server state management

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Storage for images
- **Edge Functions** - Serverless API endpoints

### Third-Party Integrations
- **Stripe** - Payment processing
- **Google Maps API** - Store locator
- **Algolia** - Search functionality
- **Cloudinary** - Image optimization

## 📁 Project Structure

```
autoparts-hub/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication routes
│   │   ├── (dashboard)/       # User dashboard routes
│   │   ├── (shop)/            # Shop/product routes
│   │   ├── api/               # API routes
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # Reusable components
│   │   ├── ui/               # Base UI components
│   │   ├── forms/            # Form components
│   │   ├── layout/           # Layout components
│   │   ├── product/          # Product-related components
│   │   └── vehicle/          # Vehicle-related components
│   ├── lib/                  # Utility functions
│   │   ├── supabase/         # Supabase client & utilities
│   │   ├── utils/            # Helper functions
│   │   └── validations/      # Zod schemas
│   ├── hooks/                # Custom React hooks
│   ├── stores/               # Zustand stores
│   ├── types/                # TypeScript type definitions
│   └── styles/               # Additional styles
├── public/                   # Static assets
│   ├── images/               # Website images
│   ├── icons/                # SVG icons
│   └── fonts/                # Custom fonts
├── supabase/                 # Database migrations & types
├── components.json           # shadcn/ui configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── next.config.js            # Next.js configuration
├── package.json              # Dependencies
└── README.md                 # This file
```

## 🚀 Features

### Core E-commerce
- **Product Catalog**: Browse automotive parts by category, brand, or vehicle
- **Vehicle Compatibility**: Find parts that fit specific makes/models
- **Search & Filters**: Advanced search with multiple filter options
- **Shopping Cart**: Persistent cart with quantity management
- **Checkout**: Secure payment processing with Stripe
- **Order Management**: Track orders and view history

### User Experience
- **Responsive Design**: Mobile-first, tablet, and desktop optimized
- **User Accounts**: Registration, login, and profile management
- **Wishlists**: Save favorite products for later
- **Reviews & Ratings**: Customer feedback system
- **Recently Viewed**: Track browsing history

### Business Features
- **Store Locator**: Find nearby retail locations
- **Inventory Management**: Real-time stock updates
- **Promotions**: Coupons, discounts, and special offers
- **Loyalty Program**: Points-based rewards system
- **Email Marketing**: Newsletter and promotional emails

### Content & Education
- **DIY Guides**: Step-by-step repair instructions
- **Video Tutorials**: Installation and maintenance videos
- **Part Finder**: Interactive tool to identify parts
- **Blog**: Automotive tips and industry news

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd autoparts-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Database Setup**
   ```bash
   # Generate Supabase types
   npm run supabase:types
   
   # Run migrations
   npm run supabase:migrate
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📱 Pages & Routes

### Public Pages
- `/` - Homepage with hero, featured products, categories
- `/shop` - Product catalog with filters
- `/products/[id]` - Individual product page
- `/categories/[slug]` - Category-specific products
- `/brands/[slug]` - Brand-specific products
- `/stores` - Store locator
- `/about` - Company information
- `/contact` - Contact form and information
- `/help` - FAQ and support

### Authentication
- `/login` - User login
- `/register` - User registration
- `/forgot-password` - Password recovery

### User Dashboard
- `/dashboard` - User overview
- `/dashboard/profile` - Profile management
- `/dashboard/orders` - Order history
- `/dashboard/vehicles` - Saved vehicles
- `/dashboard/wishlist` - Saved products
- `/dashboard/addresses` - Address book

### Shop
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/checkout/success` - Order confirmation
- `/checkout/cancel` - Payment cancellation

## 🎨 Design System

### Color Palette
- **Primary**: Auto Orange (#F26D0D) - Brand color
- **Secondary**: Deep Blue (#1E3A8A) - Accent color
- **Success**: Green (#059669) - Success states
- **Warning**: Yellow (#D97706) - Warning states
- **Error**: Red (#DC2626) - Error states
- **Neutral**: Gray scale (#F9FAFB to #111827)

### Typography
- **Headings**: Inter (Bold, SemiBold)
- **Body**: Inter (Regular, Medium)
- **Monospace**: JetBrains Mono (for technical content)

### Components
- **Buttons**: Primary, Secondary, Outline, Ghost variants
- **Cards**: Product cards, info cards, feature cards
- **Forms**: Input fields, selects, checkboxes, radio buttons
- **Navigation**: Header, footer, breadcrumbs, pagination
- **Modals**: Product quick view, cart preview, filters

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

### Products
- `GET /api/products` - List products with filters
- `GET /api/products/[id]` - Get product details
- `GET /api/products/search` - Search products
- `GET /api/categories` - List categories
- `GET /api/brands` - List brands

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - List user orders
- `GET /api/orders/[id]` - Get order details
- `PUT /api/orders/[id]` - Update order status

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/vehicles` - Get user vehicles
- `POST /api/user/vehicles` - Add vehicle

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Ensure all production environment variables are set in your hosting platform.

### Database
Run production migrations before deploying:
```bash
npm run supabase:migrate:prod
```

### Railway PostgreSQL
Add the following to `.env.local` to use Railway Postgres:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DBNAME?sslmode=require
# Optional: force SSL in non-prod
PGSSL=true
```

Notes:
- Use the Connection URL from Railway (ensure `sslmode=require`).
- After changing env vars, restart the dev server.

#### Create database on Railway and apply schema/seeds

1. Create a new PostgreSQL service on Railway
2. Copy the `Connection URL` and set it in `.env.local` as `DATABASE_URL`
3. Ensure `PGSSL=true` if your instance requires SSL (most do)
4. Apply migrations and seeds from this repo:

```bash
# In project root with .env.local loaded
npm run db:bootstrap
# Or separately
npm run db:apply:migrations
npm run db:apply:seeds
```

This runs all SQL files in `supabase/migrations` and `supabase/seeds` against your Railway database.

## 📊 Performance Optimization

- **Image Optimization**: Next.js Image component with WebP format
- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Images and components loaded on demand
- **Caching**: Static generation and ISR for better performance
- **CDN**: Global content delivery network

## 🔒 Security Features

- **Authentication**: JWT tokens with refresh mechanism
- **Authorization**: Role-based access control
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Content Security Policy
- **CSRF Protection**: Cross-Site Request Forgery prevention

## 🧪 Testing

### Testing Stack
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing
- **Cypress** - End-to-end testing
- **MSW** - API mocking

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

## 📈 Analytics & Monitoring

- **Google Analytics 4** - User behavior tracking
- **Sentry** - Error monitoring and performance
- **Vercel Analytics** - Web vitals and performance metrics
- **Custom Events** - E-commerce conversion tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Design inspiration from AutoZone.com
- Icons from Heroicons and Lucide
- UI components from shadcn/ui
- Database powered by Supabase
