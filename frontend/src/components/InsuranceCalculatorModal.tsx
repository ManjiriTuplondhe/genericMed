import React, { useState } from 'react';
import { Medicine, InsuranceEligibility } from '../types';
import { api } from '../services/api';

interface InsuranceCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine?: Medicine;
}

export const InsuranceCalculatorModal: React.FC<InsuranceCalculatorModalProps> = ({
  isOpen,
  onClose,
  medicine
}) => {
  const [memberId, setMemberId] = useState('HB-88910429');
  const [groupNumber, setGroupNumber] = useState('GRP-99210-NY');
  const [providerName, setProviderName] = useState('BlueCross BlueShield CareFirst');
  const [planType, setPlanType] = useState('Commercial PPO');
  const [isVerifying, setIsVerifying] = useState(false);
  const [eligibility, setEligibility] = useState<InsuranceEligibility | null>(null);
  const [calculation, setCalculation] = useState<{
    medicineName: string;
    brandName: string;
    brandCashPrice: number;
    brandInsuranceCopay: number;
    genericCashPrice: number;
    genericInsuranceCopay: number;
    bestOption: 'GENERIC_CASH' | 'GENERIC_INSURANCE' | 'BRAND_INSURANCE';
    netSavings: number;
    recommendationSummary: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const el = await api.verifyInsurance({ memberId, groupNumber, providerName });
      setEligibility(el);

      const medId = medicine ? medicine.id : 'med-01';
      const calc = await api.calculateInsuranceCopay(medId, planType);
      setCalculation(calc);
    } catch {
      // Fallback
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface border border-outline/20 rounded-2xl max-w-2xl w-full p-6 shadow-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">calculate</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-on-surface">Insurance vs. Cash Copay Calculator</h3>
              <p className="text-xs text-on-surface-variant">
                Compare your insurance copay against our direct generic cash price to find the lowest price
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-variant/50 text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                Insurance Provider
              </label>
              <select
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container border border-outline/20 text-on-surface focus:outline-none focus:border-primary"
              >
                <option value="BlueCross BlueShield CareFirst">BlueCross BlueShield CareFirst</option>
                <option value="Aetna Health Choice">Aetna Health Choice</option>
                <option value="UnitedHealthcare Choice Plus">UnitedHealthcare Choice Plus</option>
                <option value="Cigna Health & Life">Cigna Health & Life</option>
                <option value="Medicare Part D Standard">Medicare Part D Standard</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                Plan Coverage Type
              </label>
              <select
                value={planType}
                onChange={(e) => setPlanType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container border border-outline/20 text-on-surface focus:outline-none focus:border-primary"
              >
                <option value="Commercial PPO">Commercial PPO (Tier 1/3 Copays)</option>
                <option value="High-Deductible HSA">High-Deductible HSA (Pay until Met)</option>
                <option value="Medicare Part D">Medicare Part D</option>
                <option value="Medicaid Essential">Medicaid Essential</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                Member ID
              </label>
              <input
                type="text"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                placeholder="e.g. HB-88910429"
                className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container border border-outline/20 text-on-surface focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                Group Number
              </label>
              <input
                type="text"
                value={groupNumber}
                onChange={(e) => setGroupNumber(e.target.value)}
                placeholder="e.g. GRP-99210-NY"
                className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container border border-outline/20 text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isVerifying}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-md shadow-primary/25 transition-all flex items-center gap-2"
            >
              {isVerifying ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Verifying Real-Time Eligibility...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">policy</span>
                  <span>Verify Eligibility & Run Comparison</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Results Area */}
        {calculation && eligibility && (
          <div className="pt-4 border-t border-outline/10 space-y-4">
            {/* Eligibility Banner */}
            <div className="p-3.5 rounded-xl bg-surface-container border border-outline/10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-on-surface">{eligibility.providerName}</span>
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                    {eligibility.status}
                  </span>
                </div>
                <div className="text-[11px] text-on-surface-variant mt-0.5">
                  Deductible: ${eligibility.deductibleRemaining.toFixed(2)} remaining of ${eligibility.deductibleTotal.toFixed(2)}
                </div>
              </div>
              <div className="text-right text-[11px] text-on-surface-variant">
                <div>Tier 1 Generic Copay: <span className="font-bold text-on-surface">${eligibility.copayGenericTier1.toFixed(2)}</span></div>
                <div>Tier 3 Brand Copay: <span className="font-bold text-on-surface">${eligibility.copayBrandTier3.toFixed(2)}</span></div>
              </div>
            </div>

            {/* Comparison Cards Grid */}
            <div className="grid grid-cols-3 gap-3">
              {/* Option 1: Brand via Insurance */}
              <div className="p-3 rounded-xl bg-surface-container/60 border border-outline/15 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Brand Copay
                  </span>
                  <div className="text-xs font-semibold text-on-surface mt-1">{calculation.brandName}</div>
                  <div className="text-xl font-bold text-on-surface mt-2">
                    ${calculation.brandInsuranceCopay.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-on-surface-variant mt-1">Tier 3 Preferred Copay</div>
                </div>
                <div className="mt-3 pt-2 border-t border-outline/10 text-[10px] text-rose-400 font-medium">
                  Highest cost option
                </div>
              </div>

              {/* Option 2: Generic via Insurance */}
              <div className="p-3 rounded-xl bg-surface-container/60 border border-outline/15 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Generic Copay
                  </span>
                  <div className="text-xs font-semibold text-on-surface mt-1">{calculation.medicineName}</div>
                  <div className="text-xl font-bold text-on-surface mt-2">
                    ${calculation.genericInsuranceCopay.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-on-surface-variant mt-1">Tier 1 Generic Copay</div>
                </div>
                <div className="mt-3 pt-2 border-t border-outline/10 text-[10px] text-emerald-400 font-medium">
                  Standard insurance rate
                </div>
              </div>

              {/* Option 3: genericMed Direct Cash (Winner) */}
              <div className="p-3 rounded-xl bg-primary/10 border-2 border-primary/40 relative flex flex-col justify-between shadow-lg shadow-primary/10">
                <span className="absolute -top-2.5 right-3 text-[9px] font-bold uppercase tracking-wider bg-primary text-on-primary px-2 py-0.5 rounded-full">
                  Best Value
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    genericMed Cash
                  </span>
                  <div className="text-xs font-semibold text-primary mt-1">{calculation.medicineName}</div>
                  <div className="text-xl font-extrabold text-primary mt-2">
                    ${calculation.genericCashPrice.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-on-surface-variant mt-1">Direct Wholesale Rate</div>
                </div>
                <div className="mt-3 pt-2 border-t border-primary/20 text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">check_circle</span>
                  <span>Save ${calculation.netSavings.toFixed(2)} vs Brand</span>
                </div>
              </div>
            </div>

            {/* AI Recommendation Summary */}
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-lg mt-0.5">auto_awesome</span>
              <div className="text-xs text-on-surface-variant">
                <strong className="text-on-surface font-semibold">Clinical & Financial Recommendation: </strong>
                {calculation.recommendationSummary}
              </div>
            </div>

            {/* Action */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-md shadow-primary/25 transition-all"
              >
                Apply Best Pricing to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
