import React, { useState, useEffect } from 'react';
import { PartnerOrder, ReceiptData } from '../types';
import { api } from '../services/api';

export const PatientOrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<PartnerOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<PartnerOrder | null>(null);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [refundingOrderId, setRefundingOrderId] = useState<string | null>(null);
  const [refundSuccess, setRefundSuccess] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const allOrders = await api.getPartnerOrders();
      setOrders(allOrders);
      if (allOrders.length > 0 && !selectedOrder) {
        setSelectedOrder(allOrders[0]);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewReceipt = async (orderId: string) => {
    try {
      const data = await api.getReceipt(orderId);
      setReceiptData(data);
      setShowReceiptModal(true);
    } catch {
      // ignore
    }
  };

  const handleRefund = async (orderId: string) => {
    if (!window.confirm(`Request full refund and cancel Order #${orderId}?`)) return;
    setRefundingOrderId(orderId);
    try {
      const res = await api.processRefund(orderId, 'Patient requested immediate cancellation before courier handover');
      setRefundSuccess(res.message);
      await fetchOrders();
      if (selectedOrder?.orderId === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: 'Cancelled & Refunded' } : null));
      }
    } catch {
      // ignore
    } finally {
      setRefundingOrderId(null);
    }
  };

  const getTimelineSteps = (status: PartnerOrder['status']) => {
    const steps = [
      { label: 'Order Placed', desc: 'Payment held in Escrow', done: true },
      {
        label: 'Rx TeleRx Verification',
        desc: 'NPI & bioequivalency approved',
        done: status !== 'Just Received'
      },
      {
        label: 'Pharmacist Dispensing',
        desc: 'Scanned & sealed in cleanroom',
        done: status === 'Packed & Staged' || status === 'Ready in Locker' || status === 'Out for Delivery' || status === 'Delivered & Verified'
      },
      {
        label: 'Courier Dispatch',
        desc: 'Temperature controlled transit (2-8°C)',
        done: status === 'Out for Delivery' || status === 'Delivered & Verified'
      },
      {
        label: 'Patient Delivery',
        desc: 'Verified via Secure PIN',
        done: status === 'Delivered & Verified'
      }
    ];
    return steps;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-outline/10">
        <div>
          <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-sm">local_shipping</span>
            <span>Patient Portal & Live Tracking</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface">
            My Orders & Courier Timeline
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Track your generic medication dispatch in real-time, view verified NPI dispensing receipts, and verify delivery PINs.
          </p>
        </div>
      </div>

      {refundSuccess && (
        <div className="my-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">check_circle</span>
            <span>{refundSuccess}</span>
          </div>
          <button onClick={() => setRefundSuccess(null)} className="text-xs hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left: Orders List */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-1">
            Active & Past Orders ({orders.length})
          </h3>
          <div className="space-y-3">
            {orders.map((order) => {
              const isSelected = selectedOrder?.orderId === order.orderId;
              return (
                <div
                  key={order.orderId}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-surface-container border-primary/50 shadow-md ring-1 ring-primary/20'
                      : 'bg-surface border-outline/15 hover:border-outline/30 hover:bg-surface-container/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-sm text-on-surface">
                      #{order.orderId}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        order.status === 'Delivered & Verified'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : order.status === 'Cancelled & Refunded'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-primary/10 text-primary border border-primary/20 animate-pulse'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="text-xs text-on-surface font-medium truncate mb-1">
                    {order.items.map((i) => i.sku).join(', ')}
                  </div>

                  <div className="flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-outline/10 mt-2">
                    <span>Total: <strong className="text-on-surface">${order.financials.patientTotal.toFixed(2)}</strong></span>
                    <span className="font-mono text-[11px] text-primary">{order.urgency.toUpperCase()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Tracking & Details */}
        {selectedOrder ? (
          <div className="lg:col-span-8 space-y-6">
            {/* Live Status Card */}
            <div className="bg-surface rounded-2xl border border-outline/15 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-outline/10">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-on-surface">Order #{selectedOrder.orderId}</h2>
                    <span className="text-xs font-mono bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                      PIN: {selectedOrder.customerPin}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Fulfillment Destination: <span className="font-medium text-on-surface">{selectedOrder.patientAddress}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewReceipt(selectedOrder.orderId)}
                    className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-variant/70 border border-outline/20 text-xs font-bold text-on-surface transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm text-primary">receipt_long</span>
                    <span>View Receipt</span>
                  </button>
                  {selectedOrder.status !== 'Delivered & Verified' && selectedOrder.status !== 'Cancelled & Refunded' && (
                    <button
                      onClick={() => handleRefund(selectedOrder.orderId)}
                      disabled={refundingOrderId === selectedOrder.orderId}
                      className="px-3.5 py-2 rounded-xl border border-rose-500/30 hover:bg-rose-500/10 text-xs font-bold text-rose-400 transition-all"
                    >
                      {refundingOrderId === selectedOrder.orderId ? 'Refunding...' : 'Cancel & Refund'}
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="py-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4">
                  Real-Time Dispatch Timeline
                </h4>
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline/20">
                  {getTimelineSteps(selectedOrder.status).map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-3">
                      <div
                        className={`absolute -left-6 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          step.done
                            ? 'bg-primary border-primary text-on-primary'
                            : 'bg-surface border-outline/30'
                        }`}
                      >
                        {step.done && <span className="material-symbols-outlined text-[10px]">check</span>}
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${step.done ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                          {step.label}
                        </div>
                        <div className="text-[11px] text-on-surface-variant">{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Courier Simulation Card */}
              <div className="p-4 rounded-xl bg-surface-container border border-outline/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-xl">electric_moped</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-on-surface">Courier Express #NYC-882</div>
                    <div className="text-[11px] text-on-surface-variant">Driver: Marcus Vance • On route with temp-regulated pouch</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-on-surface-variant">Estimated Arrival</div>
                    <div className="text-sm font-extrabold text-emerald-400">18 - 24 Mins</div>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                    OTP: {selectedOrder.customerPin}
                  </div>
                </div>
              </div>
            </div>

            {/* Prescriber & Medication Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Prescriber Info */}
              <div className="bg-surface rounded-2xl border border-outline/15 p-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">
                  <span className="material-symbols-outlined text-sm text-primary">stethoscope</span>
                  <span>Prescriber Information</span>
                </div>
                <div className="space-y-1.5">
                  <div className="text-sm font-bold text-on-surface">{selectedOrder.prescriber.name}</div>
                  <div className="text-xs text-on-surface-variant">{selectedOrder.prescriber.specialty}</div>
                  <div className="text-xs text-on-surface-variant">{selectedOrder.prescriber.hospital}</div>
                  <div className="pt-2 flex items-center justify-between text-xs font-mono text-on-surface-variant border-t border-outline/10 mt-2">
                    <span>NPI: {selectedOrder.prescriber.npi}</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      TeleRx Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="bg-surface rounded-2xl border border-outline/15 p-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">
                  <span className="material-symbols-outlined text-sm text-primary">pill</span>
                  <span>Dispensed Medication</span>
                </div>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-surface-container text-xs flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-on-surface">{item.sku}</div>
                        <div className="text-[11px] text-on-surface-variant font-mono">NDC: {item.ndc} • {item.lot}</div>
                      </div>
                      <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {item.rxRating}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center bg-surface rounded-2xl border border-outline/15 text-on-surface-variant">
            Select an order on the left to track dispensing and view receipts.
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {showReceiptModal && receiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface border border-outline/20 rounded-2xl max-w-lg w-full p-6 shadow-2xl overflow-hidden relative">
            <div className="flex items-center justify-between pb-4 border-b border-outline/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">verified</span>
                <h3 className="font-bold text-lg text-on-surface">Official Dispensing Receipt</h3>
              </div>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="p-1 rounded-lg hover:bg-surface-variant text-on-surface-variant"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="flex justify-between text-on-surface-variant">
                <span>Receipt Number:</span>
                <span className="font-mono font-bold text-on-surface">{receiptData.receiptNumber}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Patient:</span>
                <span className="font-medium text-on-surface">{receiptData.patientName}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Prescriber:</span>
                <span className="font-medium text-on-surface">{receiptData.prescriberName} (NPI: {receiptData.prescriberNpi})</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Fulfillment Pharmacy:</span>
                <span className="font-medium text-on-surface">{receiptData.pharmacyName}</span>
              </div>

              {/* Items */}
              <div className="pt-2 border-t border-outline/10 space-y-2">
                {receiptData.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <div>
                      <div className="font-semibold text-on-surface">{it.name}</div>
                      <div className="text-[11px] text-on-surface-variant">NDC: {it.ndc}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-on-surface">${(it.price ?? it.total ?? it.unitPrice ?? 0).toFixed(2)}</div>
                      <div className="text-[10px] text-emerald-400 line-through">${(it.brandComparisonPrice ?? it.brandMSRP ?? 0).toFixed(2)} Brand</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-3 border-t border-outline/10 space-y-1.5">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal:</span>
                  <span>${receiptData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Taxes & Dispensary Fees:</span>
                  <span>${(receiptData.taxesAndFees ?? receiptData.tax ?? 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-on-surface pt-2 border-t border-outline/10">
                  <span>Total Paid (Escrow Settled):</span>
                  <span className="text-primary">${(receiptData.totalPaid ?? receiptData.total ?? 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold text-[11px]">
                  <span>Total Saved vs Brand:</span>
                  <span>${(receiptData.estimatedInsuranceSavings ?? receiptData.totalSaved ?? 0).toFixed(2)}</span>
                </div>
              </div>

              {/* QR Verification */}
              <div className="p-3 bg-surface-container rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-on-surface">SEC-18 QR Verified Hash</div>
                  <div className="text-[10px] text-on-surface-variant">SHA256 Encrypted Dispense Slip</div>
                </div>
                <div className="w-10 h-10 bg-surface-variant rounded flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl text-on-surface">qr_code_2</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
