import React from 'react';
import { ShoppingBag, Heart, Code2, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
  onOpenSourceModal: () => void;
  onRefreshCatalog: () => void;
  isRefreshing: boolean;
  isApiFallback: boolean;
  onOpenWishlist: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectCategory,
  selectedCategory,
  onOpenSourceModal,
  onRefreshCatalog,
  isRefreshing,
  isApiFallback,
  onOpenWishlist
}) => {
  const { totalItemsCount, setIsCartOpen, calculateTotal, wishlist } = useCart();
  const totals = calculateTotal();

  const navCategories = [
    { label: 'All Products', value: 'all' },
    { label: 'Electronics', value: 'electronics' },
    { label: 'Jewelry', value: 'jewelery' },
    { label: "Men's Clothing", value: "men's clothing" },
    { label: "Women's Clothing", value: "women's clothing" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      {/* Top micro banner for API transparency & free shipping */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 text-center flex items-center justify-center gap-4 flex-wrap font-mono">
        <span>Free express delivery on orders over $75</span>
        <span className="text-slate-500">|</span>
        <span className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isApiFallback ? 'bg-amber-400' : 'bg-emerald-400'}`} />
          {isApiFallback ? 'FakeStoreAPI (Cached Catalog)' : 'FakeStoreAPI Live Synced'}
        </span>
        <button
          onClick={onRefreshCatalog}
          disabled={isRefreshing}
          className="underline hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px]"
          title="Re-fetch from FakeStoreAPI"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          Sync
        </button>
      </div>

      {/* Main Top Bar adhering strictly to the Top Bar Contract (3 zones) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectCategory('all')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              AURA
            </span>
            <span className="text-xs font-semibold text-indigo-600 ml-1.5 uppercase tracking-wider">
              Store
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single line, whitespace-nowrap) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navCategories.map(cat => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onSelectCategory(cat.value)}
                className={`transition-colors whitespace-nowrap py-1 cursor-pointer border-b-2 font-medium ${
                  isActive
                    ? 'text-indigo-600 border-indigo-600'
                    : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Utilities */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            aria-label="Saved items wishlist"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative cursor-pointer"
            title="Saved Items"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Project Source / README deliverables modal trigger */}
          <button
            onClick={onOpenSourceModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="View HTML, CSS, JS and README project files"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Project Files</span>
          </button>

          {/* Cart Slide-out Drawer Trigger with Badge Counter */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Shopping Cart Drawer"
            className="flex items-center gap-2.5 px-3.5 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-amber-400 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-900 tabular-nums">
                  {totalItemsCount}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold whitespace-nowrap">
              Cart
              {totals.subtotal > 0 && (
                <span className="hidden sm:inline ml-1.5 text-slate-300 font-mono tabular-nums">
                  · ${totals.subtotal.toFixed(2)}
                </span>
              )}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
