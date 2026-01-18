<div align="center">
<img width="1200" height="475" alt="Cinnamon Lane Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# Cinnamon Lane | Nairobi
*Artisan Bakery and Boutique Pastry House*

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.io/)
[![Gemini](https://img.shields.io/badge/Gemini_AI-8E75C2?style=for-the-badge&logo=google-gemini&logoColor=white)](https://deepmind.google/technologies/gemini/)

</div>

---

## The Experience
Cinnamon Lane is a high-end boutique bakery based in Nairobi, Kenya, specializing in 24-hour brioche doughs, artisanal sourdough, and single-origin Kenyan espresso-infused cakes. This digital storefront provides a premium experience for pastry lovers, combined with powerful administrative tools and AI-driven insights.

### Key Features
- **Curated Collection**: A dynamic menu of fresh-baked goods with real-time stock tracking.
- **Box Builder**: A bespoke experience to curate your own collection of 4, 6, or 12 pastries.
- **Chef Amara (AI Chat)**: A conversational AI chef powered by Gemini 3.0 Pro that knows the ingredients, sensory details, and pairings for every item.
- **AI Beverage Pairings**: Automatic drink suggestions for every pastry, handled by Gemini 3.0 Flash.
- **Staff Dashboard**: Full-site control for bakers to manage inventory, update photography directly in the database, and track orders through a Kanban queue.
- **Transaction Logging**: Complete persistence of orders and customer loyalty points via PostgreSQL.

---

## Technical Stack
- **Frontend**: React 19 + TypeScript
- **Styling**: Vanilla CSS (Tailwind integrated for layout)
- **Database**: Supabase (PostgreSQL)
- **AI Engine**: Google Gemini API
- **Tooling**: Vite (Next-gen frontend Tooling)

---

## Getting Started

### 1. Prerequisites
- **Node.js** (Latest LTS recommended)
- A **Supabase** project
- A **Google AI Studio** API Key

### 2. Installation
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Database Setup
1.  **Database**: Run the `database.sql` script in your Supabase SQL Editor to create the `products`, `customers`, `orders`, and `order_items` tables.

All product updates, transactions, and images (stored as Base64) are persisted directly to your PostgreSQL database.

### 5. Launch
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

---

## Staff Access
To access the administrative area, use the **Staff Login** link in the navigation menu. 
- **Inventory**: Update prices, descriptions, and stock counts.
- **Photography**: Upload new "Main" and "Peek Inside" views for any item.
- **Order Queue**: Manage orders from PENDING to DELIVERED.

---

<div align="center">
Built for Cinnamon Lane • Nairobi, Kenya
</div>
