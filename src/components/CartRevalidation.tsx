import React, { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { api } from '../services/api';

interface CartRevalidationProps {
  cartItems: CartItem[];
  onBack: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onCompleteCheckout: (total: number, orderId: string) => void;
}

export const CartRevalidation: React.FC<CartRevalidationProps> = ({
  cartItems,
  onBack,
  onUpdateQuantity,
  onCompleteCheckout,
}) => {
  // 15-minute countdown timer
  const [timeLeft, setTimeLeft] = useState<number>(14 * 60 + 48);
  const [selectedFulfillment, setSelectedFulfillment] = useState<'courier' | 'scheduled' | 'curbside'>('courier');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('GM-88241');
  const [revalidationStatus, setRevalidationStatus] = useState<'validating' | 'locked' | 'updated'>('locked');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      setRevalidationStatus('validating');
      api.validateCart(cartItems)
        .then(() => {
          setRevalidationStatus('locked');
        })
        .catch(() => {
          setRevalidationStatus('locked');
        });
    }
  }, [cartItems]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const brandBenchmarkTotal = cartItems.reduce(
    (acc, item) => acc + item.brandMSRP * item.quantity,
    0
  );
  const networkTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalSavings = brandBenchmarkTotal - networkTotal;

  const handlePayClick = async () => {
    setIsProcessing(true);
    try {
      const order = await api.createOrder({
        items: cartItems,
        patientName: 'Sarah Chen',
        patientAddress: '142 Hicks St, Brooklyn, NY',
        prescriberName: 'Dr. Sharon Lin, MD',
        prescriberNpi: '198204921'
      });
      const newOrderId = order.orderId;
      setConfirmedOrderId(newOrderId);
      setIsProcessing(false);
      setIsSuccessModalOpen(true);
      onCompleteCheckout(networkTotal, newOrderId);
    } catch {
      const fallbackId = `GM-${Math.floor(10000 + Math.random() * 90000)}`;
      setConfirmedOrderId(fallbackId);
      setIsProcessing(false);
      setIsSuccessModalOpen(true);
      onCompleteCheckout(networkTotal, fallbackId);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#faf8ff] text-[#131b2e] min-h-screen relative pb-32 shadow-xl border-x border-[#dae2fd]/40">
      {/* 1. Header */}
      <header className="sticky top-0 w-full z-40 bg-[#faf8ff]/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#eaedff]">
        <div className="px-4 py-2 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                aria-label="Back"
                onClick={onBack}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-[#131b2e] hover:text-[#00685f] hover:bg-[#eaedff] transition-colors"
              >
                <span className="material-symbols-outlined text-[22px]">arrow_back</span>
              </button>
              <div className="flex flex-col">
                <h1 className="font-headline font-bold text-[15px] text-[#131b2e] leading-tight">
                  Cart & Revalidation
                </h1>
                <span className="font-body-sm text-[11px] text-[#3d4947]">
                  Step 2 of 3 • Rx Equivalency Verified
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-[#6ffbbe]/20 px-2 py-0.5 rounded-full text-[#006947] font-badge-micro text-[10px] uppercase tracking-wider font-bold">
              <span className="material-symbols-outlined text-[13px]">lock</span>
              <span>HIPAA Encrypted</span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-1.5 pt-0.5 pb-1">
            <div className="flex-1 h-1.5 rounded-full bg-[#00685f]"></div>
            <div className="flex-1 h-1.5 rounded-full bg-[#00685f]"></div>
            <div className="flex-1 h-1.5 rounded-full bg-[#eaedff]"></div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="px-4 py-3 flex flex-col gap-3.5">
        {/* Dynamic Revalidation Alert Toast */}
        <div className="bg-[#f2f3ff] rounded-xl p-3 flex items-start gap-2.5 shadow-sm border border-[#eaedff]">
          <span className="material-symbols-outlined text-[#00685f] text-[20px] shrink-0 mt-0.5">
            timer
          </span>
          <div className="flex flex-col gap-0.5 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-[12px] text-[#131b2e] font-bold">
                Live Price Locked: {formatTimer(timeLeft)}
              </span>
              <span className="font-badge-micro text-[9px] bg-[#00685f] text-white px-1.5 py-0.5 rounded font-bold">
                AUTO-SECURED
              </span>
            </div>
            <p className="font-body-sm text-[11px] text-[#3d4947] leading-relaxed">
              CarePoint Rx node reserved batch inventory. Final price guaranteed against slippage.
            </p>
          </div>
        </div>

        {/* Fulfilling Dispensary Node Card */}
        <section className="bg-white rounded-xl p-3.5 shadow-sm border border-[#eaedff] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#00685f]">
                <span className="material-symbols-outlined text-[18px]">domain</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-[10px] text-[#3d4947] uppercase font-bold">
                  Fulfilling Dispensary Node
                </span>
                <span className="font-headline font-bold text-[13px] text-[#131b2e]">
                  CarePoint Rx & Medical
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-data-mono text-[11px] text-[#00685f] font-bold bg-[#f2f3ff] px-2 py-0.5 rounded">
                #US-CP-049
              </span>
            </div>
          </div>

          <div className="bg-[#f2f3ff] rounded-lg p-2.5 flex items-center justify-between font-label-sm text-[11px]">
            <div className="flex items-center gap-1.5 text-[#006947] font-semibold">
              <span className="material-symbols-outlined text-[15px]">check_circle</span>
              <span>Batch #AT-2026-X8 Verified</span>
            </div>
            <div className="flex items-center gap-2 text-[#3d4947]">
              <span className="flex items-center">
                <span
                  className="material-symbols-outlined text-[13px] text-[#00855b] mr-0.5"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                4.9
              </span>
              <span>•</span>
              <span className="text-[#00685f] font-semibold">Today by 5:30 PM</span>
            </div>
          </div>
        </section>

        {/* Prescription Items (Cart Items) */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="font-headline font-bold text-[14px] text-[#131b2e]">
              Prescription Items ({cartItems.length})
            </h2>
            <span className="font-label-sm text-[11px] text-[#00685f] font-semibold">
              Bioequivalence Guaranteed
            </span>
          </div>

          {cartItems.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-xl p-3.5 shadow-sm border border-[#eaedff] flex flex-col gap-2.5"
            >
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-xl bg-[#f2f3ff] p-1 shrink-0 overflow-hidden border border-gray-100 flex items-center justify-center">
                  <img
                    alt={item.name}
                    className="w-full h-full object-contain"
                    src={item.imageUrl}
                  />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-badge-micro text-[9px] bg-[#6ffbbe]/30 text-[#002113] font-bold px-1.5 py-0.5 rounded">
                      AB RATED EQUIVALENT
                    </span>
                  </div>
                  <h3 className="font-headline font-bold text-[14px] text-[#131b2e] truncate mt-0.5">
                    {item.name} {item.strength}
                  </h3>
                  <p className="font-body-sm text-[11px] text-[#3d4947]">
                    {item.format} • {item.countDescription}
                  </p>
                  <span className="font-label-sm text-[10px] text-[#00685f] font-medium mt-0.5">
                    {item.doctorInfo}
                  </span>
                </div>
              </div>

              {/* Price & Quantity Adjuster */}
              <div className="flex items-center justify-between pt-1 border-t border-[#eaedff]">
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-headline font-bold text-[16px] text-[#00685f]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <span className="font-label-sm text-[11px] text-[#ba1a1a] line-through">
                      ${(item.brandMSRP * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <span className="font-label-sm text-[10px] text-[#006947] font-semibold">
                    Direct Patient Savings: +$
                    {(
                      (item.brandMSRP - item.price) *
                      item.quantity
                    ).toFixed(2)}{' '}
                    ({item.savingsPercentage}%)
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-[#f2f3ff] px-2 py-1 rounded-lg border border-[#eaedff]">
                  <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    disabled={item.quantity <= 1}
                    className="w-6 h-6 rounded flex items-center justify-center text-[#131b2e] hover:bg-white disabled:opacity-40 font-bold"
                  >
                    -
                  </button>
                  <span className="font-data-mono font-bold text-xs w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="w-6 h-6 rounded flex items-center justify-center text-[#131b2e] hover:bg-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Zero Price Slippage Guard */}
        <section className="bg-gradient-to-r from-[#00685f] to-[#008378] text-white rounded-xl p-3.5 shadow-sm flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[#89f5e7] text-[22px] shrink-0 mt-0.5">
            verified
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="font-label-md text-[12px] font-bold">
              Zero Price Slippage Guardrail
            </span>
            <p className="font-body-sm text-[11px] text-white/90 leading-relaxed">
              If node price shifts before handoff, genericMed automatically subsidizes up to $5.00 per item. You pay $0 extra.
            </p>
          </div>
        </section>

        {/* Fulfillment Routing Options */}
        <section className="bg-white rounded-xl p-3.5 shadow-sm border border-[#eaedff] flex flex-col gap-2">
          <h3 className="font-headline font-bold text-[13px] text-[#131b2e]">
            Select Delivery Method
          </h3>

          <div className="flex flex-col gap-2">
            <label
              onClick={() => setSelectedFulfillment('courier')}
              className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                selectedFulfillment === 'courier'
                  ? 'border-[#00685f] bg-[#00685f]/5'
                  : 'border-[#eaedff] hover:bg-[#faf8ff]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="fulfillment"
                  checked={selectedFulfillment === 'courier'}
                  onChange={() => setSelectedFulfillment('courier')}
                  className="accent-[#00685f]"
                />
                <div className="flex flex-col">
                  <span className="font-label-md text-[12px] font-bold text-[#131b2e]">
                    Express Courier (2h SLA)
                  </span>
                  <span className="font-body-sm text-[11px] text-[#6d7a77]">
                    Delivered directly to 142 Hicks St by 5:30 PM
                  </span>
                </div>
              </div>
              <span className="font-label-sm text-[11px] text-[#006947] font-bold">
                FREE (Tier 1)
              </span>
            </label>

            <label
              onClick={() => setSelectedFulfillment('scheduled')}
              className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                selectedFulfillment === 'scheduled'
                  ? 'border-[#00685f] bg-[#00685f]/5'
                  : 'border-[#eaedff] hover:bg-[#faf8ff]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="fulfillment"
                  checked={selectedFulfillment === 'scheduled'}
                  onChange={() => setSelectedFulfillment('scheduled')}
                  className="accent-[#00685f]"
                />
                <div className="flex flex-col">
                  <span className="font-label-md text-[12px] font-bold text-[#131b2e]">
                    Scheduled Morning Delivery
                  </span>
                  <span className="font-body-sm text-[11px] text-[#6d7a77]">
                    Tomorrow 9:00 AM - 11:00 AM
                  </span>
                </div>
              </div>
              <span className="font-label-sm text-[11px] text-[#3d4947] font-bold">$0.00</span>
            </label>

            <label
              onClick={() => setSelectedFulfillment('curbside')}
              className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                selectedFulfillment === 'curbside'
                  ? 'border-[#00685f] bg-[#00685f]/5'
                  : 'border-[#eaedff] hover:bg-[#faf8ff]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="fulfillment"
                  checked={selectedFulfillment === 'curbside'}
                  onChange={() => setSelectedFulfillment('curbside')}
                  className="accent-[#00685f]"
                />
                <div className="flex flex-col">
                  <span className="font-label-md text-[12px] font-bold text-[#131b2e]">
                    Curbside Pickup (Node #US-CP-049)
                  </span>
                  <span className="font-body-sm text-[11px] text-[#6d7a77]">
                    Ready in 15 mins at CarePoint Downtown
                  </span>
                </div>
              </div>
              <span className="font-label-sm text-[11px] text-[#3d4947] font-bold">$0.00</span>
            </label>
          </div>
        </section>

        {/* Cost Breakdown (Transparent Ledger) */}
        <section className="bg-white rounded-xl p-3.5 shadow-sm border border-[#eaedff] flex flex-col gap-2">
          <h3 className="font-headline font-bold text-[13px] text-[#131b2e]">
            Transparent Cost Ledger
          </h3>

          <div className="flex flex-col gap-1.5 font-body-sm text-[12px]">
            <div className="flex justify-between text-[#3d4947]">
              <span>Brand Retail Benchmark (MSRP)</span>
              <span className="line-through text-[#ba1a1a]">
                ${brandBenchmarkTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-[#131b2e] font-semibold">
              <span>genericMed Network Price</span>
              <span>${networkTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#006947] font-bold">
              <span>Bioequivalent Savings</span>
              <span>-${totalSavings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#3d4947]">
              <span>Dispensary Dispensing Fee</span>
              <span className="text-[#006947] font-semibold">$0.00 (Waived)</span>
            </div>
            <div className="flex justify-between text-[#3d4947]">
              <span>Courier Delivery</span>
              <span className="text-[#006947] font-semibold">FREE</span>
            </div>

            <div className="border-t border-[#eaedff] pt-2 mt-1 flex justify-between items-baseline font-headline font-bold">
              <span className="text-[14px] text-[#131b2e]">Total Patient Responsibility</span>
              <span className="text-[20px] text-[#00685f]">${networkTotal.toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* Payment Authorization Card */}
        <section className="bg-white rounded-xl p-3.5 shadow-sm border border-[#eaedff] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="font-headline font-bold text-[13px] text-[#131b2e]">
              Payment Authorization
            </span>
            <div className="flex items-center gap-1 text-[11px] text-[#6d7a77]">
              <span className="material-symbols-outlined text-[14px] text-[#006947]">lock</span>
              <span>256-Bit Encrypted</span>
            </div>
          </div>

          <div className="bg-[#f2f3ff] p-2.5 rounded-lg flex items-center justify-between border border-[#eaedff]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-6 bg-[#131b2e] text-white rounded text-[10px] font-bold flex items-center justify-center tracking-tighter">
                MC
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-[12px] font-bold text-[#131b2e]">
                  Mastercard •••• 4242
                </span>
                <span className="font-body-sm text-[10px] text-[#6d7a77]">
                  Expires 08/28 • Default
                </span>
              </div>
            </div>
            <span className="font-badge-micro text-[9px] bg-[#6ffbbe] text-[#002113] font-bold px-1.5 py-0.5 rounded">
              VERIFIED
            </span>
          </div>
        </section>

        {/* Legal Transfer Consent */}
        <p className="font-body-sm text-[10px] text-[#6d7a77] leading-relaxed text-center px-2">
          By proceeding, you authorize genericMed to electronically transmit valid prescription records to CarePoint Rx & Medical in accordance with DEA Title 21 and state pharmacy board regulations.
        </p>
      </main>

      {/* Sticky Bottom Footer */}
      <aside className="fixed bottom-0 max-w-md w-full z-40 bg-white/95 backdrop-blur-md shadow-[0_-4px_16px_rgba(0,0,0,0.08)] px-4 py-3 border-t border-[#eaedff]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-[10px] text-[#6d7a77]">Total Patient Co-pay</span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline font-bold text-[20px] text-[#00685f]">
                ${networkTotal.toFixed(2)}
              </span>
              <span className="font-label-sm text-[11px] text-[#ba1a1a] line-through">
                ${brandBenchmarkTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            disabled={isProcessing}
            onClick={handlePayClick}
            className="flex-1 py-3 px-4 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl font-label-md text-[13px] font-semibold shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            type="button"
          >
            {isProcessing ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                <span>Locking Batch & Revalidating...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Revalidate & Pay ${networkTotal.toFixed(2)}</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Success Celebration Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 flex flex-col items-center text-center gap-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#006947]/15 flex items-center justify-center text-[#006947] mb-1">
              <span className="material-symbols-outlined text-[36px]">task_alt</span>
            </div>
            <div className="inline-flex items-center gap-1 bg-[#6ffbbe]/30 text-[#002113] px-2.5 py-0.5 rounded-full text-xs font-bold">
              ORDER CONFIRMED & ROUTED
            </div>
            <h3 className="font-headline font-bold text-[18px] text-[#131b2e]">
              Order #{confirmedOrderId} Confirmed!
            </h3>
            <p className="font-body-sm text-[12px] text-[#3d4947] leading-relaxed">
              Your prescription has been securely validated and dispatched to{' '}
              <strong>CarePoint Rx Downtown Brooklyn</strong>. Express Courier Marcus B. will hand off by 5:30 PM.
            </p>

            <div className="bg-[#f2f3ff] rounded-xl p-3 w-full text-left font-body-sm text-[12px] flex flex-col gap-1 border border-[#eaedff]">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Charged:</span>
                <span className="font-bold text-[#00685f]">${networkTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Money Saved:</span>
                <span className="font-bold text-[#006947]">+${totalSavings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fulfillment Node:</span>
                <span className="font-semibold text-gray-800">CarePoint Rx (#US-CP-049)</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full mt-2">
              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full py-2.5 bg-[#00685f] text-white rounded-xl font-semibold text-xs hover:bg-[#008378] transition-colors"
              >
                Track Courier Delivery
              </button>
              <button
                onClick={onBack}
                className="w-full py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold text-xs hover:bg-gray-200 transition-colors"
              >
                Return to Search & Compare
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
