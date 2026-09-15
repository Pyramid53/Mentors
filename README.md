# Mentors Marine Provisions ⚓

**Suez-based Ship Chandler and Vessel Supply Company**  
*24/7 Provisioning, Technical Stores, Bonded Stores & Maritime Logistics across all Egyptian Ports & Suez Canal Convoy Anchorages.*

---

## 🚀 Live Demo & Deployment

The production website is deployed live on **GitHub Pages**:  
👉 **[https://pyramid53.github.io/Mentors/](https://pyramid53.github.io/Mentors/)**

### 🌟 Automated Deployment via GitHub Actions

1. Pushing commits to `main` or `master` triggers `.github/workflows/main.yml`.
2. The workflow installs packages on Node 22, executes `npm run build:pages`, and deploys `./dist` to GitHub Pages.
3. Configured with:
   - **Canonical Domain & SEO**: Configured for `https://pyramid53.github.io/Mentors/` with Schema.org JSON-LD business metadata.
   - **`sitemap.xml`**: Automatic search engine mapping for all Suez supply routes and services.
   - **`robots.txt`**: Crawl optimization; public catalog enabled while restricting internal dispatch console indexing.
   - **SPA Route Handling (`public/404.html`)**: Automatically reroutes direct URLs (e.g., `/Mentors/services`) into client hash routes (`/Mentors/#/services`).
   - **In-App 404 & 403 Pages**: Dedicated nautical-themed Vessel Off-Course (`404`) and Suez Security Clearance Required (`403`) error handlers with full Arabic and English support.

---

## 🔑 Demo Access Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin / Suez Dispatch Desk** | `admin@mentors.com` | `tarekmentorsowner` | Full Dispatch, RFQ Pricing, Status Updates, Launch Boat Assignment |
| **Client / Shipping Superintendent** | `m.rossi@msc-operations.com` | `client123` | Client Portal, Vessel RFQ Tracking, Live Delivery Status |
| **Client / Fleet Manager** | `superintendent@shipping.com` | `shipping123` | Client Portal, Order History, Requisitions |
| **New Accounts** | *Any email* | *Your password* | Self-registration via the Client Portal |

---

## 🛠️ Architecture & Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion (animations)
- **Routing:** React Router v7 (`HashRouter` for zero-configuration GitHub Pages compatibility)
- **Internationalization:** Full English & Arabic (RTL/LTR) bidirectional support
- **Backend / APIs:** 
  - **Dual-Mode Engine:** Runs with custom Express server on container hosts (`server.ts`), and gracefully transitions to direct client Supabase / local resilient storage when deployed statically on GitHub Pages!
  - **Database:** Supabase (PostgreSQL) with automatic schema sync (`database-schema.sql`) and instant local cache fallback.

---

## 📁 Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD workflow
├── public/
│   ├── .nojekyll               # Disables Jekyll processing on GitHub Pages
│   ├── 404.html                # GitHub Pages SPA routing redirect
│   └── assets/                 # Brand assets & logos
├── src/
│   ├── components/             # Reusable UI components (Navbar, Footer, etc.)
│   ├── data/                   # Suez ports, services, provisions catalogue
│   ├── pages/                  # Top-level view controllers
│   │   ├── HomePage.tsx
│   │   ├── GetAQuotePage.tsx   # 60-Minute fast quotation requisition engine
│   │   ├── ClientPortalPage.tsx# Vessel master & superintendent portal
│   │   ├── AdminDashboardPage.tsx # Suez 24/7 Operations dispatch desk
│   │   ├── ServicesPage.tsx
│   │   ├── PortsPage.tsx
│   │   ├── AboutPage.tsx
│   │   └── WhyUsPage.tsx
│   ├── services/               # State managers & API integrations
│   │   ├── authStore.ts        # Resilient multi-tier authentication
│   │   ├── requestStore.ts     # RFQ and inquiry store with cloud sync
│   │   ├── supabaseClient.ts   # Supabase client singleton
│   │   └── languageStore.ts    # English / Arabic i18n store
│   ├── types.ts                # TypeScript domain models & interfaces
│   ├── App.tsx                 # Core application routes & layouts
│   └── main.tsx                # Client entry point
├── database-schema.sql         # Supabase PostgreSQL DDL schema & seed
├── server.ts                   # Express full-stack API server
├── package.json                # Dependencies and deployment scripts
└── vite.config.ts              # Vite configuration with relative base path
```

---

## 💻 Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   Server will start on `http://localhost:3000`.

3. **Build for GitHub Pages (Static):**
   ```bash
   npm run build:pages
   ```

4. **Build full-stack server & bundle:**
   ```bash
   npm run build
   ```

5. **Lint check:**
   ```bash
   npm run lint
   ```

---

## ⚙️ Environment Configuration (Optional)

To connect your own **Supabase** cloud database, configure these variables in `.env` (locally) or in **GitHub Secrets** (for GitHub Actions):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

If these keys are not set, the application automatically uses its built-in local persistence and pre-seeded realistic Suez transit records.

---

© 2026 Mentors Marine Provisions SAE. Suez, Egypt.
