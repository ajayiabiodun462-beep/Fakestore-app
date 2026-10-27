import React, { useState } from 'react';
import { X, Star, ShoppingBag, Check, ShieldCheck, Truck } from 'lucide-react';
import { Product } from '../types/store';
import { useCart } from '../context/CartContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setIsCartOpen(true);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-700 bg-white/80 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Preview */}
            <div className="p-8 bg-slate-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
              <img
                src={product.image}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="max-h-72 object-contain mix-blend-multiply"
              />
            </div>

            {/* Product Meta & Purchase Module */}
            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-mono uppercase tracking-wider">
                  <span>{product.category}</span>
                  <span>·</span>
                  <span>SKU #{product.id.toString().padStart(4, '0')}</span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {product.title}
                </h2>

                {/* Rating */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating.rate)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-700">
                    {product.rating.rate} / 5.0
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ({product.rating.count} customer reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="mt-4 pb-4 border-b border-slate-100">
                  <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="ml-2 text-xs text-emerald-600 font-medium">In Stock &amp; Ready to Ship</span>
                </div>

                {/* Description */}
                <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </p>

                {/* Trust mini features */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Free shipping eligible</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>30-Day returns</span>
                  </div>
                </div>
              </div>

              {/* Purchase Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-l transition-colors cursor-pointer text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-mono font-bold text-slate-900 min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-r transition-colors cursor-pointer text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={isAdded}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 hover:bg-indigo-600 text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart · ${(product.price * quantity).toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
