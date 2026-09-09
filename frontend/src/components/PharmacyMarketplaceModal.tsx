import React, { useState, useEffect } from 'react';
import { PharmacyMarketplaceAdapter } from '../types';
import { api } from '../services/api';

interface PharmacyMarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PharmacyMarketplaceModal: React.FC<PharmacyMarketplaceModalProps> = ({
  isOpen,
  onClose
}) => {
  const [adapters, setAdapters] = useState<PharmacyMarketplaceAdapter[]>([]);
  const [selectedAdapter, setSelectedAdapter] = useState<PharmacyMarketplaceAdapter | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadAdapters();
    }
  }, [isOpen]);

  const loadAdapters = async () => {
    setLoading(true);
    try {
      const data = await api.getMarketplaceAdapters();
      setAdapters(data);
      if (data.length > 0 && !selectedAdapter) {
        setSelectedAdapter(data[0]);
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to load PMS adapters.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (id: string) => {
    setSyncingId(id);
    setStatusMessage(null);
    try {
      const result = await api.syncMarketplaceAdapter(id);
      setStatusMessage({
        type: 'success',
        text: `Successfully synchronized ${result.syncedItems} verified NDC stock records from ${result.adapter.vendor}.`
      });
      // Update local state
      setAdapters((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...result.adapter } : a))
      );
      if (selectedAdapter?.id === id) {
        setSelectedAdapter(result.adapter);
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'PMS synchronization failed.' });
    } finally {
      setSyncingId(null);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdapter) return;

    try {
      const updated = await api.configureMarketplaceAdapter(selectedAdapter.id, selectedAdapter.config);
      setStatusMessage({
        type: 'success',
        text: `${updated.name} connection settings saved & verified.`
      });
      setAdapters((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );
      setSelectedAdapter(updated);
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to update adapter settings.' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface border border-outline-variant/30 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-outline-variant/20 bg-surface-container/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">hub</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm font-bold text-on-surface">Pharmacy PMS Marketplace</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-primary/10 text-primary border border-primary/20">
                  Enterprise Connectors
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Live bidirectional adapters for QS/1, PioneerRx, Liberty, Rx30, and hospital EHR systems.
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

        {/* Status Toast */}
        {statusMessage && (
          <div
            className={`px-6 py-3 text-xs font-medium flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-b border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-b border-rose-500/20'
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {statusMessage.type === 'success' ? 'check_circle' : 'error'}
            </span>
            {statusMessage.text}
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-outline-variant/20">
          {/* Adapter List (5 cols) */}
          <div className="md:col-span-5 p-4 space-y-3 bg-surface-container-lowest overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-on-surface-variant tracking-wider uppercase">
                Available Connectors ({adapters.length})
              </span>
              <button
                onClick={loadAdapters}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-xs">refresh</span> Refresh
              </button>
            </div>

            {loading ? (
              <div className="py-12 text-center text-on-surface-variant text-xs flex flex-col items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-2xl text-primary">progress_activity</span>
                Discovering PMS nodes...
              </div>
            ) : (
              adapters.map((adapter) => {
                const isSelected = selectedAdapter?.id === adapter.id;
                const isConnected = adapter.status === 'CONNECTED';
                return (
                  <div
                    key={adapter.id}
                    onClick={() => setSelectedAdapter(adapter)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-primary/5 border-primary shadow-sm'
                        : 'bg-surface border-outline-variant/30 hover:border-outline-variant hover:bg-surface-container/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isConnected ? 'bg-emerald-500/10 text-emerald-600' : 'bg-surface-container text-on-surface-variant'
                          }`}
                        >
                          <span className="material-symbols-outlined text-lg">{adapter.icon}</span>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-on-surface">{adapter.name}</h4>
                          <span className="text-[10px] text-on-surface-variant">{adapter.vendor} • {adapter.version}</span>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          isConnected
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {adapter.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-on-surface-variant line-clamp-2 mb-2">
                      {adapter.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-on-surface-variant/80 border-t border-outline-variant/10 pt-2">
                      <span>{adapter.inventoryCountSynced.toLocaleString()} NDCs synced</span>
                      <span>Last sync: {adapter.lastSyncTimestamp || 'N/A'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Adapter Details & Config Panel (7 cols) */}
          <div className="md:col-span-7 p-6 space-y-6 overflow-y-auto">
            {selectedAdapter ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-headline-sm font-bold text-on-surface">{selectedAdapter.name}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-surface-container-high text-on-surface font-semibold">
                        {selectedAdapter.protocol}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {selectedAdapter.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSync(selectedAdapter.id)}
                    disabled={syncingId === selectedAdapter.id}
                    className="px-3.5 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50 shrink-0"
                  >
                    <span
                      className={`material-symbols-outlined text-sm ${
                        syncingId === selectedAdapter.id ? 'animate-spin' : ''
                      }`}
                    >
                      sync
                    </span>
                    {syncingId === selectedAdapter.id ? 'Syncing...' : 'Sync Now'}
                  </button>
                </div>

                {/* Features Badges */}
                <div>
                  <h4 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                    Verified PMS Capabilities
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAdapter.features.map((feat, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-[11px] bg-surface-container font-medium text-on-surface border border-outline-variant/30 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs text-emerald-500">check</span>
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Configuration Form */}
                <form onSubmit={handleSaveConfig} className="space-y-4 border-t border-outline-variant/20 pt-4">
                  <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary">tune</span>
                    Connection & Security Settings
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-on-surface-variant mb-1">
                        Gateway API Endpoint URL
                      </label>
                      <input
                        type="url"
                        value={selectedAdapter.config.apiUrl || ''}
                        onChange={(e) =>
                          setSelectedAdapter({
                            ...selectedAdapter,
                            config: { ...selectedAdapter.config, apiUrl: e.target.value }
                          })
                        }
                        placeholder="https://pms.pharmacy.internal/api/v1"
                        className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface text-on-surface text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-on-surface-variant mb-1">
                        Authentication Protocol
                      </label>
                      <select
                        value={selectedAdapter.config.authMethod}
                        onChange={(e) =>
                          setSelectedAdapter({
                            ...selectedAdapter,
                            config: {
                              ...selectedAdapter.config,
                              authMethod: e.target.value as any
                            }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface text-on-surface text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                      >
                        <option value="MTLS">Mutual TLS (mTLS Cert)</option>
                        <option value="OAUTH2">OAuth 2.0 / JWT Client Credentials</option>
                        <option value="API_KEY">Scoped API Token Header</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-on-surface-variant mb-1">
                        Auto-Sync Frequency
                      </label>
                      <select
                        value={selectedAdapter.config.syncIntervalMinutes}
                        onChange={(e) =>
                          setSelectedAdapter({
                            ...selectedAdapter,
                            config: {
                              ...selectedAdapter.config,
                              syncIntervalMinutes: Number(e.target.value)
                            }
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface text-on-surface text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                      >
                        <option value="3">Every 3 Minutes (High-Velocity)</option>
                        <option value="5">Every 5 Minutes (Standard)</option>
                        <option value="10">Every 10 Minutes</option>
                        <option value="15">Every 15 Minutes</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="autoSync"
                      checked={selectedAdapter.config.autoSyncEnabled}
                      onChange={(e) =>
                        setSelectedAdapter({
                          ...selectedAdapter,
                          config: { ...selectedAdapter.config, autoSyncEnabled: e.target.checked }
                        })
                      }
                      className="rounded text-primary focus:ring-primary"
                    />
                    <label htmlFor="autoSync" className="text-xs text-on-surface font-medium cursor-pointer">
                      Enable real-time inventory push webhooks for zero-slippage cleanroom validation
                    </label>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface font-semibold text-xs transition-all border border-outline-variant/30 flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">save</span>
                      Save Configuration
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="py-20 text-center text-on-surface-variant text-xs">
                Select a pharmacy PMS connector from the left list to view settings.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-outline-variant/20 bg-surface-container/40 flex items-center justify-between text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-500 text-sm">verified_user</span>
            <span>NCPDP SCRIPT & HL7 FHIR R4 Compliant Enterprise Exchange</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary font-medium hover:bg-primary-hover transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
