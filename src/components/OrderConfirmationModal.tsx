import React from 'react';
import { CheckCircle2, Printer, ShoppingBag, Truck, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { OrderDetails } from '../types/store';

interface OrderConfirmationModalProps {
  order: OrderDetails | null;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
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
          className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Banner */}
          <div className="bg-emerald-600 text-white p-6 sm:p-8 text-center relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-3 backdrop-blur-xs">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Order Confirmed!
              </h2>
              <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-md">
                Thank you for your simulated order, {order.customer.fullName}. A confirmation email has been dispatched.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-black/20 rounded-full text-xs font-mono">
                <span>Order Reference:</span>
                <strong className="tracking-wider text-white">{order.orderId}</strong>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Quick Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 block font-normal">Order Date</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 block font-normal">Est. Delivery</span>
                  <span className="font-semibold text-indigo-700">
                    {order.estimatedDelivery}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 col-span-2 sm:col-span-1">
                <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 block font-normal">Ship To</span>
                  <span className="font-semibold text-slate-800 truncate block max-w-[150px]">
                    {order.customer.city}, {order.customer.postalCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Itemized Order Line Items */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Itemized Receipt
              </h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                {order.items.map((item) => (
                  <div key={item.product.id} className="p-3 bg-white flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-slate-50 p-1 rounded border border-slate-100 shrink-0 flex items-center justify-center">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">
                          {item.product.title}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          {item.quantity} x ${item.product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-900 tabular-nums shrink-0">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-slate-900 font-medium">${order.subtotal.toFixed(2)}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Promo Discount ({order.couponCode || 'APPLIED'})</span>
                  <span className="font-mono tabular-nums">-${order.discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Sales Tax (8.5%)</span>
                <span className="font-mono tabular-nums text-slate-900 font-medium">${order.tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-mono tabular-nums text-slate-900 font-medium">
                  {order.shipping === 0 ? <span className="text-emerald-600 font-semibold">FREE</span> : `$${order.shipping.toFixed(2)}`}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm font-bold text-slate-900">
                <span>Total Paid</span>
                <span className="text-lg font-extrabold text-slate-900 font-mono tabular-nums">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Shipping Address & Payment Note */}
            <div className="text-xs text-slate-500 border-t border-slate-100 pt-4 flex flex-col sm:flex-row justify-between gap-3">
              <div>
                <strong className="text-slate-700 block mb-0.5">Delivery Address:</strong>
                <p>{order.customer.fullName}</p>
                <p>{order.customer.address}, {order.customer.city}, {order.customer.postalCode}</p>
                <p>{order.customer.country} · {order.customer.phone}</p>
              </div>
              <div className="sm:text-right">
                <strong className="text-slate-700 block mb-0.5">Payment Method:</strong>
                <p>{order.paymentMethod}</p>
                <p className="text-[11px] text-slate-400">Status: Completed (Simulated)</p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center justify-between gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-indigo-600 rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Continue Shopping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
