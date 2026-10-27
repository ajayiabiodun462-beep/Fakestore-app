import React, { useState } from 'react';
import { X, ShieldCheck, Lock, CreditCard, Banknote, Smartphone, CheckCircle, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CustomerInfo, OrderDetails } from '../types/store';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: OrderDetails) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const { cart, calculateTotal, clearCart, appliedCoupon, shippingMethod } = useCart();
  const totals = calculateTotal();

  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
    deliveryNotes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFillDemoData = () => {
    setCustomer({
      fullName: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      phone: '+1 (555) 349-8120',
      address: '742 Evergreen Terrace, Suite 4B',
      city: 'San Francisco',
      postalCode: '94107',
      country: 'United States',
      deliveryNotes: 'Please leave package by the front reception desk.'
    });
    setErrorMessage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.fullName || !customer.email || !customer.address || !customer.city || !customer.postalCode) {
      setErrorMessage('Please fill in all required shipping fields or click "Fill Demo Details".');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    // Simulate payment authorization & order generation
    setTimeout(() => {
      const orderId = `AURA-${Math.floor(100000 + Math.random() * 900000)}`;
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + (shippingMethod === 'express' ? 2 : 5));

      const newOrder: OrderDetails = {
        orderId,
        createdAt: new Date().toISOString(),
        items: [...cart],
        customer: { ...customer },
        paymentMethod: paymentMethod === 'card' ? 'Visa •••• 4242' : paymentMethod === 'wallet' ? 'Apple Pay / Digital Wallet' : 'Cash on Delivery (COD)',
        subtotal: totals.subtotal,
        discount: totals.discount,
        couponCode: appliedCoupon?.code,
        tax: totals.tax,
        shipping: totals.shipping,
        total: totals.total,
        estimatedDelivery: deliveryDate.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      };

      clearCart();
      setIsSubmitting(false);
      onClose();
      onOrderSuccess(newOrder);
    }, 1200);
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
          className="relative bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  Simulated Checkout &amp; Order Confirmation
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete your simulated order with real-time tax and shipping calculations.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleFillDemoData}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors cursor-pointer"
              >
                Fill Demo Details
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmitOrder} className="p-4 sm:p-6 space-y-6">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Shipping Address & Customer Data */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span>1. Shipping Destination</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={customer.fullName}
                      onChange={handleInputChange}
                      placeholder="Jane Doe"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={customer.email}
                        onChange={handleInputChange}
                        placeholder="jane@example.com"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={customer.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={customer.address}
                      onChange={handleInputChange}
                      placeholder="123 Market Street, Apt 4"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={customer.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        value={customer.postalCode}
                        onChange={handleInputChange}
                        placeholder="94103"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Country
                      </label>
                      <select
                        name="country"
                        value={customer.country}
                        onChange={handleInputChange}
                        className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Germany">Germany</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Payment Selector */}
                <div className="pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    2. Payment Method
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mx-auto mb-1" />
                      <span className="text-[11px] block">Credit Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('wallet')}
                      className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                        paymentMethod === 'wallet'
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 mx-auto mb-1" />
                      <span className="text-[11px] block">Digital Wallet</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Banknote className="w-4 h-4 mx-auto mb-1" />
                      <span className="text-[11px] block">Pay On Delivery</span>
                    </button>
                  </div>

                  {/* Card Simulation details */}
                  {paymentMethod === 'card' && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-0.5">Card Number (Simulated)</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded font-mono text-xs text-slate-800"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] text-slate-500 mb-0.5">Exp Date</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded font-mono text-xs text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-500 mb-0.5">CVC</label>
                          <input
                            type="password"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded font-mono text-xs text-slate-800"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Order Summary & Review */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center justify-between">
                    <span>Order Summary</span>
                    <span className="text-slate-500 font-mono font-normal">
                      {cart.length} unique {cart.length === 1 ? 'item' : 'items'}
                    </span>
                  </h3>

                  {/* Mini item list */}
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1 mb-4">
                    {cart.map(item => (
                      <div key={item.product.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                        <div className="flex items-center gap-2 truncate mr-2">
                          <span className="font-mono text-slate-400 shrink-0">{item.quantity}x</span>
                          <span className="truncate text-slate-800 font-medium">{item.product.title}</span>
                        </div>
                        <span className="font-mono tabular-nums text-slate-900 font-semibold shrink-0">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Computations Math Table */}
                  <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-200">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono tabular-nums text-slate-900 font-medium">
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
                      <span>Estimated Sales Tax (8.5%)</span>
                      <span className="font-mono tabular-nums text-slate-900 font-medium">
                        ${totals.tax.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Shipping ({shippingMethod})</span>
                      <span className="font-mono tabular-nums text-slate-900 font-medium">
                        {totals.shipping === 0 ? (
                          <span className="text-emerald-600 font-semibold">FREE</span>
                        ) : (
                          `$${totals.shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm font-bold text-slate-900">
                      <span>Grand Total</span>
                      <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
                        ${totals.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Safe test simulation. No charges will be made.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || cart.length === 0}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Authorizing &amp; Generating Order...</span>
                      </div>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Place Simulated Order (${totals.total.toFixed(2)})</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
