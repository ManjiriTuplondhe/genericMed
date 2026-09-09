import React, { useState, useEffect } from 'react';
import { Medicine, MultiDrugInteractionCheck } from '../types';
import { api } from '../services/api';

interface MultiDrugInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedMedicineId?: string;
}

export const MultiDrugInteractionModal: React.FC<MultiDrugInteractionModalProps> = ({
  isOpen,
  onClose,
  preselectedMedicineId
}) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedMedIds, setSelectedMedIds] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<MultiDrugInteractionCheck | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadMedicines();
    }
  }, [isOpen]);

  useEffect(() => {
    if (preselectedMedicineId && !selectedMedIds.includes(preselectedMedicineId)) {
      setSelectedMedIds((prev) => [...prev, preselectedMedicineId]);
    }
  }, [preselectedMedicineId]);

  const loadMedicines = async () => {
    try {
      const data = await api.getMedicines();
      setMedicines(data);
      if (selectedMedIds.length === 0 && data.length >= 2) {
        setSelectedMedIds([data[0].id, data[1].id]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleMedicine = (id: string) => {
    setSelectedMedIds((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]
    );
  };

  const handleRunAnalysis = async () => {
    if (selectedMedIds.length < 1) return;
    setLoading(true);
    try {
      const result = await api.checkMultiDrugInteractions(selectedMedIds);
      setAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && selectedMedIds.length >= 1) {
      handleRunAnalysis();
    }
  }, [selectedMedIds.length, isOpen]);

  if (!isOpen) return null;

  const getRiskBadge = (risk?: MultiDrugInteractionCheck['overallRiskLevel']) => {
    switch (risk) {
      case 'HIGH':
        return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
      case 'MODERATE':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'LOW':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
      default:
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface border border-outline-variant/30 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-outline-variant/20 bg-surface-container/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">science</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm font-bold text-on-surface">
                  Multi-Drug Clinical Interaction Matrix
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-secondary/10 text-secondary border border-secondary/20">
                  CYP450 Engine
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Evaluate pharmacokinetic interference, metabolic pathway competition, and FDA Orange Book citations.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Medicine Selector Pills */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Select Medications to Check ({selectedMedIds.length} Selected)
              </span>
              <span className="text-[11px] text-on-surface-variant">Click pills to add or remove</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {medicines.map((med) => {
                const isSelected = selectedMedIds.includes(med.id);
                return (
                  <button
                    key={med.id}
                    onClick={() => toggleMedicine(med.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : 'bg-surface border-outline-variant/40 text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {isSelected ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                    <span>{med.genericName}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${isSelected ? 'bg-black/20 text-white' : 'bg-surface-container-high text-on-surface-variant'}`}>
                      {med.brandName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Analysis Results */}
          {loading ? (
            <div className="py-16 text-center text-on-surface-variant text-xs flex flex-col items-center gap-2">
              <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
              Analyzing metabolic pathways with FDA Orange Book & CYP450 matrix...
            </div>
          ) : analysis ? (
            <div className="space-y-4">
              {/* Overall Summary Card */}
              <div className="p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/30 flex items-start gap-4">
                <div className={`p-3 rounded-xl border flex items-center justify-center ${getRiskBadge(analysis.overallRiskLevel)}`}>
                  <span className="material-symbols-outlined text-2xl">
                    {analysis.overallRiskLevel === 'NONE' ? 'verified' : 'warning'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-on-surface">Overall Risk Assessment:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase border ${getRiskBadge(analysis.overallRiskLevel)}`}>
                      {analysis.overallRiskLevel} RISK
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {analysis.summary}
                  </p>
                </div>
              </div>

              {/* Individual Interactions List */}
              {analysis.interactions.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                    Detailed Pairwise Findings ({analysis.interactions.length})
                  </h4>

                  {analysis.interactions.map((inter, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-surface border border-outline-variant/30 space-y-3 shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-outline-variant/10 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-primary">{inter.drug1}</span>
                          <span className="material-symbols-outlined text-xs text-on-surface-variant">swap_horiz</span>
                          <span className="font-semibold text-xs text-primary">{inter.drug2}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getRiskBadge(inter.severity as any)}`}>
                          {inter.severity}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="bg-surface-container/40 p-2.5 rounded-xl border border-outline-variant/20">
                          <span className="block font-bold text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">
                            Metabolic Mechanism
                          </span>
                          <p className="text-on-surface leading-relaxed">{inter.mechanism}</p>
                          {inter.cypEnzymesInvolved && inter.cypEnzymesInvolved.length > 0 && (
                            <div className="mt-2 flex items-center gap-1">
                              <span className="text-[10px] text-on-surface-variant">CYP Enzymes:</span>
                              {inter.cypEnzymesInvolved.map((cyp, i) => (
                                <span key={i} className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-primary/10 text-primary font-semibold">
                                  {cyp}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="bg-surface-container/40 p-2.5 rounded-xl border border-outline-variant/20">
                          <span className="block font-bold text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">
                            Clinical Recommendation
                          </span>
                          <p className="text-on-surface leading-relaxed">{inter.managementRecommendation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
                  <span className="material-symbols-outlined text-3xl mb-1 block">check_circle</span>
                  No contraindications or dangerous pharmacokinetic interactions detected for the selected drugs.
                </div>
              )}

              {/* Citations */}
              <div className="border-t border-outline-variant/20 pt-3">
                <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Clinical Citations & Guidelines
                </span>
                <ul className="text-[10px] text-on-surface-variant space-y-0.5 list-disc list-inside">
                  {analysis.fdaWarningCitations.map((cite, i) => (
                    <li key={i}>{cite}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-on-surface-variant text-xs">
              Select at least one medicine above to analyze interactions.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-outline-variant/20 bg-surface-container/40 flex items-center justify-between text-xs text-on-surface-variant">
          <span className="text-[10px] text-on-surface-variant/80 italic">
            * Clinical interaction checks are powered by FDA Orange Book & CPIC guidelines. Consult your pharmacist before modifying medication schedules.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary font-medium hover:bg-primary-hover transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
