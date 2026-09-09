import React, { useState, useEffect } from 'react';
import { PHARMACY_OFFERS } from '../data/mockData';
import { PharmacyOffer } from '../types';
import { api } from '../services/api';

interface DrugEquivalencyProps {
  onBack: () => void;
  onProceedToCart: (selectedOffer: PharmacyOffer) => void;
}

export const DrugEquivalency: React.FC<DrugEquivalencyProps> = ({
  onBack,
  onProceedToCart,
}) => {
  const [selectedDosage, setSelectedDosage] = useState<'10mg' | '20mg' | '40mg'>('20mg');
  const [inStockOnly, setInStockOnly] = useState<boolean>(true);
  const [activeSort, setActiveSort] = useState<'lowest' | 'fastest' | 'rating' | 'distance'>('lowest');
  const [selectedOfferId, setSelectedOfferId] = useState<string>('offer-carepoint');
  const [offersList, setOffersList] = useState<PharmacyOffer[]>(PHARMACY_OFFERS);
  const [aiAnalysis, setAiAnalysis] = useState<{
    clinicalSummary: string;
    hasWarnings: boolean;
    interactions: string[];
    sourceCitations: string[];
    disclaimer: string;
  } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Dosage multipliers
  const dosageConfig = {
    '10mg': { label: '10mg • 30d', benchmark: 145.00, priceMultiplier: 0.85, savingsPercent: 92.5 },
    '20mg': { label: '20mg • 30d', benchmark: 180.00, priceMultiplier: 1.0, savingsPercent: 92.8 },
    '40mg': { label: '40mg • 90d', benchmark: 390.00, priceMultiplier: 2.3, savingsPercent: 93.1 },
  };

  const currentDosage = dosageConfig[selectedDosage];

  useEffect(() => {
    let isMounted = true;
    api.getOffers('atorvastatin-calcium')
      .then((data) => {
        if (isMounted && data.length > 0) {
          setOffersList(data);
          setSelectedOfferId(data[0].id);
        }
      })
      .catch(() => {});

    // Run clinical AI analysis for Atorvastatin
    setIsAiLoading(true);
    api.checkDrugInteractions('Atorvastatin Calcium 20mg', 'Standard adult lipid profile')
      .then((res) => {
        if (isMounted && res) {
          setAiAnalysis(res);
          setIsAiLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsAiLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter & sort offers
  let offers = [...offersList];
  if (inStockOnly) {
    offers = offers.filter((o) => o.inStock);
  }

  offers.sort((a, b) => {
    if (activeSort === 'lowest') return a.price - b.price;
    if (activeSort === 'fastest') return a.slaMinutes - b.slaMinutes;
    if (activeSort === 'rating') return b.rating - a.rating;
    if (activeSort === 'distance') return a.distanceMiles - b.distanceMiles;
    return 0;
  });

  const activeOffer = offersList.find((o) => o.id === selectedOfferId) || offersList[0] || PHARMACY_OFFERS[0];
  const dynamicPrice = (activeOffer.price * currentDosage.priceMultiplier).toFixed(2);
  const dynamicSavings = (currentDosage.benchmark - parseFloat(dynamicPrice)).toFixed(2);

  return (
    <div className="max-w-md mx-auto bg-[#faf8ff] text-[#131b2e] min-h-screen relative pb-28 shadow-xl border-x border-[#dae2fd]/40">
      {/* Header */}
      <header className="sticky top-0 w-full z-40 bg-[#faf8ff]/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-2 border-b border-[#eaedff]">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              aria-label="Back"
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-[#131b2e] hover:text-[#00685f] hover:bg-[#eaedff] transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <img
              alt="Brand logo"
              className="h-7 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1Xht0pF8V2B_vjk9_8Hb6xjXY1shUPQcQIqAIlBz81QsYhhv3nbYsJYXqezPKLQNHAHYWVLY0b6wfuKOYuA_lpYrBGzt9F-ZuVtXT6FFUmf-pGKC_LFp6xckm2VNQIZegqH7ipbPy-dM2QunSYxIMtNDLLdVj-ncMvNmNwgEoB-pXEMZqpYv6MTo00LFSmkU6LW7SjTfVBDODm-bUx3DP3CVdOsAW9aIhbUOdhFf5CtWehTsdKk0Pn6-Q"
            />
            <h1 className="font-headline font-bold text-[15px] text-[#131b2e] truncate">
              Drug Equivalency Details
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <button
              aria-label="Share"
              className="w-10 h-10 flex items-center justify-center rounded-xl text-[#3d4947] hover:text-[#00685f] hover:bg-[#eaedff] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-[#00685f] flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-white text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="px-4 py-4 flex flex-col gap-4">
        {/* Drug Bioequivalence Hero Card */}
        <section className="bg-white shadow-sm rounded-xl p-4 flex flex-col gap-3 border border-[#eaedff]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col">
              <div className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full bg-[#89f5e7] text-[#00201d] font-badge-micro text-[10px] uppercase tracking-wider mb-1 font-bold">
                <span className="material-symbols-outlined text-[13px]">verified</span>
                <span>AB RATED EQUIVALENT</span>
              </div>
              <h2 className="font-headline font-bold text-[19px] text-[#131b2e] leading-tight">
                Atorvastatin Calcium
              </h2>
              <p className="font-body-sm text-[12px] text-[#3d4947]">
                Film-Coated Tablet • Generic for Lipitor®
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#eaedff] flex items-center justify-center shrink-0 border border-gray-100">
              <span className="material-symbols-outlined text-[#00685f] text-[26px]">medication</span>
            </div>
          </div>

          {/* FDA Equivalency Callout Pill */}
          <div className="bg-[#f2f3ff] rounded-lg p-2.5 flex items-center gap-2 border border-[#eaedff]">
            <span className="material-symbols-outlined text-[#00685f] text-[18px] shrink-0">policy</span>
            <p className="font-body-sm text-[12px] text-[#131b2e]">
              <span className="font-semibold text-[#00685f]">FDA Orange Book:</span>{' '}
              Therapeutically & chemically identical active ingredient.
            </p>
          </div>

          {/* Benchmark Price Barometer */}
          <div className="bg-[#eaedff]/60 rounded-xl p-3 flex flex-col gap-1 border border-[#dae2fd]/60">
            <div className="flex items-center justify-between text-[#3d4947] font-body-sm text-[12px]">
              <span>Lipitor® Retail Benchmark</span>
              <span className="line-through font-data-mono text-[#ba1a1a]">
                ${currentDosage.benchmark.toFixed(2)}
              </span>
            </div>
            <div className="flex items-baseline justify-between pt-0.5">
              <div className="flex items-baseline gap-1.5">
                <span className="font-label-sm text-[11px] text-[#3d4947]">Network Low:</span>
                <span className="font-display-lg text-[22px] text-[#00685f] font-bold">
                  ${dynamicPrice}
                </span>
              </div>
              <span className="bg-[#006947] text-white px-2 py-0.5 rounded-full font-label-sm text-[11px] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">trending_down</span>
                <span>-{currentDosage.savingsPercent}% Savings</span>
              </span>
            </div>
          </div>

          {/* Dosage & Quantity Selector */}
          <div className="flex flex-col gap-1.5 pt-1">
            <label className="font-label-sm text-[11px] text-[#3d4947] font-semibold">
              Dosage & Supply Configuration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['10mg', '20mg', '40mg'] as const).map((dose) => {
                const isSelected = selectedDosage === dose;
                return (
                  <button
                    key={dose}
                    type="button"
                    onClick={() => setSelectedDosage(dose)}
                    className={`py-1.5 px-2 rounded-lg text-center font-label-md text-[11px] font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#00685f] text-white shadow-sm'
                        : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#e2e7ff]'
                    }`}
                  >
                    {dosageConfig[dose].label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gemini AI Clinical Interaction Card */}
          <div className="mt-1 bg-[#f2fbf9] border border-[#89f5e7] rounded-xl p-3 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#00685f] text-[18px]">neurology</span>
                <span className="font-bold text-[12px] text-[#004f47]">Gemini AI Drug Safety Check</span>
              </div>
              <span className="font-badge-micro text-[9px] bg-[#00685f]/15 text-[#00685f] font-bold px-1.5 py-0.5 rounded">
                FDA ORANGE BOOK
              </span>
            </div>
            {isAiLoading ? (
              <p className="font-body-sm text-[11px] text-[#004f47] animate-pulse">
                Running clinical interaction & bioequivalence analysis...
              </p>
            ) : aiAnalysis ? (
              <div className="flex flex-col gap-1 text-[11px] text-[#004f47] leading-relaxed">
                <p>{aiAnalysis.clinicalSummary}</p>
                {aiAnalysis.interactions.length > 0 && (
                  <div className="mt-1 pt-1 border-t border-[#89f5e7]/60 flex items-start gap-1">
                    <span className="material-symbols-outlined text-[#00855b] text-[14px] shrink-0 mt-0.5">check_circle</span>
                    <span>{aiAnalysis.interactions[0]}</span>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </section>

        {/* Filter & Sorting Strip */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-0.5">
            <span className="font-label-md text-[12px] text-[#3d4947] font-semibold">
              {offers.length} Verified Pharmacies Found
            </span>
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#00685f] accent-[#00685f] cursor-pointer"
              />
              <span className="font-label-sm text-[11px] text-[#131b2e] font-medium">In-Stock Only</span>
            </label>
          </div>

          {/* Pill Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setActiveSort('lowest')}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full font-label-md text-[11px] font-semibold flex items-center gap-1 transition-all ${
                activeSort === 'lowest'
                  ? 'bg-[#006398] text-white shadow-sm'
                  : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#e2e7ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">payments</span>
              <span>Lowest Price</span>
            </button>
            <button
              onClick={() => setActiveSort('fastest')}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full font-label-md text-[11px] font-semibold flex items-center gap-1 transition-all ${
                activeSort === 'fastest'
                  ? 'bg-[#006398] text-white shadow-sm'
                  : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#e2e7ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">bolt</span>
              <span>Fastest SLA</span>
            </button>
            <button
              onClick={() => setActiveSort('rating')}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full font-label-md text-[11px] font-semibold flex items-center gap-1 transition-all ${
                activeSort === 'rating'
                  ? 'bg-[#006398] text-white shadow-sm'
                  : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#e2e7ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">star</span>
              <span>Top Rated</span>
            </button>
            <button
              onClick={() => setActiveSort('distance')}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full font-label-md text-[11px] font-semibold flex items-center gap-1 transition-all ${
                activeSort === 'distance'
                  ? 'bg-[#006398] text-white shadow-sm'
                  : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#e2e7ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">near_me</span>
              <span>Distance</span>
            </button>
          </div>
        </section>

        {/* Pharmacy Offers List */}
        <div className="flex flex-col gap-3">
          {offers.map((offer) => {
            const isSelected = selectedOfferId === offer.id;
            const offerPrice = (offer.price * currentDosage.priceMultiplier).toFixed(2);
            const offerSavings = (currentDosage.benchmark - parseFloat(offerPrice)).toFixed(2);

            if (offer.isOutOfStock) {
              return (
                <article
                  key={offer.id}
                  className="bg-[#f2f3ff] rounded-xl p-3.5 opacity-60 flex flex-col gap-2 border border-gray-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-headline font-bold text-[14px] text-[#6d7a77]">
                        {offer.pharmacyName}
                      </h3>
                      <p className="font-body-sm text-[11px] text-[#6d7a77]">{offer.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-headline font-bold text-[16px] text-[#6d7a77] line-through">
                        ${offerPrice}
                      </div>
                      <span className="font-badge-micro text-[9px] text-[#ba1a1a] uppercase font-bold">
                        Restocking
                      </span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-2 flex items-center gap-1.5 text-[#ba1a1a] font-body-sm text-[11px]">
                    <span className="material-symbols-outlined text-[16px]">block</span>
                    <span>Temporarily Out of Stock — Expected replenishment in 24h</span>
                  </div>
                </article>
              );
            }

            return (
              <article
                key={offer.id}
                onClick={() => setSelectedOfferId(offer.id)}
                className={`relative bg-white rounded-xl p-3.5 transition-all cursor-pointer border ${
                  isSelected
                    ? 'ring-2 ring-[#00685f] shadow-md border-transparent'
                    : 'shadow-sm border-[#eaedff] hover:shadow-md'
                }`}
              >
                {/* Badge if present */}
                {offer.tagBadge && (
                  <div
                    className={`absolute -top-2.5 right-3 text-white px-2.5 py-0.5 rounded-full font-badge-micro text-[9px] shadow-sm flex items-center gap-1 font-bold ${
                      offer.badgeType === 'best-match' ? 'bg-[#00685f]' : 'bg-[#006398]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[11px]">
                      {offer.badgeType === 'best-match' ? 'award_star' : 'bolt'}
                    </span>
                    <span>{offer.tagBadge}</span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3 mt-1">
                  <div>
                    <h3 className="font-headline font-bold text-[14px] text-[#131b2e]">
                      {offer.pharmacyName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[#6d7a77] font-body-sm text-[11px] mt-0.5">
                      <span className="flex items-center text-[#006947] font-bold">
                        <span
                          className="material-symbols-outlined text-[14px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span className="ml-0.5">{offer.rating}</span>
                      </span>
                      <span>•</span>
                      <span>{offer.auditCount} audits</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px]">navigation</span>
                        {offer.distanceMiles} mi
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-headline font-bold text-[19px] text-[#00685f]">
                      ${offerPrice}
                    </div>
                    <div className="font-badge-micro text-[10px] text-[#006947] font-bold">
                      {offer.platformFee}
                    </div>
                  </div>
                </div>

                {/* Delivery details row */}
                <div className="mt-2.5 bg-[#f2f3ff] rounded-lg p-2 flex flex-col gap-1 border border-[#eaedff]">
                  <div className="flex items-center justify-between text-[#131b2e] font-body-sm text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#00685f] text-[16px]">
                        local_shipping
                      </span>
                      <span>
                        Express Courier: <strong>{offer.deliveryEstimate}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between font-label-sm text-[10px] text-[#6d7a77]">
                    <span className="text-[#006947] flex items-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006947] animate-pulse"></span>
                      In Stock ({offer.stockCountVerified} units verified)
                    </span>
                    <span className="text-[#3d4947] font-medium">Saves ${offerSavings} vs Brand</span>
                  </div>
                </div>

                {/* Card CTA & Selection feedback */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-label-sm text-[11px] text-[#00685f] flex items-center gap-1 font-semibold">
                    {isSelected ? (
                      <>
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        <span>Active Selection</span>
                      </>
                    ) : (
                      <span className="text-gray-400">Click card to select</span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOfferId(offer.id);
                    }}
                    className={`px-3 py-1 rounded-lg font-label-md text-[11px] font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#00685f] text-white shadow-sm'
                        : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#e2e7ff]'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Select Offer'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Clinical Verification Guarantee */}
        <section className="bg-[#f2f3ff] rounded-xl p-3 flex items-start gap-2.5 text-[#3d4947] border border-[#eaedff]">
          <span className="material-symbols-outlined text-[#00685f] text-[20px] shrink-0 mt-0.5">
            verified_user
          </span>
          <div className="flex flex-col gap-0.5">
            <h4 className="font-label-md text-[11px] text-[#131b2e] font-bold">
              genericMed Real-Time API Guarantee
            </h4>
            <p className="font-body-sm text-[11px] leading-relaxed text-[#3d4947]">
              Pharmacy prices and formulation ratings are locked directly via NDC Telemetry API. Zero surprise co-pays or counter surcharges at pickup or delivery.
            </p>
          </div>
        </section>
      </main>

      {/* Floating Sticky Mobile Interaction Bar */}
      <aside className="fixed bottom-0 max-w-md w-full z-40 bg-white/95 backdrop-blur-md shadow-[0_-4px_16px_rgba(0,0,0,0.08)] px-4 py-2.5 border-t border-[#eaedff]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1 text-[#6d7a77] font-label-sm text-[10px] truncate">
              <span className="material-symbols-outlined text-[13px] text-[#006947]">check_circle</span>
              <span className="truncate font-semibold text-[#131b2e]">
                {activeOffer.pharmacyName}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-headline font-bold text-[19px] text-[#00685f]">
                ${dynamicPrice}
              </span>
              <span className="font-badge-micro text-[9px] bg-[#6ffbbe] text-[#002113] font-bold px-1.5 py-0.5 rounded">
                Save ${dynamicSavings}
              </span>
            </div>
          </div>
          <button
            onClick={() => onProceedToCart(activeOffer)}
            className="shrink-0 px-5 py-2.5 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl font-label-md text-[12px] font-semibold shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
            type="button"
          >
            <span>Proceed</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
