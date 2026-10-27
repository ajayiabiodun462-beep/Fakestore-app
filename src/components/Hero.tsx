import React from 'react';
import { ArrowDown, ShieldCheck, Truck, Percent, Sparkles } from 'lucide-react';

interface HeroProps {
  onScrollToCatalog: () => void;
  onSelectCategory: (cat: string) => void;
  selectedCategory: string;
}

export const Hero: React.FC<HeroProps> = ({
  onScrollToCatalog,
  onSelectCategory,
  selectedCategory
}) => {
  return (
    <section className="relative bg-gradient-to-b from-white via-slate-50 to-slate-100/60 border-b border-slate-200/80 pt-10 pb-12 sm:pt-14 sm:pb-16 overflow-hidden">
      {/* Background subtle mesh grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0f172a 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 tracking-wide uppercase mb-3.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Store Inventory · Task 4 E-Commerce Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight [text-wrap:balance]">
            Modern E-Commerce Storefront &amp; Interactive Cart
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            Live catalog populated from the FakeStoreAPI database. Features real-time multi-category filtering, persistent slide-out checkout drawer with quantity math, automatic tax and shipping computation, and simulated order confirmation.
          </p>

          {/* Action CTAs */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              onClick={onScrollToCatalog}
              className="px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Explore Catalog</span>
              <ArrowDown className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectCategory('electronics')}
              className={`px-4 py-2.5 text-sm font-medium rounded-lg border transition-all cursor-pointer ${
                selectedCategory === 'electronics'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              Electronics
            </button>

            <button
              onClick={() => onSelectCategory('jewelery')}
              className={`px-4 py-2.5 text-sm font-medium rounded-lg border transition-all cursor-pointer ${
                selectedCategory === 'jewelery'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              Fine Jewelry
            </button>
          </div>
        </div>

        {/* 4-Item Feature / Trust Strip */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-200/80">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-white border border-slate-200 text-indigo-600 shadow-xs shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Free Express Delivery</p>
              <p className="text-xs text-slate-500 mt-0.5">Orders over $75.00 automatically qualify</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-white border border-slate-200 text-emerald-600 shadow-xs shrink-0">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Dynamic Tax &amp; Promo Math</p>
              <p className="text-xs text-slate-500 mt-0.5">8.5% sales tax &amp; coupons: SAVE10, AURA20</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-white border border-slate-200 text-sky-600 shadow-xs shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">State Persistence</p>
              <p className="text-xs text-slate-500 mt-0.5">Local storage preserves cart and quantities</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-white border border-slate-200 text-purple-600 shadow-xs shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Simulated Checkout</p>
              <p className="text-xs text-slate-500 mt-0.5">Order generation, receipt breakdown &amp; tracking</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
