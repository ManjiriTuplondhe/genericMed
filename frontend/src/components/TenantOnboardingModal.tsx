import React, { useState } from 'react';
import { api } from '../services/api';
import { TenantOnboardingPayload, TenantOrg } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTenantOnboarded?: (tenant: TenantOrg) => void;
}

export const TenantOnboardingModal: React.FC<Props> = ({ isOpen, onClose, onTenantOnboarded }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [submitting, setSubmitting] = useState(false);
  const [npiValidating, setNpiValidating] = useState(false);
  const [npiVerifiedName, setNpiVerifiedName] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [provisionedData, setProvisionedData] = useState<{ tenant: TenantOrg; credentials: any } | null>(null);

  const [formData, setFormData] = useState<TenantOnboardingPayload>({
    organizationName: '',
    dbaName: '',
    stateLicenseNumber: '',
    deaRegistrationNumber: '',
    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    pharmacistInChargeNpi: '',
    tier: 'Standard Partner',
    deliveryRadiusMiles: 15,
    expressSlaMinutes: 120,
    webhookNotificationUrl: ''
  });

  if (!isOpen) return null;

  const handleVerifyNpi = async () => {
    if (!formData.pharmacistInChargeNpi) return;
    setNpiValidating(true);
    setErrorMsg(null);
    try {
      const result = await api.verifyNpi(formData.pharmacistInChargeNpi);
      if (result.valid) {
        setNpiVerifiedName(result.providerName);
        if (!formData.primaryContactName) {
          setFormData((prev) => ({ ...prev, primaryContactName: result.providerName }));
        }
      } else {
        setErrorMsg('NPI was not found in active national registry or license is under review.');
      }
    } catch {
      setErrorMsg('Failed to reach NPI registry verification provider.');
    } finally {
      setNpiValidating(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await api.onboardTenant(formData);
      if (res.success) {
        setProvisionedData(res);
        if (onTenantOnboarded) {
          onTenantOnboarded(res.tenant);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete tenant onboarding.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/30 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-outline-variant/30 bg-surface-container-high/40 dark:bg-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-primary/10 text-primary rounded-2xl material-symbols-outlined text-2xl">
              add_business
            </span>
            <div>
              <h2 className="text-title-lg font-bold text-on-surface dark:text-white">Pharmacy Partner Onboarding</h2>
              <p className="text-body-xs text-on-surface-variant dark:text-slate-400">
                Self-serve registration, DEA/NPI validation, and shard provisioning
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-container-highest dark:hover:bg-slate-800 text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Step Indicator */}
        {!provisionedData && (
          <div className="px-8 py-4 bg-surface-container-high/20 dark:bg-slate-800/20 border-b border-outline-variant/20 flex justify-between items-center text-label-sm font-bold">
            {[
              { step: 1, label: '1. Identity & DEA' },
              { step: 2, label: '2. Pharmacist NPI' },
              { step: 3, label: '3. Fulfillment Tier' },
              { step: 4, label: '4. Shard Provision' }
            ].map((s) => (
              <div
                key={s.step}
                className={`flex items-center gap-2 ${
                  currentStep === s.step
                    ? 'text-primary dark:text-teal-400 font-extrabold'
                    : currentStep > s.step
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-on-surface-variant/50 dark:text-slate-500'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-label-xs font-bold ${
                    currentStep === s.step
                      ? 'bg-primary text-on-primary'
                      : currentStep > s.step
                      ? 'bg-emerald-500 text-white'
                      : 'bg-surface-container-high dark:bg-slate-800 text-on-surface-variant'
                  }`}
                >
                  {currentStep > s.step ? '✓' : s.step}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMsg && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-rose-700 dark:text-rose-400 text-body-sm font-semibold">
              <span className="material-symbols-outlined text-xl">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {provisionedData ? (
            /* Success & Provisioned Credentials View */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl material-symbols-outlined">
                task_alt
              </div>
              <div>
                <h3 className="text-headline-sm font-bold text-on-surface dark:text-white">Pharmacy Provisioned Successfully!</h3>
                <p className="text-body-sm text-on-surface-variant dark:text-slate-300 mt-1 max-w-md mx-auto">
                  <span className="font-bold text-on-surface dark:text-white">{provisionedData.tenant.name}</span> is now active with isolated database shard{' '}
                  <code className="px-2 py-0.5 bg-surface-container-high dark:bg-slate-800 rounded font-mono text-primary font-bold">{provisionedData.tenant.shard}</code>.
                </p>
              </div>

              {/* Provisioned Keys Card */}
              <div className="p-5 bg-surface-container-high/50 dark:bg-slate-800/50 rounded-2xl border border-outline-variant/30 text-left space-y-3">
                <div>
                  <label className="text-label-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Live API Key</label>
                  <div className="p-2.5 bg-surface-container-lowest dark:bg-slate-900 rounded-xl border border-outline-variant/30 font-mono text-body-xs font-bold text-primary dark:text-teal-400 flex items-center justify-between">
                    <span>{provisionedData.credentials.apiKey}</span>
                    <span className="material-symbols-outlined text-base text-on-surface-variant cursor-pointer hover:text-primary" title="Copy Key">content_copy</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-body-xs">
                  <div>
                    <label className="text-label-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Schema Isolation</label>
                    <p className="font-mono font-bold text-on-surface dark:text-white">{provisionedData.credentials.schemaKey}</p>
                  </div>
                  <div>
                    <label className="text-label-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">SEC-18 Audit Cert</label>
                    <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{provisionedData.credentials.complianceCert}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-primary text-on-primary rounded-xl text-label-md font-bold shadow-sm hover:shadow-md transition-all"
                >
                  Return to Admin Suite
                </button>
              </div>
            </div>
          ) : (
            /* Step-by-Step Input Form */
            <>
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-title-md font-bold text-on-surface dark:text-white">Organization Identity & DEA Credentials</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-label-sm font-bold text-on-surface dark:text-slate-300 mb-1">
                        Pharmacy Legal Entity Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Downtown Care Pharmacy LLC"
                        value={formData.organizationName}
                        onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                        className="w-full px-4 py-2.5 bg-surface-container-high dark:bg-slate-800 rounded-xl border border-outline-variant/30 text-on-surface dark:text-white text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-label-sm font-bold text-on-surface dark:text-slate-300 mb-1">
                        DBA / Trade Name (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Downtown Generic Meds"
                        value={formData.dbaName}
                        onChange={(e) => setFormData({ ...formData, dbaName: e.target.value })}
                        className="w-full px-4 py-2.5 bg-surface-container-high dark:bg-slate-800 rounded-xl border border-outline-variant/30 text-on-surface dark:text-white text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-label-sm font-bold text-on-surface dark:text-slate-300 mb-1">
                          State Dispensary License # *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., NY-DISP-884920"
                          value={formData.stateLicenseNumber}
                          onChange={(e) => setFormData({ ...formData, stateLicenseNumber: e.target.value })}
                          className="w-full px-4 py-2.5 bg-surface-container-high dark:bg-slate-800 rounded-xl border border-outline-variant/30 text-on-surface dark:text-white text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-label-sm font-bold text-on-surface dark:text-slate-300 mb-1">
                          DEA Registration Number *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., FB-9824102"
                          value={formData.deaRegistrationNumber}
                          onChange={(e) => setFormData({ ...formData, deaRegistrationNumber: e.target.value })}
                          className="w-full px-4 py-2.5 bg-surface-container-high dark:bg-slate-800 rounded-xl border border-outline-variant/30 text-on-surface dark:text-white text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-title-md font-bold text-on-surface dark:text-white">Pharmacist-in-Charge & Contacts</h3>
                  
                  <div>
                    <label className="block text-label-sm font-bold text-on-surface dark:text-slate-300 mb-1">
                      Pharmacist-in-Charge (PIC) NPI Number *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="10-digit NPI (e.g. 198204921)"
                        value={formData.pharmacistInChargeNpi}
                        onChange={(e) => setFormData({ ...formData, pharmacistInChargeNpi: e.target.value })}
                        className="flex-1 px-4 py-2.5 bg-surface-container-high dark:bg-slate-800 rounded-xl border border-outline-variant/30 text-on-surface dark:text-white text-body-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyNpi}
                        disabled={npiValidating || !formData.pharmacistInChargeNpi}
                        className="px-4 py-2.5 bg-primary text-on-primary rounded-xl text-label-sm font-bold disabled:opacity-50"
                      >
                        {npiValidating ? 'Checking...' : 'Verify NPI'}
                      </button>
                    </div>

                    {npiVerifiedName && (
                      <div className="mt-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-label-sm font-bold">
                        <span className="material-symbols-outlined text-base">verified</span>
                        <span>Verified Active: {npiVerifiedName}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-label-sm font-bold text-on-surface dark:text-slate-300 mb-1">
                        Primary Contact Email *
                      </label>
                      <input
                        type="email"
                        placeholder="rx-ops@pharmacy.com"
                        value={formData.primaryContactEmail}
                        onChange={(e) => setFormData({ ...formData, primaryContactEmail: e.target.value })}
                        className="w-full px-4 py-2.5 bg-surface-container-high dark:bg-slate-800 rounded-xl border border-outline-variant/30 text-on-surface dark:text-white text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-label-sm font-bold text-on-surface dark:text-slate-300 mb-1">
                        Primary Contact Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="(555) 234-5678"
                        value={formData.primaryContactPhone}
                        onChange={(e) => setFormData({ ...formData, primaryContactPhone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-surface-container-high dark:bg-slate-800 rounded-xl border border-outline-variant/30 text-on-surface dark:text-white text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-title-md font-bold text-on-surface dark:text-white">Fulfillment Tier & Service Radius</h3>

                  <div>
                    <label className="block text-label-sm font-bold text-on-surface dark:text-slate-300 mb-2">
                      Select Tenant Tier & Take Rate
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { tier: 'Enterprise Tier', rate: '12.0%', desc: 'Multi-location network, priority courier SLA' },
                        { tier: 'Standard Partner', rate: '11.5%', desc: 'Independent community pharmacy, local delivery' },
                        { tier: 'Regional Partner', rate: '12.5%', desc: 'County-level dispensary cluster, express lockbox' },
                        { tier: 'Starter Dispensary', rate: '10.0%', desc: 'Single storefront with curbside pickup only' }
                      ].map((t) => (
                        <div
                          key={t.tier}
                          onClick={() => setFormData({ ...formData, tier: t.tier as any })}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            formData.tier === t.tier
                              ? 'bg-primary/10 border-primary shadow-sm'
                              : 'bg-surface-container-high dark:bg-slate-800 border-outline-variant/30 hover:border-outline'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-on-surface dark:text-white text-body-sm">{t.tier}</span>
                            <span className="text-label-xs font-bold text-primary dark:text-teal-400 bg-primary/10 px-2 py-0.5 rounded-full">{t.rate} Fee</span>
                          </div>
                          <p className="text-body-xs text-on-surface-variant dark:text-slate-400">{t.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-label-sm font-bold text-on-surface dark:text-slate-300 mb-1">
                        Courier Delivery Radius (Miles)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={formData.deliveryRadiusMiles}
                        onChange={(e) => setFormData({ ...formData, deliveryRadiusMiles: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 bg-surface-container-high dark:bg-slate-800 rounded-xl border border-outline-variant/30 text-on-surface dark:text-white text-body-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-label-sm font-bold text-on-surface dark:text-slate-300 mb-1">
                        Target Dispensing SLA (Minutes)
                      </label>
                      <input
                        type="number"
                        min="30"
                        max="240"
                        step="15"
                        value={formData.expressSlaMinutes}
                        onChange={(e) => setFormData({ ...formData, expressSlaMinutes: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 bg-surface-container-high dark:bg-slate-800 rounded-xl border border-outline-variant/30 text-on-surface dark:text-white text-body-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-title-md font-bold text-on-surface dark:text-white">Review & Shard Isolation Setup</h3>

                  <div className="p-4 bg-surface-container-high dark:bg-slate-800 rounded-2xl border border-outline-variant/30 space-y-2 text-body-sm">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant dark:text-slate-400">Pharmacy Entity:</span>
                      <span className="font-bold text-on-surface dark:text-white">{formData.organizationName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant dark:text-slate-400">DEA Registration:</span>
                      <span className="font-mono font-bold text-on-surface dark:text-white">{formData.deaRegistrationNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant dark:text-slate-400">Partner Tier:</span>
                      <span className="font-bold text-primary dark:text-teal-400">{formData.tier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant dark:text-slate-400">PIC Verified:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{npiVerifiedName || 'NPI ' + formData.pharmacistInChargeNpi}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-label-sm font-bold text-on-surface dark:text-slate-300 mb-1">
                      Webhook Event Stream URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://api.yourpharmacy.com/webhooks/genericmed"
                      value={formData.webhookNotificationUrl}
                      onChange={(e) => setFormData({ ...formData, webhookNotificationUrl: e.target.value })}
                      className="w-full px-4 py-2.5 bg-surface-container-high dark:bg-slate-800 rounded-xl border border-outline-variant/30 text-on-surface dark:text-white text-body-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                    />
                  </div>

                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center gap-2.5 text-purple-700 dark:text-purple-300 text-body-xs">
                    <span className="material-symbols-outlined text-lg">enhanced_encryption</span>
                    <span>Upon submission, a dedicated isolated database schema with encrypted SEC-18 ledger tracking will be provisioned.</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Controls */}
        {!provisionedData && (
          <div className="p-6 border-t border-outline-variant/30 bg-surface-container-high/40 dark:bg-slate-800/40 flex items-center justify-between">
            <button
              onClick={() => {
                if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as any);
                else onClose();
              }}
              className="px-5 py-2.5 rounded-xl border border-outline-variant/40 hover:bg-surface-container-highest dark:hover:bg-slate-800 text-on-surface dark:text-white text-label-md font-bold transition-all"
            >
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </button>

            {currentStep < 4 ? (
              <button
                onClick={() => {
                  if (currentStep === 1 && (!formData.organizationName || !formData.stateLicenseNumber || !formData.deaRegistrationNumber)) {
                    setErrorMsg('Please complete all required fields.');
                    return;
                  }
                  if (currentStep === 2 && !formData.pharmacistInChargeNpi) {
                    setErrorMsg('Please specify Pharmacist NPI.');
                    return;
                  }
                  setErrorMsg(null);
                  setCurrentStep((prev) => (prev + 1) as any);
                }}
                className="px-6 py-2.5 bg-primary text-on-primary rounded-xl text-label-md font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-1"
              >
                <span>Continue</span>
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            ) : (
              <button
                onClick={handleCompleteOnboarding}
                disabled={submitting}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-label-md font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">verified</span>
                <span>{submitting ? 'Provisioning Shard...' : 'Provision Tenant Shard'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
