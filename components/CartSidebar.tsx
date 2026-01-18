import React, { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { mpesaService } from '../services/mpesaService';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onCheckoutComplete: (phone: string) => void;
  getCustomerPurchaseCount: (phone: string) => number;
}

type CheckoutStep = 'CART_AND_PAY' | 'PROCESSING' | 'SUCCESS';

const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onRemoveItem, 
  onCheckoutComplete,
  getCustomerPurchaseCount
}) => {
  const [step, setStep] = useState<CheckoutStep>('CART_AND_PAY');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loyaltyCount, setLoyaltyCount] = useState(0);
  const [hasDiscount, setHasDiscount] = useState(false);
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 150;
  
  // Loyalty Logic: 10% off if purchase count >= 12
  const discountAmount = hasDiscount ? Math.round(subtotal * 0.10) : 0;
  const total = subtotal + deliveryFee - discountAmount;

  // Load phone number from local storage on mount
  useEffect(() => {
    const savedPhone = localStorage.getItem('cinnamon_user_phone');
    if (savedPhone) {
      setPhoneNumber(savedPhone);
      checkLoyalty(savedPhone);
    }
  }, []);

  // Reset/Initialize when opening
  useEffect(() => {
    if (isOpen) {
       // If coming back from success, reset to cart
       if (step === 'SUCCESS') {
         setStep('CART_AND_PAY');
         setHasDiscount(false);
       }
       // If phone exists (from local storage or previous entry), check loyalty immediately
       if (phoneNumber) {
         checkLoyalty(phoneNumber);
       }
    }
  }, [isOpen]);

  const checkLoyalty = (phone: string) => {
    if (phone.length >= 10) {
      const count = getCustomerPurchaseCount(phone);
      setLoyaltyCount(count);
      if (count >= 12 && count % 12 === 0 && count > 0) {
        setHasDiscount(true);
      } else {
        setHasDiscount(false);
      }
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
        alert("Please enter a valid M-Pesa phone number");
        return;
    }

    // Save phone for next time
    localStorage.setItem('cinnamon_user_phone', phoneNumber);

    setStep('PROCESSING');
    
    try {
      const response = await mpesaService.initiateSTKPush(phoneNumber, total);
      console.log('STK Push Initiated:', response);
      
      // If response is successful, we wait for a few seconds then show success
      // In a real app, you'd poll an endpoint or use webhooks to confirm payment
      setTimeout(() => {
        setStep('SUCCESS');
        setTimeout(() => {
          onCheckoutComplete(phoneNumber);
        }, 3500);
      }, 5000); 
    } catch (error: any) {
      console.error('Payment Error:', error);
      alert(error.message || 'Payment initiation failed. Please try again.');
      setStep('CART_AND_PAY');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-md w-full flex pointer-events-none">
        <div className="h-full w-full bg-cream flex flex-col shadow-2xl pointer-events-auto transform transition-transform duration-300 ease-in-out">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-100 flex justify-between items-center bg-white shadow-sm z-10">
            <h2 className="font-serif text-2xl text-coffee">
              {step === 'SUCCESS' ? 'Order Confirmed' : step === 'PROCESSING' ? 'Check your Phone' : 'Your Box'}
            </h2>
            <button onClick={onClose} className="text-stone-400 hover:text-coffee transition-colors p-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto relative bg-cream">
            
            {step === 'CART_AND_PAY' && (
              <div className="flex flex-col h-full">
                {items.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-stone-400 p-8">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mb-4 text-stone-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <p className="mb-6 font-medium">Your box is empty.</p>
                    <button onClick={onClose} className="text-cinnamon uppercase tracking-widest text-xs font-bold hover:underline">Start Ordering</button>
                  </div>
                ) : (
                  <>
                    {/* Item List */}
                    <div className="p-6 pb-0 space-y-6">
                        {items.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="flex gap-4">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-white">
                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex flex-1 flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-serif text-lg text-coffee leading-none mb-1">{item.name}</h3>
                                        {item.variant && <span className="text-xs text-cinnamon">{item.variant}</span>}
                                    </div>
                                    <p className="font-medium text-coffee text-sm">KES {item.price * item.quantity}</p>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-sm text-stone-500">Qty: {item.quantity}</span>
                                    <button 
                                        type="button" 
                                        onClick={() => onRemoveItem(item.id)}
                                        className="text-xs font-medium text-stone-400 hover:text-red-500 transition-colors uppercase tracking-wider"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>

                    {/* Spacing for footer */}
                    <div className="h-6"></div>
                  </>
                )}
              </div>
            )}

            {step === 'PROCESSING' && (
              <div className="flex flex-col h-full justify-center items-center text-center p-8 animate-in fade-in duration-500">
                <div className="relative w-24 h-24 mb-8">
                     <div className="absolute inset-0 border-4 border-stone-100 rounded-full"></div>
                     <div className="absolute inset-0 border-4 border-cinnamon border-t-transparent rounded-full animate-spin"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-cinnamon animate-pulse">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                        </svg>
                     </div>
                </div>
                <h3 className="text-2xl font-serif text-coffee mb-2">Check your phone</h3>
                <p className="text-stone-500 text-sm leading-relaxed max-w-xs mx-auto">
                    We've sent an M-Pesa prompt to <br/>
                    <span className="font-bold text-coffee">{phoneNumber}</span>. <br/>
                    Please enter your PIN to complete the order.
                </p>
              </div>
            )}

            {step === 'SUCCESS' && (
              <div className="flex flex-col h-full justify-center items-center text-center p-8 animate-in zoom-in-95 duration-500">
                 <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-600 shadow-sm border border-green-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 animate-[bounce_1s_ease-in-out_infinite]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                 </div>
                 <h3 className="text-3xl font-serif text-coffee mb-3">Baking in Progress!</h3>
                 <p className="text-stone-500 max-w-xs mb-8 leading-relaxed">
                     Your order has been confirmed. The kitchen has received your ticket.
                 </p>
                 
                 {/* Success Loyalty Card */}
                 <div className="bg-white p-6 rounded-2xl shadow-lg border border-stone-100 w-full max-w-xs transform hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs uppercase tracking-widest text-stone-400">Loyalty Status</span>
                        <span className="text-cinnamon font-bold text-lg">+1 Stamp</span>
                    </div>
                    <div className="flex justify-center items-center gap-2 mb-2">
                       {Array.from({length: 5}).map((_, i) => (
                         <div key={i} className={`w-3 h-3 rounded-full ${i < 4 ? 'bg-cinnamon' : 'bg-stone-200'}`} />
                       ))}
                       <span className="text-xs text-stone-400 ml-1">...</span>
                    </div>
                    <p className="text-xs text-center text-stone-400">You're getting closer to a free box!</p>
                 </div>
              </div>
            )}

          </div>

          {/* Checkout Footer (Sticky) */}
          {step === 'CART_AND_PAY' && items.length > 0 && (
            <div className="border-t border-stone-100 p-6 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
              
              {/* Payment Details */}
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>KES {subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery</span>
                  <span>KES {deliveryFee}</span>
                </div>
                {hasDiscount && (
                    <div className="flex justify-between text-cinnamon font-bold">
                        <span>Baker's Dozen (10% Off)</span>
                        <span>- KES {discountAmount}</span>
                    </div>
                )}
                <div className="flex justify-between text-lg font-serif text-coffee border-t border-dashed border-stone-200 pt-3 mt-3">
                  <span>Total</span>
                  <span>KES {total}</span>
                </div>
              </div>

              {/* Phone Input & Pay Button Combined */}
              <form onSubmit={handlePay} className="space-y-4">
                  <div>
                    <label htmlFor="phone" className="sr-only">Phone Number</label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-stone-500 sm:text-sm">🇰🇪 +254</span>
                        </div>
                        <input 
                            type="tel" 
                            id="phone"
                            required
                            placeholder="7XX XXX XXX"
                            className="focus:ring-cinnamon focus:border-cinnamon block w-full pl-24 py-3 sm:text-sm border-stone-300 rounded-lg bg-stone-50"
                            value={phoneNumber}
                            onChange={(e) => {
                                // Simple sanitizer
                                const val = e.target.value.replace(/[^0-9]/g, '');
                                setPhoneNumber(val);
                                if(val.length >= 9) checkLoyalty(val);
                            }}
                            onBlur={() => checkLoyalty(phoneNumber)}
                        />
                    </div>
                  </div>

                  {loyaltyCount > 0 && phoneNumber.length > 5 && (
                      <p className="text-xs text-center text-stone-500">
                         <span className="font-bold text-cinnamon">{loyaltyCount} orders</span> so far. 
                         {hasDiscount ? " Discount applied!" : " Keep ordering for rewards."}
                      </p>
                  )}

                  <button
                    type="submit"
                    className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-full shadow-lg text-sm font-bold tracking-widest uppercase text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform active:scale-95"
                  >
                    Lipa na M-Pesa
                  </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;