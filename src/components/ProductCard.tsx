import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Heart, Check } from 'lucide-react';
import { Product } from '../types/store';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedQty, setSelectedQty] = useState(1);

  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedQty);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  // Human readable category badge
  const formatCategory = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'electronics':
        return 'Electronics';
      case 'jewelery':
        return 'Fine Jewelry';
      case "men's clothing":
        return "Men's Apparel";
      case "women's clothing":
        return "Women's Apparel";
      default:
        return cat;
    }
  };

  // Single subtle tag based on data metrics (Anti-slop zero-pill rule: subtle, unboxed or clean single tag)
  const getSubtleTag = () => {
    if (product.rating.rate >= 4.5) return 'Top Rated';
    if (product.rating.count >= 300) return 'Popular Choice';
    if (product.price > 150) return 'Premium Selection';
    return null;
  };

  const subtleTag = getSubtleTag();

  return (
    <article 
      onClick={() => onQuickView(product)}
      className="group relative bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Top action overlays: subtle badge & wishlist button */}
      <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
        {subtleTag ? (
          <span className="text-[11px] font-semibold tracking-wide text-slate-700 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded border border-slate-200/80 shadow-2xs pointer-events-auto">
            {subtleTag}
          </span>
        ) : <div />}

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
          className={`p-2 rounded-full backdrop-blur-xs transition-colors pointer-events-auto cursor-pointer shadow-2xs ${
            isFavorite
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-white/90 text-slate-400 hover:text-rose-600 hover:bg-white border border-slate-200/60'
          }`}
          title={isFavorite ? "In your saved items" : "Save to wishlist"}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Image Stage */}
      <div className="relative pt-[85%] w-full bg-slate-50/70 overflow-hidden border-b border-slate-100 flex items-center justify-center p-6">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center">
            <span className="text-xs text-slate-400 font-mono">Loading...</span>
          </div>
        )}

        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
            <ShoppingBag className="w-8 h-8 stroke-1 text-slate-300 mb-1" />
            <span className="text-xs text-slate-500 font-medium">{product.title.slice(0, 20)}</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-300 ease-out group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Quick View Hover Prompt */}
        <div className="absolute inset-x-0 bottom-2 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-slate-900/90 text-white rounded-md backdrop-blur-xs shadow-xs">
            <Eye className="w-3 h-3" /> Quick View
          </span>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Metadata line with typographic separators (anti-slop rule) */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5 flex-wrap">
            <span className="font-medium text-indigo-700 tracking-wide uppercase text-[11px]">
              {formatCategory(product.category)}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <div className="inline-flex items-center gap-1 text-amber-500 font-semibold text-[11px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating.rate.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({product.rating.count})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {product.title}
          </h3>

          {/* Short preview snippet */}
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Add to Cart Action Row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="text-xs text-slate-400 block font-normal">Price</span>
            <span className="text-lg font-bold text-slate-900 font-mono tabular-nums tracking-tight">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {/* Quick quantity selector */}
            <select
              value={selectedQty}
              onChange={(e) => setSelectedQty(Number(e.target.value))}
              aria-label="Quantity selector"
              className="py-2 px-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {[1, 2, 3, 4, 5].map(q => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>

            {/* Add to Cart button */}
            <button
              onClick={handleAddToCart}
              aria-label={`Add ${product.title} to cart`}
              className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-indigo-600 text-white'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
