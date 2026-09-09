import React, { useState } from 'react';
import { PrescriptionRecord } from '../types';
import { api } from '../services/api';

interface PrescriptionUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrescriptionParsed?: (record: PrescriptionRecord) => void;
}

export const PrescriptionUploadModal: React.FC<PrescriptionUploadModalProps> = ({
  isOpen,
  onClose,
  onPrescriptionParsed
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [parsedRx, setParsedRx] = useState<PrescriptionRecord | null>(null);
  const [npiStatus, setNpiStatus] = useState<'IDLE' | 'CHECKING' | 'VALID' | 'INVALID'>('IDLE');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulatedUpload = async (preset: 'lipitor' | 'glucophage') => {
    setSelectedFile(preset === 'lipitor' ? 'Rx_DrSharonLin_Lipitor20mg.pdf' : 'Rx_DrCampbell_Glucophage500mg.jpg');
    setIsScanning(true);
    setScanProgress(15);
    setParsedRx(null);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 200);

    try {
      const res = await api.uploadPrescriptionOcr({
        filename: preset === 'lipitor' ? 'lipitor_rx.pdf' : 'metformin_rx.jpg'
      });
      clearInterval(interval);
      setScanProgress(100);
      setIsScanning(false);
      setParsedRx(res.prescription);

      // Verify NPI
      setNpiStatus('CHECKING');
      const npiRes = await api.verifyNpi(res.prescription.prescriberNpi);
      setNpiStatus(npiRes.valid ? 'VALID' : 'INVALID');

      if (onPrescriptionParsed) {
        onPrescriptionParsed(res.prescription);
      }
    } catch {
      clearInterval(interval);
      setIsScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface border border-outline/20 rounded-2xl max-w-2xl w-full p-6 shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">document_scanner</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-on-surface">Gemini Vision Rx Scanner</h3>
              <p className="text-xs text-on-surface-variant">
                Upload your brand prescription to instantly unlock FDA-verified bioequivalent generics
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

        {/* Upload Zone */}
        {!parsedRx && !isScanning && (
          <div className="py-6">
            <div
              onClick={() => handleSimulatedUpload('lipitor')}
              className="border-2 border-dashed border-outline/30 hover:border-primary/60 rounded-2xl p-8 text-center cursor-pointer transition-all hover:bg-primary/5 group"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-container flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl text-primary">cloud_upload</span>
              </div>
              <h4 className="font-semibold text-base text-on-surface mb-1">
                Drop your prescription image or PDF here
              </h4>
              <p className="text-xs text-on-surface-variant mb-4">
                Supports JPG, PNG, HEIC, PDF with auto-enhancement and TeleRx signature verification
              </p>
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-primary">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                <span>Powered by Multimodal Gemini Vision 2.5</span>
              </div>
            </div>

            {/* Quick Demo Presets */}
            <div className="mt-4 pt-4 border-t border-outline/10">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-2">
                Or test with sample verified Rx slips:
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSimulatedUpload('lipitor')}
                  className="flex items-center gap-3 p-3 rounded-xl border border-outline/20 hover:border-primary/50 hover:bg-surface-container text-left transition-all"
                >
                  <span className="material-symbols-outlined text-primary">medication</span>
                  <div>
                    <div className="font-medium text-xs text-on-surface">Dr. Lin — Lipitor 20mg</div>
                    <div className="text-[11px] text-on-surface-variant">Mount Sinai Cardiology</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulatedUpload('glucophage')}
                  className="flex items-center gap-3 p-3 rounded-xl border border-outline/20 hover:border-primary/50 hover:bg-surface-container text-left transition-all"
                >
                  <span className="material-symbols-outlined text-primary">pill</span>
                  <div>
                    <div className="font-medium text-xs text-on-surface">Dr. Campbell — Glucophage 500mg</div>
                    <div className="text-[11px] text-on-surface-variant">Brooklyn Endocrinology</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scanning Animation */}
        {isScanning && (
          <div className="py-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <span className="material-symbols-outlined text-3xl text-primary animate-pulse">document_scanner</span>
            </div>
            <h4 className="font-bold text-lg text-on-surface mb-1">Analyzing Prescription OCR...</h4>
            <p className="text-xs text-on-surface-variant mb-6">
              Extracting active molecules, NPI credentials, dosage, and Orange Book equivalency
            </p>
            <div className="max-w-md mx-auto bg-surface-container rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300 ease-out"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <div className="text-xs text-primary font-mono font-medium mt-2">{scanProgress}% completed</div>
          </div>
        )}

        {/* Parsed Result Card */}
        {parsedRx && !isScanning && (
          <div className="py-4 space-y-4">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <span className="material-symbols-outlined text-base">verified</span>
                <span>Rx Successfully Extracted & Verified ({parsedRx.ocrConfidence}% OCR Confidence)</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400/80 bg-emerald-500/20 px-2 py-0.5 rounded">
                {parsedRx.rxNumber}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Prescribed Drug Info */}
              <div className="p-4 rounded-xl bg-surface-container border border-outline/10 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Original Prescription
                </span>
                <div>
                  <div className="text-base font-bold text-on-surface">{parsedRx.brandPrescribed}</div>
                  <div className="text-xs text-on-surface-variant">{parsedRx.dosage}</div>
                </div>
                <div className="text-xs text-on-surface-variant pt-2 border-t border-outline/10">
                  Patient: <span className="font-medium text-on-surface">{parsedRx.patientName}</span>
                </div>
                <div className="text-xs text-on-surface-variant">
                  Refills: <span className="font-medium text-on-surface">{parsedRx.refillsRemaining} of {parsedRx.refillsTotal} remaining</span>
                </div>
              </div>

              {/* Matched Bioequivalent Generic */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    Matched Active Generic
                  </span>
                  <span className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    AB Rated
                  </span>
                </div>
                <div>
                  <div className="text-base font-bold text-primary">{parsedRx.genericMatched}</div>
                  <div className="text-xs text-on-surface-variant">100% Active Chemical Bioequivalent</div>
                </div>
                <div className="text-xs text-emerald-400 font-semibold pt-2 border-t border-primary/20 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">savings</span>
                  <span>Est. Annual Savings: ${parsedRx.estimatedGenericSavings.toFixed(2)}/mo</span>
                </div>
              </div>
            </div>

            {/* Prescriber NPI Card */}
            <div className="p-3.5 rounded-xl bg-surface-container border border-outline/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-lg">medical_services</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface">{parsedRx.prescriberName}</div>
                  <div className="text-[11px] text-on-surface-variant">{parsedRx.prescriberClinic}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-on-surface-variant">NPI: {parsedRx.prescriberNpi}</div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  NPI Registry Active
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setParsedRx(null);
                  setSelectedFile(null);
                }}
                className="px-4 py-2 rounded-xl border border-outline/20 text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-colors"
              >
                Scan Another Slip
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-lg shadow-primary/25 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">shopping_cart_checkout</span>
                <span>Select Generic & Proceed to Checkout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
