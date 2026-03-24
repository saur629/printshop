# PrintCraft — Full Stack Printing Shop

A complete, production-ready printing shop built with Next.js 14, MongoDB, Stripe, and Tailwind CSS.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

| Variable | Where to Get It |
|---|---|
| `MONGODB_URI` | [MongoDB Atlas](https://cloud.mongodb.com) → Create free cluster → Connect → Drivers |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` in terminal |
| `STRIPE_SECRET_KEY` | [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Same Stripe page |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Developers → Webhooks → Add endpoint |
| `UPLOADTHING_SECRET` | [UploadThing](https://uploadthing.com) → Create App |
| `UPLOADTHING_APP_ID` | Same UploadThing page |
| `RESEND_API_KEY` | [Resend](https://resend.com) → API Keys |

### 3. Seed the Database with Sample Products
```bash
npm run seed
```

### 4. Start the Dev Server
```bash
npm run dev
```

Visit: http://localhost:3000

---

## 👤 Create Your Admin Account

1. Go to http://localhost:3000/auth/register and create an account
2. Open [MongoDB Atlas](https://cloud.mongodb.com) → Browse Collections → `users`
3. Find your user and change `"role": "customer"` → `"role": "admin"`
4. Log back in and visit http://localhost:3000/admin

---

## 🏗️ Project Structure

```
printshop/
├── app/
│   ├── page.js                      # Homepage
│   ├── products/                    # Product catalog & detail
│   ├── cart/                        # Shopping cart
│   ├── checkout/                    # Stripe checkout
│   ├── orders/                      # Order history & detail
│   ├── track/                       # Public order tracker
│   ├── auth/                        # Login & register
│   ├── admin/                       # Admin dashboard
│   └── api/                         # All API routes
├── components/
│   └── layout/                      # Navbar, Footer, Layout
├── models/
│   ├── User.js                      # User schema
│   ├── Product.js                   # Product schema
│   └── Order.js                     # Order schema
├── lib/
│   ├── db.js                        # MongoDB connection
│   ├── cartStore.js                 # Zustand cart state
│   ├── email.js                     # Resend email helpers
│   ├── utils.js                     # Utilities
│   └── seed.js                      # Database seeder
└── middleware.js                    # Auth protection
```

---

## ✅ Features

| Feature | Status |
|---|---|
| Product catalog with categories & search | ✅ |
| Product detail with configurator | ✅ |
| Live price quote calculator | ✅ |
| File upload for designs | ✅ |
| Shopping cart (persisted) | ✅ |
| Checkout with Stripe | ✅ |
| Order management & tracking | ✅ |
| Public order tracker | ✅ |
| User authentication (JWT) | ✅ |
| Admin dashboard | ✅ |
| Admin orders management | ✅ |
| Admin product CRUD | ✅ |
| Admin customers view | ✅ |
| Email notifications | ✅ |
| Route protection (middleware) | ✅ |
| Responsive design | ✅ |

---

## 🔧 Stripe Webhooks (Local Testing)

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

---

## 📦 Deployment

```bash
# Deploy to Vercel
npx vercel

# Set environment variables in Vercel Dashboard
# Update NEXTAUTH_URL and NEXT_PUBLIC_APP_URL to your production domain
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: MongoDB + Mongoose
- **Auth**: NextAuth.js
- **Payments**: Stripe
- **File Upload**: UploadThing
- **Email**: Resend
- **State**: Zustand
- **Icons**: Lucide React
- **Charts**: Recharts
