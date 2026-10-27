import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product } from '../types/store';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickView: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ isOpen, onClose, onQuickView }) => {
  const { wishlist, toggleWishlist, addToCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 ease-out"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside 
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between focus:outline-none animate-in slide-in-from-right duration-300"
          aria-label="Wishlist drawer"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-tight">
                  Saved Items
                </h2>
                <p className="text-xs text-slate-500 font-mono">
                  {wishlist.length} {wishlist.length === 1 ? 'saved product' : 'saved products'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <Heart className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No saved items</h3>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Click the heart icon on any product in the catalog to save it for later.
                </p>
              </div>
            ) : (
              wishlist.map(product => (
                <div 
                  key={product.id}
                  className="flex gap-3.5 p-3 rounded-lg border border-slate-200/80 bg-white hover:border-slate-300 transition-colors"
                >
                  <div 
                    onClick={() => {
                      onQuickView(product);
                      onClose();
                    }}
                    className="w-16 h-16 rounded-md bg-slate-50 p-1.5 shrink-0 border border-slate-100 flex items-center justify-center overflow-hidden cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 
                        onClick={() => {
                          onQuickView(product);
                          onClose();
                        }}
                        className="text-xs font-semibold text-slate-900 truncate hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        {product.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 capitalize">
                        {product.category} · ★ {product.rating.rate}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                        ${product.price.toFixed(2)}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleWishlist(product)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            addToCart(product, 1);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold bg-slate-900 hover:bg-indigo-600 text-white rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Move to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
