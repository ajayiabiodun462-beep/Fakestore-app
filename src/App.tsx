/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ProjectFilesModal } from './components/ProjectFilesModal';
import { Product, SortOption, OrderDetails } from './types/store';
import { fetchCatalog } from './services/api';
import { ShoppingBag, RefreshCw, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

function StorefrontApp() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isApiFallback, setIsApiFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showPriceSlider, setShowPriceSlider] = useState(false);

  // Modals state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDetails | null>(null);

  const { toastMessage, dismissToast } = useCart();

  // Load catalog on mount
  const loadProducts = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const result = await fetchCatalog();
      setProducts(result.products);
      setIsApiFallback(result.isFallback);
      setApiError(result.error || null);
    } catch (e: unknown) {
      console.error('Failed to load products', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Real-time filtering and sorting computations
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Search query filter (title and description)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }

    // Price range filter
    list = list.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1]);

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        list.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case 'reviews-desc':
        list.sort((a, b) => b.rating.count - a.rating.count);
        break;
      case 'name-asc':
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Keep original FakeStoreAPI order
        break;
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy, priceRange]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('default');
    setPriceRange([0, 1000]);
    setShowPriceSlider(false);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navbar */}
      <Navbar
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToCatalog();
        }}
        onOpenSourceModal={() => setIsSourceModalOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onRefreshCatalog={() => loadProducts(true)}
        isRefreshing={isRefreshing}
        isApiFallback={isApiFallback}
      />

      {/* Hero Section */}
      <Hero
        onScrollToCatalog={scrollToCatalog}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToCatalog();
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Offline / Cache Fallback notice if applicable */}
        {isApiFallback && (
          <div className="mb-6 p-3.5 bg-amber-50 border border-amber-200/90 rounded-xl text-xs text-amber-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                FakeStoreAPI returned a network delay or sandbox restriction. Seamlessly rendering verified authentic store inventory database ({products.length} items).
              </span>
            </div>
            <button
              onClick={() => loadProducts(true)}
              disabled={isRefreshing}
              className="font-bold underline hover:text-amber-950 shrink-0 cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              Retry Live
            </button>
          </div>
        )}

        {/* Filter and Search Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          totalFilteredCount={filteredProducts.length}
          totalOriginalCount={products.length}
          onResetFilters={handleResetFilters}
          showPriceSlider={showPriceSlider}
          setShowPriceSlider={setShowPriceSlider}
        />

        {/* Product Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 h-80 animate-pulse flex flex-col justify-between">
                <div className="w-full h-40 bg-slate-100 rounded-lg" />
                <div className="space-y-2 mt-4">
                  <div className="w-1/3 h-3 bg-slate-100 rounded" />
                  <div className="w-full h-4 bg-slate-100 rounded" />
                  <div className="w-2/3 h-4 bg-slate-100 rounded" />
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <div className="w-14 h-5 bg-slate-100 rounded" />
                  <div className="w-16 h-8 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-md mx-auto my-8">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No products match your criteria</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Try adjusting your keyword search, selecting another category, or broadening the price filter.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}
      </main>

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Simulated Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(order) => {
          setConfirmedOrder(order);
        }}
      />

      {/* Order Confirmation Receipt Modal */}
      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
      />

      {/* Saved Items Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onQuickView={setQuickViewProduct}
      />

      {/* Source Code & README Modal */}
      <ProjectFilesModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <aside 
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={dismissToast}
            className="ml-2 text-slate-400 hover:text-white cursor-pointer"
          >
            &times;
          </button>
        </aside>
      )}

      {/* Minimal Anti-Slop Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-extrabold text-slate-900 text-sm tracking-tight">AURA</span>
            <span className="ml-2">E-Commerce Product Catalog &amp; Interactive Shopping Cart</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSourceModalOpen(true)}
              className="hover:text-indigo-600 transition-colors cursor-pointer font-medium"
            >
              Export Project Files (HTML/CSS/JS/README)
            </button>
            <span>·</span>
            <span>FakeStoreAPI REST Integration</span>
            <span>·</span>
            <span className="font-mono text-slate-400">Task 4 Solution</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <StorefrontApp />
    </CartProvider>
  );
}
