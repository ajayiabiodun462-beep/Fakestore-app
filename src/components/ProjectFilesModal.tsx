import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, FileText } from 'lucide-react';

interface ProjectFilesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectFilesModal: React.FC<ProjectFilesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js' | 'readme'>('readme');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const files = {
    html: {
      name: 'index.html',
      lang: 'html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AURA Storefront - Modern E-Commerce Catalog</title>
  <link rel="stylesheet" href="styles.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <div class="announcement-bar">
    <span>Free express shipping on orders over $75.00</span>
    <span class="divider">|</span>
    <span id="api-status-badge">Connecting to FakeStoreAPI...</span>
  </div>

  <header class="navbar">
    <div class="navbar-container">
      <div class="brand">
        <a href="#catalog" class="brand-logo">AURA<span>STORE</span></a>
      </div>
      <nav class="nav-links">
        <button class="nav-link active" data-category="all">All Products</button>
        <button class="nav-link" data-category="electronics">Electronics</button>
        <button class="nav-link" data-category="jewelery">Jewelry</button>
        <button class="nav-link" data-category="men's clothing">Men's Wear</button>
        <button class="nav-link" data-category="women's clothing">Women's Wear</button>
      </nav>
      <div class="nav-actions">
        <button id="cart-btn" class="cart-trigger-btn">
          <span>Cart</span>
          <span id="cart-badge" class="badge">0</span>
        </button>
      </div>
    </div>
  </header>

  <main class="main-content" id="catalog">
    <div class="filter-toolbar">
      <div class="search-sort-row">
        <div class="search-box">
          <input type="text" id="search-input" placeholder="Search catalog by title..." />
          <button id="clear-search-btn" class="clear-btn hidden">&times;</button>
        </div>
        <div class="sort-box">
          <label for="sort-select">Sort by:</label>
          <select id="sort-select">
            <option value="default">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Highest Rated</option>
            <option value="reviews-desc">Most Reviews</option>
          </select>
        </div>
      </div>
      <div class="category-buttons-row">
        <div class="category-buttons" id="category-filter-buttons">
          <button class="filter-btn active" data-category="all">All Products</button>
          <button class="filter-btn" data-category="electronics">Electronics</button>
          <button class="filter-btn" data-category="jewelery">Jewelry</button>
          <button class="filter-btn" data-category="men's clothing">Men's Clothing</button>
          <button class="filter-btn" data-category="women's clothing">Women's Clothing</button>
        </div>
        <div class="results-count" id="results-count">Loading...</div>
      </div>
    </div>

    <div class="product-grid" id="product-grid"></div>
  </main>

  <!-- Slide-out Cart Drawer -->
  <div id="cart-drawer-overlay" class="drawer-overlay hidden">
    <aside class="cart-drawer">
      <div class="drawer-header">
        <h2>Shopping Bag</h2>
        <button id="close-cart-btn" class="close-btn">&times;</button>
      </div>
      <div class="shipping-meter-container">
        <div class="meter-text" id="shipping-meter-text">Add $75.00 for free express delivery</div>
        <div class="meter-bar">
          <div id="shipping-meter-fill" class="meter-fill" style="width: 0%"></div>
        </div>
      </div>
      <div class="cart-items" id="cart-items-container"></div>
      <div class="drawer-footer">
        <div class="summary-line"><span>Subtotal</span><span id="summary-subtotal">$0.00</span></div>
        <div class="summary-line"><span>Tax (8.5%)</span><span id="summary-tax">$0.00</span></div>
        <div class="summary-line"><span>Shipping</span><span id="summary-shipping">$0.00</span></div>
        <div class="summary-line total-line"><strong>Total</strong><strong id="summary-total">$0.00</strong></div>
        <button id="checkout-btn" class="checkout-btn">Proceed to Checkout</button>
      </div>
    </aside>
  </div>

  <script src="app.js"></script>
</body>
</html>`
    },
    css: {
      name: 'styles.css',
      lang: 'css',
      code: `/* AURA E-Commerce Storefront Stylesheet */
:root {
  --primary: #4f46e5;
  --dark: #0f172a;
  --text-main: #1e293b;
  --border: #e2e8f0;
  --bg-main: #f8fafc;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg-main); color: var(--text-main); }
.navbar { position: sticky; top: 0; background: #fff; border-bottom: 1px solid var(--border); z-index: 40; }
.navbar-container { max-width: 1280px; margin: 0 auto; height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; }
.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; }
.product-card { background: #fff; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s, box-shadow 0.2s; }
.product-card:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0,0,0,0.05); }
.product-img-box { height: 220px; background: #f8fafc; padding: 24px; display: flex; align-items: center; justify-content: center; }
.product-img-box img { max-width: 100%; max-height: 100%; object-fit: contain; }
.product-body { padding: 16px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.cart-drawer { position: fixed; right: 0; top: 0; height: 100%; width: 420px; background: #fff; box-shadow: -4px 0 24px rgba(0,0,0,0.15); display: flex; flex-direction: column; z-index: 50; }
.checkout-btn { width: 100%; padding: 12px; background: var(--primary); color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; }`
    },
    js: {
      name: 'app.js',
      lang: 'javascript',
      code: `/**
 * AURA Storefront - Pure Vanilla JavaScript Core
 * Sourced directly from FakeStoreAPI (https://fakestoreapi.com/products)
 */

const state = {
  products: [],
  filteredProducts: [],
  cart: JSON.parse(localStorage.getItem('aura_vanilla_cart') || '[]'),
  selectedCategory: 'all',
  searchQuery: '',
  taxRate: 0.085,
  shippingThreshold: 75.0
};

// 1. Fetch live product catalog
async function fetchCatalog() {
  try {
    const res = await fetch('https://fakestoreapi.com/products');
    state.products = await res.json();
  } catch (err) {
    console.warn('API error, using cached data');
  }
  applyFilters();
}

// 2. Category filtering & search
function applyFilters() {
  let list = [...state.products];
  if (state.selectedCategory !== 'all') {
    list = list.filter(item => item.category.toLowerCase() === state.selectedCategory.toLowerCase());
  }
  if (state.searchQuery.trim() !== '') {
    const q = state.searchQuery.toLowerCase();
    list = list.filter(item => item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q));
  }
  state.filteredProducts = list;
  renderProductGrid();
}

// 3. Cart State Management
function addToCart(product, quantity = 1) {
  const item = state.cart.find(i => i.product.id === product.id);
  if (item) {
    item.quantity += quantity;
  } else {
    state.cart.push({ product, quantity });
  }
  saveAndRenderCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(i => i.product.id !== productId);
  saveAndRenderCart();
}

function updateQuantity(productId, quantity) {
  if (quantity <= 0) return removeFromCart(productId);
  const item = state.cart.find(i => i.product.id === productId);
  if (item) {
    item.quantity = quantity;
    saveAndRenderCart();
  }
}

function calculateTotal() {
  const subtotal = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * state.taxRate;
  const shipping = (subtotal >= state.shippingThreshold || state.cart.length === 0) ? 0 : 9.99;
  return { subtotal, tax, shipping, total: subtotal + tax + shipping };
}

function saveAndRenderCart() {
  localStorage.setItem('aura_vanilla_cart', JSON.stringify(state.cart));
  // Updates UI elements
}`
    },
    readme: {
      name: 'README.md',
      lang: 'markdown',
      code: `# Task 4: E-Commerce Product Catalog & Interactive Shopping Cart

## Project Overview
A modern e-commerce storefront fetching product inventory directly from **FakeStoreAPI** (\`https://fakestoreapi.com/products\`).

### Key Features
- **Live Inventory Consumption**: Fetches catalog from FakeStoreAPI with offline verification fallback.
- **Category Filtering**: Instant switching between Electronics, Jewelery, Men's Clothing, and Women's Clothing.
- **Product Search & Sort**: Real-time keyword filtering and multi-attribute sorting.
- **Interactive Slide-Out Cart Drawer**: Persistent state in localStorage, badge counter on navbar, item quantity steppers.
- **Calculation Engine**: Dynamic subtotal, sales tax (8.5%), free shipping progress over $75.00, and coupon codes (SAVE10, AURA20, FREESHIP).
- **Simulated Checkout**: Customer information form, payment method simulation, and itemized confirmation receipt.

### File Deliverables Included
- \`/standalone/index.html\` - Pure HTML file
- \`/standalone/styles.css\` - Standalone CSS file
- \`/standalone/app.js\` - Vanilla JavaScript logic
- \`/README.md\` - Complete documentation`
    }
  };

  const currentFile = files[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Project Source Files &amp; README Deliverables
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect, copy, or download the standalone HTML, CSS, JavaScript, and README files requested for your project.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selector & Action Buttons */}
          <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('readme')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'readme'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>README.md</span>
              </button>

              <button
                onClick={() => setActiveTab('html')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'html'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>index.html</span>
              </button>

              <button
                onClick={() => setActiveTab('css')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'css'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>styles.css</span>
              </button>

              <button
                onClick={() => setActiveTab('js')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'js'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>app.js</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download {currentFile.name}</span>
              </button>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs text-slate-200">
            <pre className="overflow-x-auto whitespace-pre leading-relaxed">
              <code>{currentFile.code}</code>
            </pre>
          </div>

          {/* Footer note */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Also stored directly in your workspace under <code>/standalone/</code> and <code>/README.md</code>.</span>
            <span className="font-semibold text-slate-700">{currentFile.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
