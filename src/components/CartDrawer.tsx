import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    calculateTotal,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    shippingThreshold,
    shippingMethod,
    setShippingMethod,
    totalItemsCount
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const totals = calculateTotal();
  const amountToFreeShipping = Math.max(0, shippingThreshold - totals.subtotal);
  const freeShippingProgress = Math.min(100, (totals.subtotal / shippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError(null);
      setCouponInput('');
    }
  };

  const handleQuickCoupon = (code: string) => {
    setCouponInput(code);
    const res = applyCoupon(code);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError(null);
      setCouponInput('');
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 ease-out"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside 
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between focus:outline-none animate-in slide-in-from-right duration-300"
          aria-label="Shopping Cart Drawer"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-tight">
                  Shopping Bag
                </h2>
                <p className="text-xs text-slate-500 font-mono">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-slate-50 px-4 sm:px-5 py-3 border-b border-slate-200/80">
            {amountToFreeShipping > 0 ? (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                  <span>Add <strong className="font-bold text-slate-900 font-mono">${amountToFreeShipping.toFixed(2)}</strong> for Free Express Delivery</span>
                  <span className="font-mono text-slate-500">{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>You unlocked complimentary standard shipping!</span>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Your bag is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Explore our catalog and add items to your cart to calculate live taxes and shipping.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-indigo-600 transition-colors cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.product.id}
                  className="flex gap-3.5 p-3 rounded-lg border border-slate-200/80 bg-white hover:border-slate-300 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-md bg-slate-50 p-1.5 shrink-0 border border-slate-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-semibold text-slate-900 truncate">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          aria-label={`Remove ${item.product.title} from cart`}
                          className="text-slate-400 hover:text-rose-600 p-1 -mr-1 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 capitalize">
                        {item.product.category}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-md bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-200/80 rounded-l transition-colors cursor-pointer text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-mono font-bold text-slate-900 min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-200/80 rounded-r transition-colors cursor-pointer text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="block text-[10px] text-slate-400 font-mono">
                            ${item.product.price.toFixed(2)} each
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Calculations & Checkout Panel */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/80 space-y-3.5">
              {/* Promo Code Input */}
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Coupon <strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.description})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-slate-400 hover:text-rose-600 text-xs font-medium cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value);
                            setCouponError(null);
                          }}
                          placeholder="Coupon code (e.g. SAVE10)"
                          className="w-full pl-8 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md uppercase font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-md transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>

                    {couponError && (
                      <p className="mt-1 text-[11px] text-rose-600 font-medium">{couponError}</p>
                    )}

                    {/* Quick test coupon shortcuts */}
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span>Test codes:</span>
                      <button
                        type="button"
                        onClick={() => handleQuickCoupon('SAVE10')}
                        className="underline hover:text-indigo-600 font-mono cursor-pointer"
                      >
                        SAVE10
                      </button>
                      <span>·</span>
                      <button
                        type="button"
                        onClick={() => handleQuickCoupon('AURA20')}
                        className="underline hover:text-indigo-600 font-mono cursor-pointer"
                      >
                        AURA20
                      </button>
                      <span>·</span>
                      <button
                        type="button"
                        onClick={() => handleQuickCoupon('FREESHIP')}
                        className="underline hover:text-indigo-600 font-mono cursor-pointer"
                      >
                        FREESHIP
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping Method Selector */}
              <div className="flex items-center justify-between text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="font-medium">Shipping Speed:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShippingMethod('standard')}
                    className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                      shippingMethod === 'standard'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Standard ({totals.shipping === 0 ? 'FREE' : '$9.99'})
                  </button>
                  <button
                    onClick={() => setShippingMethod('express')}
                    className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                      shippingMethod === 'express'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Express ($18.99)
                  </button>
                </div>
              </div>

              {/* Order Calculations Math Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium text-slate-900 tabular-nums">
                    ${totals.subtotal.toFixed(2)}
                  </span>
                </div>

                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span className="font-mono tabular-nums">-${totals.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Tax (8.5%)</span>
                  <span className="font-mono font-medium text-slate-900 tabular-nums">
                    ${totals.tax.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-mono font-medium text-slate-900 tabular-nums">
                    {totals.shipping === 0 ? (
                      <span className="text-emerald-600 font-semibold">FREE</span>
                    ) : (
                      `$${totals.shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm">
                  <span className="font-bold text-slate-900">Total Due</span>
                  <span className="text-lg font-extrabold text-slate-900 font-mono tabular-nums">
                    ${totals.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onProceedToCheckout();
                  }}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <button
                    onClick={clearCart}
                    className="hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    Clear bag
                  </button>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    Simulated Instant Checkout
                  </span>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
