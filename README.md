# PizzaHub — Pizza Ordering & Delivery Platform (Frontend Client)

PizzaHub is a production-grade, full-stack, role-based pizza ordering and restaurant management platform. Customers can discover local artisanal pizzerias, browse interactive menus, filter by diet/category/location, place orders with delivery instructions, and track real-time order status. Restaurant vendors manage menus, approve orders, and subscribe to Premium plans via Stripe. Platform administrators oversee user accounts, moderate menus, and inspect platform transactions.

- **Live Application Link**: [https://pizzahub-client-nazu2.vercel.app](https://pizzahub-client-nazu2.vercel.app)
- **Backend API Live URL**: [https://pizzahub-server-nazu2.vercel.app](https://pizzahub-server-nazu2.vercel.app)
- **Client Repository**: [https://github.com/Nazu3872/pizzahub-client](https://github.com/Nazu3872/pizzahub-client)
- **Server Repository**: [https://github.com/Nazu3872/pizzahub-server](https://github.com/Nazu3872/pizzahub-server)

---

## 🌟 Important Features

### 1. Multi-Role Authentication & Authorization (Better Auth)
- **Role-Based Portals**: Dedicated experiences for **Customer**, **Vendor**, and **Admin**.
- **Credentials & Social Auth**: Secure email/password registration with strict validation (min 6 characters, 1 uppercase, 1 lowercase) and Google OAuth integration.
- **Security & Privilege Protection**: Public sign-up cannot escalate to `admin`. Blocked users are immediately forbidden from protected APIs on both frontend and server.
- **Asymmetric JWT Verification**: Issues verifiable JWKS tokens for secure communication with the backend Express API.

### 2. Public Browsing & Menu Catalog
- **Unrestricted Public Access**: Explore artisanal pizza listings without mandatory login.
- **Advanced Search & Multi-Filters**: Instant keyword search, category filtering (6 categories), and location-based filtering.
- **Dynamic Price Sorting**: Sort items by newest, price (low to high), and price (high to low).
- **Interactive Details**: Detailed view with multi-image gallery, ingredients, vendor profile, and ordering option.

### 3. Dedicated Role-Based Dashboards
- **Vendor Portal (`/dashboard/vendor`)**:
  - Overview stat cards with Recharts analytics.
  - Menu catalog management (Create, Read, Update, Delete, Toggle Availability).
  - ImgBB file upload integration for high-resolution pizza imagery.
  - Customer order fulfillment (Accept / Reject pending orders).
  - Stripe Subscription portal (Free vs. Premium tier comparison).
- **Customer Portal (`/dashboard/customer`)**:
  - Real-time order history tracking with live timeline stages.
  - Ability to cancel pending orders before acceptance.
  - Profile customization (Name, profile photo, contact details).
- **Admin Dashboard (`/dashboard/admin`)**:
  - Platform-wide statistics (users, vendors, menu items, orders, transactions).
  - User management with role filtering and account suspension (Block/Unblock).
  - Menu moderation (Approve, Reject, or Delete items).
  - Read-only transaction ledger.

### 4. Stripe Vendor Subscription
- Vendor tier upgrade to **Premium** enabling unlimited menu items and homepage featured placement.
- End-to-end cryptographic webhook verification (`checkout.session.completed`, `customer.subscription.deleted`, `invoice.paid`).

### 5. UI/UX Polish & Optional Features
- **Dark / Light Mode**: Seamless theme switching with `next-themes` and persistent preference without screen flicker.
- **Order Status Timeline**: Visual progress tracker on order details.
- **Customer Reviews & Testimonials**: Verified ratings and testimonials section.
- **Fully Responsive**: Optimized for Mobile (375px), Tablet (768px), and Desktop (1280px+).

---

## 🛠️ Technology Stack & Dependencies

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript, JavaScript
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **UI Components**: ShadCN UI, Radix UI primitives (`@radix-ui/react-avatar`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-select`, `@radix-ui/react-tabs`, `@radix-ui/react-slot`)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **Authentication**: Better Auth (`better-auth`, `@better-auth/mongo-adapter`, `@better-auth/client`)
- **Database**: MongoDB Native Node.js Driver (`mongodb`)
- **Form Management & Validation**: React Hook Form (`react-hook-form`), Hookform Resolvers (`@hookform/resolvers`), Zod (`zod`)
- **Notifications**: Sonner (`sonner` toasts)
- **Theming**: Next-Themes (`next-themes`)

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- A running MongoDB Atlas instance or local MongoDB

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Nazu3872/pizzahub-client.git
   cd pizzahub-client
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
   BETTER_AUTH_URL=http://localhost:3000
   BETTER_AUTH_SECRET=your_better_auth_secret_here
   MONGODB_URI=your_mongodb_connection_string
   DB_NAME=pizzahub
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   IMGBB_API_KEY=your_imgbb_api_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables Reference

| Variable Name | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Live backend API URL (e.g. `https://pizzahub-server-nazu2.vercel.app`) |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Public Better Auth URL |
| `BETTER_AUTH_URL` | Internal Better Auth URL |
| `BETTER_AUTH_SECRET` | Secret key used for signing and hashing authentication cookies |
| `MONGODB_URI` | MongoDB Atlas cluster connection string |
| `DB_NAME` | Database name (`pizzahub`) |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID for social login |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret for social login |
| `IMGBB_API_KEY` | ImgBB API key for uploading menu item images |

---

## 🏆 Challenge Requirements Implementation Notes

### 1. Advanced Search & Sorting Implementation
- **API Query Parameters**:
  - `search`: Case-insensitive regex matching against pizza `itemName`.
  - `category`: Exact match filter for predefined categories (`Classic Pizzas`, `Vegetarian Pizzas`, `Meat Lovers`, `Specialty / Gourmet Pizzas`, `Sides & Appetizers`, `Beverages & Desserts`).
  - `location`: Case-insensitive location search (area/city).
  - `sort`: Dynamic sort orders:
    - `price_asc`: `{ price: 1 }` (low to high)
    - `price_desc`: `{ price: -1 }` (high to low)
    - `newest`: `{ createdAt: -1 }` (most recently added)
  - `page` & `limit`: Server-side pagination with document count aggregation.
- **Client Integration**: Debounced search inputs and reactive dropdown selectors update URL search parameters, ensuring bookmarkable and shareable filtered URLs.

### 2. JWT Verification Middleware Flow
- **Token Acquisition**: The client retrieves an EdDSA-signed JWT token from Better Auth's `/api/auth/token` endpoint using session cookies.
- **Header Injection**: Requests to protected routes (`/api/orders/*`, `/api/vendor/*`, `/api/admin/*`) automatically attach the `Authorization: Bearer <token>` header.
- **Server Verification Pipeline**:
  1. `verifyJWT` middleware intercepts the request and extracts the bearer token.
  2. Public keys are loaded dynamically from `https://pizzahub-client-nazu2.vercel.app/api/auth/jwks` using `createRemoteJWKSet`.
  3. Token signature, issuer, and expiration are cryptographically validated using `jose.jwtVerify`.
  4. The user record is queried from the MongoDB `user` collection to retrieve the authoritative database `role` and verify `isBlocked !== true`.
  5. Subsequent role-enforcing middleware (`requireRole('admin')`, `requireRole('vendor')`, `requireRole('customer')`) grants access or throws a `403 Forbidden` response.

---

## 🧪 Testing Instructions

### Administrator Credentials
- **Admin Email**: `nazmunnahar.codeware@gmail.com`
- **Admin Password**: `PizzaAdmin2026!`
- **Dashboard URL**: [https://pizzahub-client-nazu2.vercel.app/dashboard/admin](https://pizzahub-client-nazu2.vercel.app/dashboard/admin)

### Stripe Test Card (Vendor Subscription Upgrade)
- **Card Number**: `4242 4242 4242 4242`
- **Expiry Date**: Any future month and year (e.g., `12/28`)
- **CVC**: `123`
- **Postal Code**: `12345`
- **Testing Flow**: Sign in as a vendor (`nazmunnahar3872@gmail.com` / `Password123!`), navigate to **Subscription & Plan**, click **Upgrade to Premium**, complete checkout with the test card, and observe the instant plan update to Premium after webhook receipt!
