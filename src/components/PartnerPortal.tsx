import React, { useState } from 'react';
import { PARTNER_ORDERS_DATA } from '../data/mockData';
import { PartnerOrder } from '../types';

interface PartnerPortalProps {
  onOrderProcessed?: () => void;
}

export const PartnerPortal: React.FC<PartnerPortalProps> = () => {
  const [orders, setOrders] = useState<PartnerOrder[]>(PARTNER_ORDERS_DATA);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('GM-88241');
  const [filterTab, setFilterTab] = useState<'all' | 'verify' | 'courier' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Interactive checklist states
  const [checkNdC, setCheckNdc] = useState<boolean>(true);
  const [checkCount, setCheckCount] = useState<boolean>(true);
  const [checkSafetyCap, setCheckSafetyCap] = useState<boolean>(true);
  const [checkSeal, setCheckSeal] = useState<boolean>(false);

  const [sealedOrders, setSealedOrders] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const selectedOrder = orders.find((o) => o.orderId === selectedOrderId) || orders[0];
  const isOrderSealed = sealedOrders.includes(selectedOrder.orderId);

  const handleAuthorizeSeal = () => {
    if (!checkSeal) {
      alert('Please check "Affix Lead Pharmacist Physical Tamper-Evident Seal" before authorizing dispense.');
      return;
    }
    setSealedOrders((prev) => [...prev, selectedOrder.orderId]);
    showToast(`Order #${selectedOrder.orderId} Authorized & Sealed! Staged for Driver Marcus B.`);
  };

  const handlePrintLabels = (orderId: string) => {
    showToast(`Printing DEA/NPI Rx compliance labels for #${orderId} on Zebra thermal printer.`);
  };

  const handleAcceptOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId ? { ...o, status: 'Needs Dispensing' } : o
      )
    );
    showToast(`Order #${orderId} claimed and moved to active dispensing queue.`);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((i) => i.sku.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterTab === 'verify') return order.status === 'Needs Dispensing';
    if (filterTab === 'courier') return order.status === 'Packed & Staged' || order.status === 'Ready in Locker';
    if (filterTab === 'completed') return sealedOrders.includes(order.orderId);
    return true;
  });

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] min-h-screen flex flex-col font-body">
      {/* Top Telemetry Header */}
      <header className="bg-white border-b border-[#eaedff] px-4 py-2.5 flex items-center justify-between sticky top-10 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006947] animate-pulse"></span>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-sm text-[#131b2e]">
                  CarePoint Rx Downtown Brooklyn
                </span>
                <span className="bg-[#eaedff] text-[#00685f] text-[10px] font-bold px-1.5 py-0.5 rounded font-data-mono">
                  #US-CP-049 PRIMARY
                </span>
              </div>
              <span className="text-[11px] text-[#6d7a77]">
                Local Dispensing Node • Multi-Tenant Partner Schema: tenant_carepoint_prod
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-[#f2f3ff] px-2.5 py-1 rounded-lg border border-[#eaedff] text-xs">
            <span className="material-symbols-outlined text-[#006947] text-[16px]">wifi</span>
            <span className="text-[#3d4947] font-medium">POS Live Sync:</span>
            <span className="font-bold text-[#006947]">0.14s Latency</span>
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1Wy7VvC1evCNrHbcHWsqYoIQY1yIiBgLtufmHg6ei71FLzorFc3-VoB0tJ-NgkESv_X4sG2xu_jJe1xHcZwGkd39HO4RsMdtEd3UOaUysr3p68B-D-QcBzOgz2i_fV0NVmJBzNUpHegPShpxrmf7qDgUANlTGAQTAkpWpt_VOyvU8WuTHtHsG8Cs0uYZwCB7S58aau2SzPnqWGzz2cSwoTH-mxgw2kAlDSvu2WCLA-FbXStZx4bPBaZ9w"
              alt="Dr. Marcus Vance"
              className="w-8 h-8 rounded-full border border-gray-200 object-cover"
            />
            <div className="hidden md:flex flex-col">
              <span className="font-bold text-xs text-[#131b2e]">Dr. Marcus Vance, PharmD</span>
              <span className="text-[10px] text-[#00685f] font-semibold">Lead Dispensing Pharmacist</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar and Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Operations Sidebar */}
        <aside className="w-full md:w-60 bg-white border-r border-[#eaedff] p-3 flex flex-col justify-between shrink-0 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-[#6d7a77] font-bold px-2">
                Dispensing Operations
              </span>
              <nav className="flex flex-col gap-0.5">
                <button className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#00685f] text-white font-medium text-xs shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[17px]">inbox</span>
                    <span>Incoming Orders</span>
                  </div>
                  <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    14
                  </span>
                </button>

                <button className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[#3d4947] hover:bg-[#eaedff] hover:text-[#131b2e] font-medium text-xs transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[17px]">inventory_2</span>
                    <span>Live Inventory & Alerts</span>
                  </div>
                  <span className="bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    3 Low
                  </span>
                </button>

                <button className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[#3d4947] hover:bg-[#eaedff] hover:text-[#131b2e] font-medium text-xs transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[17px]">price_change</span>
                    <span>Offer Pricing & Margins</span>
                  </div>
                </button>

                <button className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[#3d4947] hover:bg-[#eaedff] hover:text-[#131b2e] font-medium text-xs transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[17px]">local_shipping</span>
                    <span>Courier Handoff</span>
                  </div>
                  <span className="bg-[#6ffbbe]/30 text-[#002113] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    6 Pickups
                  </span>
                </button>
              </nav>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-[#6d7a77] font-bold px-2">
                Administration & Audits
              </span>
              <nav className="flex flex-col gap-0.5">
                <button className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[#3d4947] hover:bg-[#eaedff] hover:text-[#131b2e] font-medium text-xs transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[17px]">account_balance</span>
                    <span>Settlement & Payouts</span>
                  </div>
                </button>

                <button className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[#3d4947] hover:bg-[#eaedff] hover:text-[#131b2e] font-medium text-xs transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[17px]">gavel</span>
                    <span>License & Compliance</span>
                  </div>
                  <span className="text-[#006947] text-[10px] font-bold">Active</span>
                </button>

                <button className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[#3d4947] hover:bg-[#eaedff] hover:text-[#131b2e] font-medium text-xs transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[17px]">settings</span>
                    <span>Store Settings</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Hardware Barcode Scanner Status */}
          <div className="bg-[#f2f3ff] rounded-xl p-3 border border-[#eaedff] mt-4 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[11px] text-[#131b2e] flex items-center gap-1">
                <span className="material-symbols-outlined text-[#00685f] text-[15px]">barcode_scanner</span>
                <span>Barcode Scanner</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-[#006947] animate-ping"></span>
            </div>
            <p className="text-[10px] text-[#6d7a77]">
              ONLINE • Honeywell 1950G USB-HID Active
            </p>
            <button
              onClick={() => showToast('Barcode Scanner Hardware Calibration Test Passed!')}
              className="mt-1 py-1 px-2 bg-white text-[#00685f] hover:bg-[#eaedff] text-[10px] font-bold rounded border border-gray-200 transition-colors"
            >
              Test Scan Beep
            </button>
          </div>
        </aside>

        {/* Main Workstation Area */}
        <main className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
          {/* Dynamic Operational Summary Bar */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-[#eaedff] flex flex-col">
              <span className="text-[11px] text-[#6d7a77] font-medium">Today's Inflow</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="font-headline font-bold text-xl text-[#131b2e]">38</span>
                <span className="text-[10px] text-[#006947] font-bold">+12% vs avg</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl shadow-sm border border-[#eaedff] flex flex-col">
              <span className="text-[11px] text-[#6d7a77] font-medium">Packed & Sealed</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="font-headline font-bold text-xl text-[#00685f]">
                  {31 + sealedOrders.length}
                </span>
                <span className="text-[10px] text-[#006947] font-bold">81.5% complete</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl shadow-sm border border-[#eaedff] flex flex-col">
              <span className="text-[11px] text-[#6d7a77] font-medium">Avg Dispense Turn</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="font-headline font-bold text-xl text-[#006947]">7.2m</span>
                <span className="text-[10px] text-[#006947] font-bold">&lt;15m SLA (In Spec)</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl shadow-sm border border-[#eaedff] flex flex-col">
              <span className="text-[11px] text-[#6d7a77] font-medium">Net Store Earnings</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="font-headline font-bold text-xl text-[#131b2e]">$894.20</span>
                <span className="text-[10px] text-[#006947] font-bold">+14.2% today</span>
              </div>
            </div>
          </section>

          {/* Queue Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-white p-2.5 rounded-xl shadow-sm border border-[#eaedff]">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterTab === 'all'
                    ? 'bg-[#00685f] text-white shadow-sm'
                    : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff]'
                }`}
              >
                All Active Orders ({orders.length})
              </button>
              <button
                onClick={() => setFilterTab('verify')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterTab === 'verify'
                    ? 'bg-[#00685f] text-white shadow-sm'
                    : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff]'
                }`}
              >
                Action Required: Verify Rx & Pack (3)
              </button>
              <button
                onClick={() => setFilterTab('courier')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterTab === 'courier'
                    ? 'bg-[#00685f] text-white shadow-sm'
                    : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff]'
                }`}
              >
                Ready for Courier Handoff (4)
              </button>
              <button
                onClick={() => setFilterTab('completed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterTab === 'completed'
                    ? 'bg-[#00685f] text-white shadow-sm'
                    : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff]'
                }`}
              >
                Completed Today ({31 + sealedOrders.length})
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-gray-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search order #, patient, SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f2f3ff] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#131b2e] focus:outline-none focus:ring-1 focus:ring-[#00685f]"
              />
            </div>
          </div>

          {/* Two-Column Workstation Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Column: Orders Stream (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              {filteredOrders.map((order) => {
                const isSelected = selectedOrderId === order.orderId;
                const isSealed = sealedOrders.includes(order.orderId);

                return (
                  <article
                    key={order.orderId}
                    onClick={() => setSelectedOrderId(order.orderId)}
                    className={`bg-white rounded-xl p-4 shadow-sm border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#00685f] ring-2 ring-[#00685f]/20 shadow-md'
                        : 'border-[#eaedff] hover:shadow-md'
                    }`}
                  >
                    {/* Top Row: Order ID, SLA timer, status badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-headline font-bold text-sm text-[#131b2e]">
                          ORDER #{order.orderId}
                        </span>
                        {order.urgency === 'urgent-2h' && (
                          <span className="bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">bolt</span>
                            URGENT • 2H SLA
                          </span>
                        )}
                        {order.urgency === 'curbside-ready' && (
                          <span className="bg-[#cce5ff] text-[#00476e] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            CURBSIDE LOCKER
                          </span>
                        )}
                        {order.urgency === 'new-received' && (
                          <span className="bg-[#6ffbbe]/30 text-[#002113] text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                            JUST RECEIVED
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#6d7a77] font-data-mono">
                          Elapsed: <strong>{order.elapsedTime}</strong> / {order.slaTarget}
                        </span>
                        {isSealed && (
                          <span className="bg-[#6ffbbe] text-[#002113] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            SEALED & STAGED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Patient & Courier Details */}
                    <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs text-[#3d4947]">
                      <div>
                        Patient:{' '}
                        <strong className="text-[#131b2e]">{order.patientName}</strong> (
                        {order.patientDemographics})
                      </div>
                      {order.courierName && (
                        <div className="flex items-center gap-1 text-[#00685f] font-medium">
                          <span className="material-symbols-outlined text-[14px]">directions_car</span>
                          <span>{order.courierStatus}</span>
                        </div>
                      )}
                      {order.customerPin && (
                        <div className="font-data-mono font-bold text-[#006398]">
                          Pickup PIN: {order.customerPin}
                        </div>
                      )}
                    </div>

                    {/* Prescribed Items Table */}
                    <div className="mt-3 bg-[#f2f3ff] rounded-lg p-2.5 flex flex-col gap-2 border border-[#eaedff]">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs pb-1.5 border-b border-gray-200 last:border-none last:pb-0"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                item.scanned || isSealed ? 'bg-[#006947]' : 'bg-[#ba1a1a]'
                              }`}
                            ></span>
                            <div className="flex flex-col">
                              <span className="font-bold text-[#131b2e]">{item.sku}</span>
                              <span className="text-[10px] text-[#6d7a77] font-data-mono">
                                NDC: {item.ndc} • Lot: {item.lot} • Exp: {item.exp}
                              </span>
                            </div>
                          </div>

                          <div className="text-right flex flex-col items-end">
                            <span className="font-bold text-[#00685f]">{item.quantityText}</span>
                            <span className="text-[10px] text-[#6d7a77] bg-white px-1.5 py-0.2 rounded border border-gray-200">
                              Bin: {item.binLocation}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Prescriber & Payout Row */}
                    <div className="mt-3 flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-[#6d7a77]">
                        <span className="material-symbols-outlined text-[15px] text-[#00685f]">
                          clinical_notes
                        </span>
                        <span>
                          {order.prescriber.name} ({order.prescriber.specialty})
                        </span>
                      </div>
                      <div className="font-bold text-[#006947]">
                        Store Net Payout: ${order.financials.netPayout.toFixed(2)}
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="mt-3 flex items-center gap-2">
                      {order.status === 'Just Received' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcceptOrder(order.orderId);
                          }}
                          className="px-3 py-1.5 bg-[#00685f] hover:bg-[#008378] text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">check</span>
                          <span>Accept & Claim Order (102s)</span>
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              showToast(`Scanning item barcode for #${order.orderId}...`);
                            }}
                            className="px-2.5 py-1.5 bg-[#eaedff] text-[#00685f] hover:bg-[#e2e7ff] rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[15px]">barcode_scanner</span>
                            <span>Scan NDC Barcode</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrintLabels(order.orderId);
                            }}
                            className="px-2.5 py-1.5 bg-white text-[#3d4947] hover:bg-gray-100 rounded-lg text-xs font-semibold border border-gray-200 flex items-center gap-1 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[15px]">print</span>
                            <span>Print Rx Labels</span>
                          </button>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Right Column: Dispense Verification Terminal (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Inspection Card */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00685f] text-[22px]">
                      fact_check
                    </span>
                    <div>
                      <h3 className="font-headline font-bold text-sm text-[#131b2e]">
                        Inspection #{selectedOrder.orderId}
                      </h3>
                      <span className="text-[10px] text-[#6d7a77]">
                        E-Rx ID: TX-9021-NYC • SHA-256 Validated
                      </span>
                    </div>
                  </div>
                  <span className="bg-[#6ffbbe]/30 text-[#002113] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {isOrderSealed ? 'SEALED & READY' : 'ACTIVE INSPECTION'}
                  </span>
                </div>

                {/* Handheld Hardware Scanner Input */}
                <div className="bg-[#f2f3ff] rounded-lg p-2.5 flex flex-col gap-1 border border-[#eaedff]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#131b2e] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-[#00685f]">usb</span>
                      Handheld Hardware Scanner Input
                    </span>
                    <span className="text-[10px] text-[#006947] font-bold">ONLINE</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      readOnly
                      value="00093715598"
                      className="bg-white rounded px-2 py-1 text-xs font-data-mono font-bold text-[#131b2e] border border-gray-300 flex-1"
                    />
                    <button
                      onClick={() => showToast('NDC Match Confirmed! (Atorvastatin 20mg Tab - Teva)')}
                      className="px-2 py-1 bg-[#00685f] text-white text-xs font-bold rounded"
                    >
                      Verify
                    </button>
                  </div>
                  <span className="text-[10px] text-[#006947] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                    NDC MATCH CONFIRMED (Atorvastatin 20mg Tab - Teva)
                  </span>
                </div>

                {/* Clinical Safety Verification Checklist */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-[#131b2e]">
                    Clinical Safety Verification Checklist:
                  </span>

                  <label className="flex items-start gap-2 text-xs text-[#3d4947] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkNdC}
                      onChange={(e) => setCheckNdc(e.target.checked)}
                      className="mt-0.5 accent-[#00685f]"
                    />
                    <span>
                      NDC & Chemical Salt Equivalence verified against Orange Book AB rating
                    </span>
                  </label>

                  <label className="flex items-start gap-2 text-xs text-[#3d4947] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkCount}
                      onChange={(e) => setCheckCount(e.target.checked)}
                      className="mt-0.5 accent-[#00685f]"
                    />
                    <span>
                      Physical bottle pill count, lot code, and expiry verified (&gt;6 mo validity)
                    </span>
                  </label>

                  <label className="flex items-start gap-2 text-xs text-[#3d4947] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkSafetyCap}
                      onChange={(e) => setCheckSafetyCap(e.target.checked)}
                      className="mt-0.5 accent-[#00685f]"
                    />
                    <span>Child-resistant safety cap & auxiliary warning labels affixed</span>
                  </label>

                  <label className="flex items-start gap-2 text-xs text-[#131b2e] font-semibold cursor-pointer bg-[#f2f3ff] p-2 rounded-lg border border-[#eaedff]">
                    <input
                      type="checkbox"
                      checked={checkSeal}
                      onChange={(e) => setCheckSeal(e.target.checked)}
                      className="mt-0.5 accent-[#00685f]"
                    />
                    <span className="text-[#00685f]">
                      Affix Lead Pharmacist Physical Tamper-Evident Seal #SEAL-9942
                    </span>
                  </label>
                </div>

                {/* Assigned Courier Card */}
                <div className="bg-[#eaedff]/60 rounded-lg p-2.5 flex items-center justify-between text-xs border border-[#dae2fd]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#00685f] text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">delivery_dining</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-[#131b2e]">Courier: Driver Marcus B.</span>
                      <span className="text-[10px] text-[#6d7a77]">Van #NY-442 • Arriving in 18 mins</span>
                    </div>
                  </div>
                  <span className="bg-[#006947] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    EN ROUTE
                  </span>
                </div>

                {/* Authorize Dispense Button */}
                <button
                  disabled={isOrderSealed}
                  onClick={handleAuthorizeSeal}
                  className={`w-full py-2.5 rounded-xl font-headline font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${
                    isOrderSealed
                      ? 'bg-[#6ffbbe] text-[#002113]'
                      : 'bg-[#00685f] hover:bg-[#008378] text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isOrderSealed ? 'verified' : 'lock_clock'}
                  </span>
                  <span>
                    {isOrderSealed
                      ? 'Order Sealed & Staged for Marcus B.'
                      : 'Authorize Dispense & Seal Package'}
                  </span>
                </button>
              </div>

              {/* Quick Inventory Alert Widget */}
              <div className="bg-white rounded-xl p-3.5 shadow-sm border border-[#eaedff] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#131b2e] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[#00685f] text-[17px]">
                      inventory
                    </span>
                    <span>Quick Shelf Stock Status</span>
                  </span>
                  <span className="text-[10px] text-[#00685f] font-semibold">CarePoint Bay 4</span>
                </div>

                <div className="flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <div>
                      <div className="font-semibold text-gray-800">Atorvastatin 20mg (30s)</div>
                      <div className="text-[10px] text-gray-500">Bin A-14 • Shelf 2</div>
                    </div>
                    <span className="text-xs font-bold text-[#006947]">45 packs (Normal)</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <div>
                      <div className="font-semibold text-gray-800">Metformin ER 500mg (60s)</div>
                      <div className="text-[10px] text-gray-500">Bin D-08 • Shelf 1</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#ba1a1a]">8 packs (LOW)</span>
                      <button
                        onClick={() => showToast('Replenishment order sent to McKesson Distribution!')}
                        className="px-2 py-0.5 bg-[#eaedff] text-[#00685f] rounded text-[10px] font-bold"
                      >
                        Replenish
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <div>
                      <div className="font-semibold text-gray-800">Amoxicillin 500mg (21s)</div>
                      <div className="text-[10px] text-gray-500">Bin B-02 • Shelf 3</div>
                    </div>
                    <span className="text-xs font-bold text-[#006947]">14 packs (Normal)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating System Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#131b2e] text-white px-4 py-2.5 rounded-xl shadow-2xl z-50 flex items-center gap-2 text-xs font-medium border border-gray-700 animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-[#6ffbbe] text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
