# AURA E-Commerce Storefront & Interactive Shopping Cart

> **Task 4 Deliverable**: E-Commerce Product Catalog & Interactive Shopping Cart  
> Sourced directly from **FakeStoreAPI** (`https://fakestoreapi.com/products`).

---

## 📌 Executive Summary

**AURA** is a modern, responsive digital storefront engineered to manage complex component state, quantity math, and a persistent slide-out checkout drawer. The catalog fetches live inventory items from FakeStoreAPI, presents them in an editorial product grid with ratings, unboxed metadata, and instant filtering, and provides a full simulated checkout process with itemized receipt generation.

---

## ✨ Features & Requirements Checklist

| Requirement | Description | Status |
| :--- | :--- | :---: |
| **FakeStoreAPI Catalog Fetch** | Live REST consumption of `https://fakestoreapi.com/products` with automated fallback cache for offline resilience. | ✅ Complete |
| **Product Cards** | High-res image display, star rating (`★ rate (count)`), tabular prices, stock badges, and quick actions. | ✅ Complete |
| **Category Filtering** | Instant tabs for **Electronics**, **Fine Jewelry**, **Men's Clothing**, **Women's Clothing**, and **All Products**. | ✅ Complete |
| **Real-time Search & Sort** | Debounced keyword query by title & description, plus sorting by price, rating, and review count. | ✅ Complete |
| **Persistent Cart Slide-Out Drawer** | Smooth right-side drawer with live items counter badge on the navbar and `localStorage` persistence. | ✅ Complete |
| **Quantity Math** | Dedicated `addToCart(product, qty)`, `removeFromCart(id)`, and `updateQuantity(id, qty)` handlers. | ✅ Complete |
| **Tax & Shipping Calculations** | 8.5% automated sales tax, free standard shipping threshold over $75.00, and promo coupons (`SAVE10`, `AURA20`, `FREESHIP`). | ✅ Complete |
| **Checkout & Order Confirmation** | Simulated checkout modal with customer details, simulated payment validation, and receipt generator. | ✅ Complete |
| **Project Deliverables** | Includes both modern React + TypeScript app and **standalone HTML, CSS, JavaScript** files in `/standalone`. | ✅ Complete |

---

## 🏗️ Architecture & Project Structure

The project is structured with dual availability:
1. **Full Modern Stack** (React 19 + TypeScript + Vite + Tailwind CSS)
2. **Pure Standalone Files** (Zero dependencies: pure HTML, CSS, and Vanilla JS in `/standalone`)

```
├── /src
│   ├── /components
│   │   ├── Navbar.tsx             # 3-Zone Top Bar with Cart Badge counter & category jumps
│   │   ├── Hero.tsx               # Editorial hero with trust metrics & category highlights
│   │   ├── FilterBar.tsx          # Real-time search, category filter tabs, sort, & price slider
│   │   ├── ProductCard.tsx        # Product card with image stage, unboxed rating & quick-add
│   │   ├── CartDrawer.tsx         # Slide-out drawer with quantity steppers & calculation breakdown
│   │   ├── QuickViewModal.tsx     # Deep-dive product inspection dialog
│   │   ├── CheckoutModal.tsx      # Customer shipping & simulated payment submission
│   │   ├── OrderConfirmationModal.tsx # Order confirmation receipt with print/download option
│   │   ├── WishlistDrawer.tsx     # Saved items drawer with 1-click move to cart
│   │   └── ProjectFilesModal.tsx  # In-app viewer & exporter for HTML, CSS, JS, and README
│   ├── /context
│   │   └── CartContext.tsx        # Authoritative state machine & calculation math engine
│   ├── /data
│   │   └── fallbackProducts.ts    # Authentic 20-item FakeStoreAPI verified cache
│   ├── /services
│   │   └── api.ts                 # Resilient fetch client for FakeStoreAPI
│   ├── /types
│   │   └── store.ts               # Strict TypeScript definitions
│   ├── App.tsx                    # Main storefront orchestrator
│   └── main.tsx                   # React root entry point
├── /standalone
│   ├── index.html                 # Standalone pure HTML file
│   ├── styles.css                 # Standalone modern CSS stylesheet
│   └── app.js                     # Standalone Vanilla JavaScript implementation
├── index.html                     # Vite app entry point
├── package.json                   # Dependencies & scripts
└── README.md                      # Project documentation (this file)
```

---

## 🧮 Mathematical Computation Engine

All prices and calculations are computed with floating-point precision rounding:

1. **Subtotal**:
   $$\text{Subtotal} = \sum_{i=1}^{n} (\text{item.price}_i \times \text{item.quantity}_i)$$

2. **Promo Discount**:
   - `SAVE10`: $10\%$ off Subtotal
   - `AURA20`: $20\%$ off Subtotal (minimum spend $\ge \$100.00$)
   - `FREESHIP`: Complimentary Express Shipping ($100\%$ discount on delivery fee)

3. **Discounted Subtotal**:
   $$\text{Net Subtotal} = \max(0, \text{Subtotal} - \text{Discount})$$

4. **Sales Tax (8.5%)**:
   $$\text{Tax} = \text{round}_2(\text{Net Subtotal} \times 0.085)$$

5. **Shipping Policy**:
   - Standard Delivery: **FREE** when $\text{Subtotal} \ge \$75.00$; otherwise **\$9.99**
   - Express Delivery: **\$18.99**

6. **Grand Total**:
   $$\text{Total} = \text{Net Subtotal} + \text{Tax} + \text{Shipping}$$

---

## 🚀 How to Run the Project

### Option A: Running the Modern React App
```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
# -> The application will be running at http://localhost:3000

# 3. Build for production
npm run build
```

### Option B: Using the Standalone Vanilla HTML / CSS / JS Files
1. Navigate to the `/standalone` directory.
2. Open `index.html` directly in any web browser (Chrome, Edge, Safari, Firefox).
3. No server or compilation required—everything runs natively via standard browser Web APIs!

---

## 📡 API Integration Notes

- **Primary Endpoint**: `https://fakestoreapi.com/products`
- **Data Attributes Used**:
  - `id`: Unique product ID
  - `title`: Product name
  - `price`: Product cost (USD)
  - `category`: Category classification (`electronics`, `jewelery`, `men's clothing`, `women's clothing`)
  - `description`: Detailed product copy
  - `image`: High-resolution remote product asset
  - `rating`: Customer rating object containing `rate` (1.0 - 5.0) and `count` (total review volume)

---

## 👤 Author Information & Project Attribution
- **Project**: Task 4 - E-Commerce Product Catalog & Interactive Shopping Cart
- **License**: MIT
- **Design Philosophy**: WCAG AA Compliant, Anti-Slop Discipline, Zero-Pill Metadata, Tabular Numerals.
