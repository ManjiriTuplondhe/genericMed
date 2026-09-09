import React, { useState, useEffect } from 'react';
import { MEDICINES_DATA } from '../data/mockData';
import { Medicine, UserProfile } from '../types';
import { api } from '../services/api';

interface CustomerHomeProps {
  onNavigateToDetail: (medicineId: string) => void;
  onNavigateToCart: () => void;
  onAddToCart: (medicine: Medicine) => void;
  cartCount: number;
  currentUser?: UserProfile | null;
  onOpenAuth?: () => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  onNavigateToDetail,
  onNavigateToCart,
  onAddToCart,
  cartCount,
  currentUser,
  onOpenAuth,
}) => {
  const [medicines, setMedicines] = useState<Medicine[]>(MEDICINES_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Generic Pairs');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isAiSearching, setIsAiSearching] = useState<boolean>(false);
  const [aiSearchSummary, setAiSearchSummary] = useState<string | null>(null);

  const categories = [
    { name: 'All Generic Pairs', icon: 'all_inclusive', color: 'text-primary' },
    { name: 'Cholesterol', icon: 'monitor_heart', color: 'text-[#006947]' },
    { name: 'Diabetes', icon: 'bloodtype', color: 'text-[#00685f]' },
    { name: 'Blood Pressure', icon: 'ecg_heart', color: 'text-[#006398]' },
    { name: 'Antibiotics', icon: 'vaccines', color: 'text-[#3d4947]' },
    { name: 'Pain Relief', icon: 'healing', color: 'text-[#00855b]' },
  ];

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    api.getMedicines(searchQuery, selectedCategory)
      .then((data) => {
        if (isMounted) {
          setMedicines(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [selectedCategory, searchQuery]);

  const handleAiSmartSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsAiSearching(true);
    setAiSearchSummary(null);
    try {
      const res = await api.searchWithAi(searchQuery);
      if (res && res.medicines) {
        setMedicines(res.medicines);
        setAiSearchSummary(res.summary);
      }
    } catch {
      // Fallback
    } finally {
      setIsAiSearching(false);
    }
  };

  const filteredMedicines = medicines.filter((med) => {
    const matchesCategory =
      selectedCategory === 'All Generic Pairs' || med.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesQuery =
      !searchQuery.trim() ||
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleSimulatePrescriptionScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult('Matched 2 Validated Generics: Atorvastatin 20mg (Save 92%) & Metformin 500mg (Save 83%)');
    }, 1200);
  };

  return (
    <div className="max-w-md mx-auto bg-[#faf8ff] text-[#131b2e] min-h-screen relative pb-28 shadow-xl border-x border-[#dae2fd]/40">
      {/* 1. App Header */}
      <header className="sticky top-0 w-full z-40 bg-[#faf8ff]/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-2 border-b border-[#eaedff]">
        <div className="px-4 py-2 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                alt="genericMed Logo"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1Xht0pF8V2B_vjk9_8Hb6xjXY1shUPQcQIqAIlBz81QsYhhv3nbYsJYXqezPKLQNHAHYWVLY0b6wfuKOYuA_lpYrBGzt9F-ZuVtXT6FFUmf-pGKC_LFp6xckm2VNQIZegqH7ipbPy-dM2QunSYxIMtNDLLdVj-ncMvNmNwgEoB-pXEMZqpYv6MTo00LFSmkU6LW7SjTfVBDODm-bUx3DP3CVdOsAW9aIhbUOdhFf5CtWehTsdKk0Pn6-Q"
              />
              <span className="font-headline font-bold text-[17px] text-[#131b2e] tracking-tight">
                genericMed
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                aria-label="Notifications"
                className="w-10 h-10 flex items-center justify-center rounded-xl text-[#3d4947] hover:text-[#00685f] hover:bg-[#eaedff] transition-colors"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
              </button>
              <button
                aria-label="Cart"
                onClick={onNavigateToCart}
                className="h-10 px-2.5 flex items-center gap-1.5 rounded-xl bg-[#008378]/15 text-[#00685f] hover:bg-[#008378]/25 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                <span className="font-label-md text-[11px] bg-[#00685f] text-white px-1.5 py-0.5 rounded-full min-w-[20px] text-center font-bold">
                  {cartCount}
                </span>
              </button>
              <button
                onClick={onOpenAuth}
                title={currentUser ? `Signed in as ${currentUser.name} (${currentUser.roleTitle})` : 'Sign in / Register'}
                className="w-8 h-8 rounded-full bg-[#00685f] flex items-center justify-center ml-1 shadow-sm overflow-hidden hover:ring-2 hover:ring-[#00685f]/50 transition-all cursor-pointer"
              >
                {currentUser?.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-white text-[18px]">person</span>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-0.5 pb-1">
            <button className="flex items-center gap-1 text-[#3d4947] hover:text-[#131b2e] transition-colors text-left">
              <span className="material-symbols-outlined text-[#00685f] text-[16px]">location_on</span>
              <span className="font-body-sm text-[12px] text-[#131b2e] truncate max-w-[210px]">
                Deliver to: <span className="font-semibold text-[#00685f]">Brooklyn, NY 11201</span>
              </span>
              <span className="material-symbols-outlined text-[16px] text-gray-500">expand_more</span>
            </button>
            <div className="font-label-sm text-[11px] text-[#3d4947] font-semibold tracking-tight">
              Search & Compare
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-4 pt-3 flex flex-col gap-4">
        {/* 1. Fast Dispatch & Speed Bar */}
        <section className="w-full bg-[#f2f3ff] rounded-xl p-2.5 shadow-sm flex items-center justify-between gap-2 border border-[#eaedff]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#00685f]/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#00685f] text-[18px]">near_me</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-label-sm text-[10px] text-[#00685f] uppercase tracking-wider font-bold">
                  Fast Dispatch
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#006947]"></span>
                <span className="font-label-sm text-[11px] text-[#006947] font-bold">ETA ~35 mins</span>
              </div>
              <span className="font-headline font-semibold text-[13px] text-[#131b2e] truncate">
                Home • 142 Hicks St, Brooklyn, NY
              </span>
            </div>
          </div>
          <button
            aria-label="Change address"
            className="shrink-0 px-2.5 py-1 bg-[#eaedff] rounded-lg text-[#00685f] font-label-sm text-[11px] font-bold hover:bg-[#e2e7ff] transition-colors flex items-center gap-1"
          >
            <span>Change</span>
            <span className="material-symbols-outlined text-[13px]">tune</span>
          </button>
        </section>

        {/* 2. Search & Optical Scanner Input */}
        <section className="w-full flex flex-col gap-2">
          <div className="relative w-full shadow-sm rounded-xl bg-white flex items-center px-3 py-1.5 border border-[#eaedff] focus-within:ring-2 focus-within:ring-[#00685f]/30">
            <span className="material-symbols-outlined text-[#6d7a77] text-[20px] mr-2 shrink-0">
              search
            </span>
            <input
              className="w-full bg-transparent border-none text-[#131b2e] font-body-md text-[13px] placeholder:text-[#6d7a77]/70 focus:outline-none py-1"
              id="drug-search-input"
              placeholder="Search salt, brand, or condition (e.g. Lipitor)..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-gray-600 mr-1"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
            <div className="flex items-center gap-1.5 shrink-0 pl-1">
              <button
                aria-label="Gemini AI Smart Search"
                onClick={handleAiSmartSearch}
                disabled={isAiSearching || !searchQuery.trim()}
                className={`h-8 px-2.5 rounded-lg flex items-center gap-1 text-[11px] font-bold transition-colors ${
                  isAiSearching
                    ? 'bg-[#eaedff] text-gray-400 animate-pulse'
                    : 'bg-[#6ffbbe]/30 text-[#00685f] hover:bg-[#6ffbbe]/50'
                }`}
                title="Search with Gemini AI clinical reasoning"
              >
                <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                <span>{isAiSearching ? 'Thinking...' : 'AI'}</span>
              </button>
              <button
                aria-label="Scan medicine barcode"
                onClick={() => {
                  setSearchQuery('Atorvastatin');
                }}
                className="w-8 h-8 rounded-lg bg-[#eaedff] hover:bg-[#e2e7ff] text-[#00685f] flex items-center justify-center transition-colors"
                title="Scan Barcode or Pill bottle"
              >
                <span className="material-symbols-outlined text-[18px]">barcode_scanner</span>
              </button>
              <button
                aria-label="Camera search"
                onClick={() => setIsPrescriptionModalOpen(true)}
                className="w-8 h-8 rounded-lg bg-[#00685f] text-white flex items-center justify-center shadow-sm hover:bg-[#008378] transition-colors"
                title="Snap Rx photo"
              >
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              </button>
            </div>
          </div>

          {/* AI Clinical Search Summary Card if available */}
          {aiSearchSummary && (
            <div className="bg-[#f2fbf9] border border-[#89f5e7] p-2.5 rounded-xl flex items-start gap-2 text-[12px] text-[#004f47]">
              <span className="material-symbols-outlined text-[#00685f] text-[18px] shrink-0 mt-0.5">neurology</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-[#00685f] uppercase tracking-wider">Gemini Clinical Insight</span>
                  <button onClick={() => setAiSearchSummary(null)} className="text-gray-400 hover:text-gray-600">
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>
                <p className="mt-0.5 leading-relaxed">{aiSearchSummary}</p>
              </div>
            </div>
          )}

          {/* Condition Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scroll-smooth no-scrollbar">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`shrink-0 px-3 py-1 rounded-full font-label-sm text-[11px] font-semibold flex items-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-[#00685f] text-white shadow-sm'
                      : 'bg-[#eaedff] hover:bg-[#e2e7ff] text-[#131b2e]'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[14px] ${isSelected ? 'text-white' : cat.color}`}>
                    {cat.icon}
                  </span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Bioequivalence & Savings Educational Banner */}
        <section className="w-full bg-gradient-to-r from-[#00685f] via-[#00685f] to-[#008378] rounded-xl p-4 text-white shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-md px-2 py-0.5 rounded-full text-white font-badge-micro text-[10px] uppercase tracking-wider font-bold">
                <span className="material-symbols-outlined text-[13px] text-[#89f5e7]">verified_user</span>
                <span>FDA ORANGE BOOK AB-RATED</span>
              </div>
              <span className="font-label-sm text-[11px] bg-[#6ffbbe] text-[#002113] font-bold px-2 py-0.5 rounded-full">
                Save up to 92%
              </span>
            </div>
            <h2 className="font-headline font-bold text-[18px] text-white leading-tight mt-1">
              Same Bioactive Salt. A Fraction of Brand Name Cost.
            </h2>
            <p className="font-body-sm text-[12px] text-white/90 leading-relaxed max-w-[290px]">
              Every generic substitution is lab-verified by registered clinical pharmacists for identical purity, bioavailability, and therapeutic effect.
            </p>
            <div className="pt-1.5 flex items-center gap-4 font-label-sm text-[11px] text-[#89f5e7] font-semibold">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">check_circle</span> 100% Equivalent
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">local_pharmacy</span> Verified Stock
              </span>
            </div>
          </div>
          {/* Decorative backdrop geometry */}
          <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10 pointer-events-none"></div>
          <div className="absolute right-8 top-2 w-16 h-16 rounded-full bg-[#89f5e7]/10 pointer-events-none"></div>
        </section>

        {/* 4. Quick Prescription Match Camera CTA */}
        <section className="w-full rounded-xl bg-white p-3.5 shadow-sm border border-[#eaedff] relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0 w-16 h-16 rounded-xl bg-[#00685f]/10 flex items-center justify-center overflow-hidden">
              <img
                className="absolute inset-0 w-full h-full object-cover opacity-80"
                alt="Prescription Paper with stethoscope"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8O-oGfM3Ea6lfPdg0OzmF4Z1YDV3hX_HRii51igZ0pfCMqrVZPV-DGeMltovk6mk7Qk45penYByzzJkutUpCx0RXsxA3NKZAC2rZfZRbJHiGEsepz9-CE1UaMZ5ReDSBKnrTYse-a-9-YsAYtjr15cRNoNGRXZbEWyJz2mN9KPhxbwrhrv-XU_61zpF5F_3feavi2UMunLH2F98dqifJ1GZUHIFpPh32VYE9xYzsWjhY7aSR11gad"
              />
              <div className="absolute inset-0 bg-[#00685f]/25 backdrop-blur-[1px]"></div>
              <span className="material-symbols-outlined text-[#00685f] text-[26px] relative z-10">receipt_long</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-headline font-bold text-[14px] text-[#131b2e] truncate">
                Got a Doctor's Prescription?
              </span>
              <p className="font-body-sm text-[12px] text-[#3d4947] line-clamp-2 mt-0.5">
                Snap a photo and our OCR matches the cheapest approved generics across 4 local pharmacies instantly.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPrescriptionModalOpen(true)}
            className="mt-2.5 w-full py-2 px-3 bg-[#006398] text-white rounded-lg font-label-md text-[12px] font-semibold flex items-center justify-center gap-1.5 shadow-sm hover:opacity-95 transition-opacity"
          >
            <span className="material-symbols-outlined text-[17px]">add_a_photo</span>
            <span>Upload Prescription & Match Generics</span>
          </button>
        </section>

        {/* 5. Trending Frequently Compared Drugs List */}
        <section className="w-full flex flex-col gap-3">
          <div className="flex items-center justify-between px-0.5">
            <div>
              <h3 className="font-headline font-bold text-[17px] text-[#131b2e]">
                Frequently Compared Drugs
              </h3>
              <p className="font-body-sm text-[11px] text-[#3d4947]">
                Real-time local inventory & bio-equivalent pricing
              </p>
            </div>
            <span className="font-label-sm text-[11px] text-[#00685f] font-semibold flex items-center gap-1">
              Live Feed <span className="w-2 h-2 rounded-full bg-[#006947] inline-block animate-pulse"></span>
            </span>
          </div>

          {filteredMedicines.length === 0 ? (
            <div className="bg-white p-8 rounded-xl text-center border border-[#eaedff]">
              <span className="material-symbols-outlined text-[36px] text-gray-400">search_off</span>
              <p className="font-medium text-gray-600 mt-2">No matching medicines found.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All Generic Pairs');
                  setSearchQuery('');
                }}
                className="mt-3 px-3 py-1.5 text-xs bg-[#00685f] text-white rounded-lg font-semibold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredMedicines.map((med) => (
              <article
                key={med.id}
                className="w-full bg-white rounded-xl p-3.5 shadow-sm border border-[#eaedff] flex flex-col gap-2.5 transition-all hover:shadow-md"
              >
                {/* Product Header */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex gap-2.5 min-w-0">
                    <div className="relative w-14 h-14 rounded-lg bg-[#f2f3ff] overflow-hidden shrink-0 border border-gray-100">
                      <img
                        className="w-full h-full object-cover"
                        alt={med.name}
                        src={med.imageUrl}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-badge-micro text-[9px] uppercase bg-[#00685f]/10 text-[#00685f] px-1.5 py-0.5 rounded font-bold">
                          {med.rxType}
                        </span>
                        <span className="font-badge-micro text-[9px] text-[#006947] bg-[#f2f3ff] font-semibold px-1.5 py-0.5 rounded">
                          {med.bioequivalentRating}
                        </span>
                      </div>
                      <h4 className="font-headline font-bold text-[14px] text-[#131b2e] truncate mt-0.5">
                        {med.name}
                      </h4>
                      <p className="font-body-sm text-[11px] text-[#3d4947]">
                        {med.packageDescription}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="font-label-sm text-[11px] text-[#ba1a1a] line-through">
                      ${med.brandPrice.toFixed(2)}
                    </span>
                    <span className="font-headline font-bold text-[18px] text-[#00685f]">
                      ${med.lowestPrice.toFixed(2)}
                    </span>
                    <span className="font-badge-micro text-[9px] bg-[#6ffbbe] text-[#002113] font-bold px-1.5 py-0.5 rounded-full">
                      Save {med.savingsPercent}%
                    </span>
                  </div>
                </div>

                {/* Comparative Salt Switch Bar */}
                <div className="bg-[#f2f3ff] p-2 rounded-lg flex items-center justify-between font-label-sm text-[11px]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[#3d4947]">Generic replacement for:</span>
                    <span className="font-bold text-[#131b2e] truncate">
                      {med.brandName} ({med.brandManufacturer})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[#006947] font-bold shrink-0">
                    <span className="material-symbols-outlined text-[15px]">savings</span>
                    <span>+${med.savingsAmount.toFixed(2)} in pocket</span>
                  </div>
                </div>

                {/* Meta info & CTA button */}
                <div className="flex items-center justify-between pt-0.5">
                  <div className="flex items-center gap-2.5 text-[#3d4947] font-label-sm text-[11px]">
                    <span className="flex items-center text-[#131b2e] font-semibold">
                      <span
                        className="material-symbols-outlined text-[15px] text-[#00855b] mr-0.5"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      {med.rating}
                      <span className="text-[#6d7a77] font-normal ml-0.5">({med.reviewCount})</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-[#00685f]">storefront</span>
                      {med.pharmacyCount} Nearby Stores
                    </span>
                  </div>

                  {med.id === 'acetaminophen-care-pack' ? (
                    <button
                      onClick={() => onAddToCart(med)}
                      className="px-3 py-1.5 bg-[#00685f] hover:bg-[#008378] text-white rounded-lg font-label-md text-[12px] font-semibold flex items-center gap-1 shadow-sm transition-colors"
                    >
                      <span>Add to Cart</span>
                      <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigateToDetail(med.id)}
                      className="px-3 py-1.5 bg-[#00685f] hover:bg-[#008378] text-white rounded-lg font-label-md text-[12px] font-semibold flex items-center gap-1 shadow-sm transition-colors"
                    >
                      <span>Compare Prices</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </section>

        {/* 6. Partner Pharmacy Trust & Live Fulfillment Network */}
        <section className="w-full bg-[#f2f3ff] rounded-xl p-3.5 shadow-sm flex flex-col gap-2.5 border border-[#eaedff]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#00685f] text-[19px]">verified</span>
              <h4 className="font-headline font-bold text-[13px] text-[#131b2e]">
                4 Verified Dispensing Partners Near Brooklyn
              </h4>
            </div>
            <span className="font-badge-micro text-[9px] bg-[#eaedff] text-[#3d4947] px-1.5 py-0.5 rounded font-bold">
              HIPAA Audited
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white p-2.5 rounded-lg shadow-sm border border-[#eaedff] flex flex-col gap-0.5">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-[12px] text-[#131b2e] font-bold truncate">Apollo MedCorp</span>
                <span className="w-2 h-2 rounded-full bg-[#006947]"></span>
              </div>
              <span className="font-body-sm text-[11px] text-[#6d7a77]">0.8 mi • 25 min delivery</span>
              <span className="font-label-sm text-[10px] text-[#00685f] font-semibold mt-1">99.4% Generic In-Stock</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg shadow-sm border border-[#eaedff] flex flex-col gap-0.5">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-[12px] text-[#131b2e] font-bold truncate">CarePoint Rx</span>
                <span className="w-2 h-2 rounded-full bg-[#006947]"></span>
              </div>
              <span className="font-body-sm text-[11px] text-[#6d7a77]">1.4 mi • 35 min delivery</span>
              <span className="font-label-sm text-[10px] text-[#00685f] font-semibold mt-1">Free 24hr Dispatch</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg shadow-sm border border-[#eaedff] flex flex-col gap-0.5">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-[12px] text-[#131b2e] font-bold truncate">MedLife Express</span>
                <span className="w-2 h-2 rounded-full bg-[#006947]"></span>
              </div>
              <span className="font-body-sm text-[11px] text-[#6d7a77]">2.1 mi • 45 min delivery</span>
              <span className="font-label-sm text-[10px] text-[#00685f] font-semibold mt-1">Best Price Guarantee</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg shadow-sm border border-[#eaedff] flex flex-col gap-0.5">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-[12px] text-[#131b2e] font-bold truncate">QuickCure Care</span>
                <span className="w-2 h-2 rounded-full bg-[#006947]"></span>
              </div>
              <span className="font-body-sm text-[11px] text-[#6d7a77]">2.6 mi • Curbside Ready</span>
              <span className="font-label-sm text-[10px] text-[#00685f] font-semibold mt-1">Licensed Clinical Staff</span>
            </div>
          </div>

          {/* Trust Seal Footer Statement */}
          <div className="flex items-center justify-center gap-1.5 pt-1 text-[#3d4947] font-label-sm text-[10px] text-center">
            <span className="material-symbols-outlined text-[15px] text-[#006947]">security</span>
            <span>Every generic molecule chemically verified identical under FDA 21 CFR Part 320</span>
          </div>
        </section>
      </main>

      {/* Bottom Sticky Mobile Navigation Bar */}
      <nav className="fixed bottom-0 max-w-md w-full z-40 bg-[#faf8ff]/95 backdrop-blur-xl shadow-[0_-1px_8px_rgba(0,0,0,0.06)] border-t border-[#eaedff]">
        <div className="flex justify-around items-center h-16 px-1">
          <button className="flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-1 text-[#00685f] font-semibold">
            <span className="material-symbols-outlined text-[22px]">search_insights</span>
            <span className="font-label-sm text-[10px]">Search & Compare</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-1 text-[#6d7a77] hover:text-[#00685f] transition-colors">
            <span className="material-symbols-outlined text-[22px]">prescriptions</span>
            <span className="font-label-sm text-[10px]">Saved</span>
          </button>
          <button
            onClick={onNavigateToCart}
            className="flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-1 text-[#6d7a77] hover:text-[#00685f] transition-colors relative"
          >
            <span className="material-symbols-outlined text-[22px]">local_shipping</span>
            <span className="font-label-sm text-[10px]">Orders</span>
            {cartCount > 0 && (
              <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-[#00685f]"></span>
            )}
          </button>
          <button className="flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-1 text-[#6d7a77] hover:text-[#00685f] transition-colors">
            <span className="material-symbols-outlined text-[22px]">manage_accounts</span>
            <span className="font-label-sm text-[10px]">Profile</span>
          </button>
        </div>
      </nav>

      {/* Prescription Upload & OCR Modal */}
      {isPrescriptionModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00685f] text-[24px]">receipt_long</span>
                <h3 className="font-headline font-bold text-[16px]">Doctor's Prescription OCR</h3>
              </div>
              <button
                onClick={() => {
                  setIsPrescriptionModalOpen(false);
                  setScanResult(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center text-center bg-[#faf8ff]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8O-oGfM3Ea6lfPdg0OzmF4Z1YDV3hX_HRii51igZ0pfCMqrVZPV-DGeMltovk6mk7Qk45penYByzzJkutUpCx0RXsxA3NKZAC2rZfZRbJHiGEsepz9-CE1UaMZ5ReDSBKnrTYse-a-9-YsAYtjr15cRNoNGRXZbEWyJz2mN9KPhxbwrhrv-XU_61zpF5F_3feavi2UMunLH2F98dqifJ1GZUHIFpPh32VYE9xYzsWjhY7aSR11gad"
                alt="Rx preview"
                className="w-24 h-24 object-cover rounded-lg shadow-sm mb-2"
              />
              <span className="font-semibold text-xs text-gray-800">prescription_scan_dr_lin.jpg</span>
              <span className="text-[11px] text-gray-500">DEA Compliant • 2.4 MB</span>
            </div>

            {scanResult ? (
              <div className="p-3 bg-[#f2f3ff] rounded-lg border border-[#eaedff] text-xs text-[#00685f] flex flex-col gap-1">
                <div className="flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-[16px] text-[#006947]">check_circle</span>
                  <span>OCR Analysis Complete:</span>
                </div>
                <p className="text-gray-700">{scanResult}</p>
                <button
                  onClick={() => {
                    setIsPrescriptionModalOpen(false);
                    onNavigateToDetail('atorvastatin-calcium');
                  }}
                  className="mt-2 py-1.5 bg-[#00685f] text-white rounded-lg font-semibold text-center text-xs"
                >
                  View Atorvastatin Comparison ($12.80)
                </button>
              </div>
            ) : (
              <button
                disabled={isScanning}
                onClick={handleSimulatePrescriptionScan}
                className="w-full py-2.5 bg-[#00685f] text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-[#008378] transition-colors"
              >
                {isScanning ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                    <span>Extracting NDCs & Active Salts...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">document_scanner</span>
                    <span>Run Telemetry OCR Scan</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
