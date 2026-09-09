import React, { useState, useEffect } from 'react';
import { MultiRegionNode } from '../types';
import { api } from '../services/api';

interface MultiRegionStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MultiRegionStatusModal: React.FC<MultiRegionStatusModalProps> = ({
  isOpen,
  onClose
}) => {
  const [nodes, setNodes] = useState<MultiRegionNode[]>([]);
  const [topology, setTopology] = useState<{
    primaryRegion: string;
    totalActiveConnections: number;
    globalTps: number;
    consensusEngine: string;
    rtoSeconds: number;
    rpoSeconds: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [failingOver, setFailingOver] = useState(false);
  const [failoverResult, setFailoverResult] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadStatus();
    }
  }, [isOpen]);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const data = await api.getMultiRegionStatus();
      setNodes(data.nodes);
      setTopology(data.globalTopology);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateFailover = async (targetRegionId: string) => {
    setFailingOver(true);
    setFailoverResult(null);
    try {
      const res = await api.simulateRegionFailover(targetRegionId);
      setFailoverResult(
        `Elected new leader: ${res.newLeader} in ${res.failoverDurationMs}ms (SEC-18 Hash: ${res.sec18AuditHash.substring(0, 16)}...)`
      );
      await loadStatus();
    } catch (e) {
      console.error(e);
    } finally {
      setFailingOver(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface border border-outline-variant/30 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-outline-variant/20 bg-surface-container/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">public</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm font-bold text-on-surface">Global Multi-Region Network</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Raft Distributed Consensus
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Live database replication health, cross-region latency, and zero-downtime disaster recovery.
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

        {/* Failover Toast */}
        {failoverResult && (
          <div className="px-6 py-3 bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">verified</span>
            {failoverResult}
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Global KPIs */}
          {topology && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-surface-container/60 border border-outline-variant/30">
                <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Primary Leader
                </span>
                <span className="text-sm font-bold text-on-surface mt-0.5 block truncate">
                  {topology.primaryRegion}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container/60 border border-outline-variant/30">
                <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Global Throughput
                </span>
                <span className="text-sm font-bold text-primary mt-0.5 block">
                  {topology.globalTps.toLocaleString()} TPS
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container/60 border border-outline-variant/30">
                <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Target RTO / RPO
                </span>
                <span className="text-sm font-bold text-on-surface mt-0.5 block">
                  &lt; {topology.rtoSeconds}s / {topology.rpoSeconds}s
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container/60 border border-outline-variant/30">
                <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Active Connections
                </span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  {topology.totalActiveConnections.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Regional Nodes Topology */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Active Regional Cluster Nodes ({nodes.length})
              </h3>
              <button
                onClick={loadStatus}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-xs">refresh</span> Ping Cluster
              </button>
            </div>

            {loading ? (
              <div className="py-12 text-center text-on-surface-variant text-xs flex flex-col items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-2xl text-primary">progress_activity</span>
                Measuring multi-region replication lags...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {nodes.map((node) => {
                  const isLeader = node.role === 'PRIMARY_LEADER';
                  return (
                    <div
                      key={node.regionId}
                      className={`p-4 rounded-2xl border transition-all ${
                        isLeader
                          ? 'bg-primary/5 border-primary/50 shadow-xs'
                          : 'bg-surface border-outline-variant/30 hover:border-outline-variant/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs text-on-surface">{node.regionName}</h4>
                            <span className="px-1.5 py-0.2 rounded font-mono text-[10px] bg-surface-container font-semibold text-on-surface-variant">
                              {node.regionId}
                            </span>
                          </div>
                          <span className="text-[10px] text-on-surface-variant">{node.datacenter}</span>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            isLeader
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container-high text-on-surface-variant'
                          }`}
                        >
                          {isLeader ? 'Leader Primary' : 'Read Replica'}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-xl bg-surface-container/40 text-center">
                        <div>
                          <span className="block text-[9px] font-medium text-on-surface-variant">Replication Lag</span>
                          <span className={`text-xs font-bold font-mono ${node.replicationLagMs > 50 ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {node.replicationLagMs} ms
                          </span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-medium text-on-surface-variant">Throughput</span>
                          <span className="text-xs font-bold text-on-surface font-mono">
                            {node.qpsThroughput} QPS
                          </span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-medium text-on-surface-variant">Storage</span>
                          <span className="text-xs font-bold text-on-surface font-mono">
                            {node.storageUsagePercent}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-outline-variant/10 text-[10px] text-on-surface-variant">
                        <span>Ping: {node.lastHealthCheck}</span>
                        {!isLeader && (
                          <button
                            onClick={() => handleSimulateFailover(node.regionId)}
                            disabled={failingOver}
                            className="px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-primary hover:text-on-primary font-semibold text-[10px] transition-colors flex items-center gap-1 disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-xs">bolt</span>
                            Simulate Failover
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-outline-variant/20 bg-surface-container/40 flex items-center justify-between text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">security</span>
            <span>SEC-18 Automated Failover Auditing Enabled (Zero RPO Data Loss Guard)</span>
          </div>
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
