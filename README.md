# 🛒 বাজার দর (BazarDor)

**BazarDor (বাজার দর)** is a modern commodity price tracking and comparison platform designed to help consumers monitor daily market prices, compare product prices, explore categories, and make smarter purchasing decisions for everyday essentials in Bangladesh.

---

## 🌐 Live Demo

🔗 **Live Website:** https://bazar-dor.vercel.app/

🔗 **GitHub Repository:** https://github.com/fahimrahat58/bazar-dor

---

## 🛠️ Technologies Used

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Authentication:** Better Auth
- **Icons:** Lucide React
- **Image Optimization:** Next.js Image
- **API:** REST API
- **Notifications:** React Hot Toast
- **Linting:** ESLint

---

## ✨ Key Features

### 📊 Real-Time Price Tracking

- View daily prices of essential commodities.
- Track price changes compared with previous market prices.
- Display price increase, decrease, and unchanged indicators.
- Bengali number formatting for a better local experience.

### 🔎 Product Price Comparison

- Compare product prices across different markets.
- View minimum and maximum market prices.
- Explore detailed market information for individual products.

### 🏷️ Category-Based Browsing

- Browse products by category.
- Dynamic category routes using `/category/[slug]`.
- Quickly find products from specific commodity categories.

### 🛍️ Product Details

- Dedicated dynamic product pages using `/products/[slug]`.
- View current price and historical price information.
- View market-wise pricing information.
- Responsive product details layout.

### 📢 Live Product Price Marquee

- Dynamic price ticker in the navigation area.
- Quickly view important product price updates.
- Responsive marquee experience across devices.

### 🔐 Authentication

- Secure sign-up and sign-in system powered by Better Auth.
- Email/password authentication.
- Social authentication support.
- Protected routes for authenticated users.
- Authentication success/error notifications.

### 👤 User Profile

- Personalized user profile page.
- Display user information and profile image.
- Protected profile route.
- Authentication-aware navigation.

### 🔀 Smart Authentication Redirect

- Users trying to access protected pages are redirected to the sign-in page.
- After successful authentication, users are returned to the page they originally requested.

### 📱 Fully Responsive Design

- Mobile-friendly interface.
- Tablet-optimized layouts.
- Desktop responsive design.
- Responsive navigation and product cards.
- Mobile-friendly market tables with horizontal scrolling.

### ⚡ Loading & UX

- Route-level loading screens using Next.js `loading.tsx`.
- Component-level skeleton loading states.
- Smooth loading experience while fetching API data.
- Toast notifications for important user actions.

### 🚫 Custom 404 Handling

- Friendly custom 404 pages for invalid routes.
- Invalid product/category URLs show a clear error state.
- Easy navigation back to the home page.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 18+
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/fahimrahat58/bazar-dor.git
cd bazar-dor
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_DB_URL=your_mongodb_connection_string

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

> Add or update environment variables according to your Better Auth and deployment configuration.

### 4. Run the Development Server

```bash
npm run dev
```

### 5. Open in Browser

Visit:

```text
http://localhost:3000
```

---

## 📁 Project Structure

```text
bazar-dor/
├── public/
│   └── ...                 # Static assets and images
│
├── src/
│   └── app/
│       ├── (auth)/         # Authentication pages
│       │   ├── sign-in/
│       │   └── sign-up/
│       │
│       ├── api/
│       │   └── auth/       # Better Auth API handler
│       │
│       ├── category/
│       │   └── [slug]/     # Dynamic category pages
│       │
│       ├── compare/        # Product comparison page
│       │
│       ├── products/
│       │   └── [slug]/     # Dynamic product detail pages
│       │
│       ├── profile/        # Protected user profile
│       │
│       ├── components/     # Reusable UI components
│       │
│       ├── lib/
│       │   ├── auth.ts     # Better Auth server configuration
│       │   └── auth-client.ts
│       │
│       ├── loading.tsx     # Global loading UI
│       ├── not-found.tsx   # Custom 404 page
│       ├── layout.tsx      # Root layout
│       └── page.tsx        # Home page
│
├── proxy.ts                # Protected route handling
├── eslint.config.mjs       # ESLint configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation
```

---

## 🔗 Main Routes

| Route | Description |
|---|---|
| `/` | Home page |
| `/category/[slug]` | Category products |
| `/products/[slug]` | Product details |
| `/compare` | Price comparison |
| `/sign-in` | User sign-in |
| `/sign-up` | User registration |
| `/profile` | User profile |
| `/404` | Custom not-found page |

---

## 🔌 API

BazarDor uses a REST API for retrieving product, category, and market price information.

### API Base URL

```text
https://api.api-store.workers.dev/api/bazardor
```

### Main Endpoints

```text
GET /products
GET /categories
GET /products/[id]
```

---

## 🎯 Project Goals

The main goal of **BazarDor** is to make daily commodity prices easier to access and understand for Bangladeshi consumers.

The platform focuses on:

- 📈 Understanding price changes
- 🛒 Comparing market prices
- 🏷️ Finding products by category
- 📊 Viewing market-wise price information
- 🇧🇩 Providing a simple Bengali-first experience

---

## 📱 Responsive Design

BazarDor is designed to work across:

- 📱 Mobile
- 📲 Tablet
- 💻 Laptop
- 🖥️ Desktop

The UI uses responsive Tailwind CSS utilities to maintain a consistent experience across different screen sizes.

---

## 👨‍💻 Author

**Fahim Muntasir Rahat**

- GitHub: https://github.com/fahimrahat58
- LinkedIn: https://www.linkedin.com/in/fahim-muntasir-rahat-46ba6b2a7/

> Building. Breaking. Fixing. Learning. 🚀

---

## 📄 License

This project is created for learning, development, and portfolio purposes.
