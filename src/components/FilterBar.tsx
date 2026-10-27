import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { SortOption } from '../types/store';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  totalFilteredCount: number;
  totalOriginalCount: number;
  onResetFilters: () => void;
  showPriceSlider: boolean;
  setShowPriceSlider: (show: boolean) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  totalFilteredCount,
  totalOriginalCount,
  onResetFilters,
  showPriceSlider,
  setShowPriceSlider
}) => {
  const categories = [
    { label: 'All Catalog', value: 'all' },
    { label: 'Electronics', value: 'electronics' },
    { label: 'Jewelry', value: 'jewelery' },
    { label: "Men's Clothing", value: "men's clothing" },
    { label: "Women's Clothing", value: "women's clothing" },
  ];

  const hasActiveFilters = 
    searchQuery.trim() !== '' || 
    selectedCategory !== 'all' || 
    sortBy !== 'default' ||
    priceRange[0] > 0 ||
    priceRange[1] < 1000;

  return (
    <div id="catalog-section" className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-xs mb-8">
      {/* Search & Sort Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
        {/* Search Input with quick clear */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products by title or keyword..."
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort & Price Filter Controls */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
          {/* Price Filter Toggle */}
          <button
            onClick={() => setShowPriceSlider(!showPriceSlider)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
              showPriceSlider || priceRange[0] > 0 || priceRange[1] < 1000
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Price: ${priceRange[0]} - ${priceRange[1]}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="pl-8 pr-8 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
            >
              <option value="default">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="reviews-desc">Most Reviews</option>
              <option value="name-asc">Alphabetical (A-Z)</option>
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1.5 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Expandable Price Range Slider */}
      {showPriceSlider && (
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="font-medium text-slate-700">Max Budget:</span>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={priceRange[1]}
              onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
              className="w-48 accent-indigo-600 cursor-pointer"
            />
            <span className="font-mono font-semibold text-slate-900">${priceRange[1]}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPriceRangeChange([0, 50])}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-medium text-slate-700 cursor-pointer"
            >
              Under $50
            </button>
            <button
              onClick={() => onPriceRangeChange([0, 150])}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-medium text-slate-700 cursor-pointer"
            >
              Under $150
            </button>
            <button
              onClick={() => onPriceRangeChange([0, 1000])}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-medium text-slate-700 cursor-pointer"
            >
              All Prices
            </button>
          </div>
        </div>
      )}

      {/* Category Filter Buttons (Functional segmented buttons with click handlers) */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onCategoryChange(cat.value)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Results Counter */}
        <div className="text-xs text-slate-500 font-mono">
          Showing <span className="font-bold text-slate-900">{totalFilteredCount}</span> of {totalOriginalCount} products
        </div>
      </div>
    </div>
  );
};
