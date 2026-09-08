import React, { useState } from 'react';
import { TENANT_ORGS_DATA, AUDIT_LOGS_DATA } from '../data/mockData';
import { TenantOrg, Sec18AuditLog } from '../types';

export const SuperAdminSuite: React.FC = () => {
  const [tenants, setTenants] = useState<TenantOrg[]>(TENANT_ORGS_DATA);
  const [auditLogs, setAuditLogs] = useState<Sec18AuditLog[]>(AUDIT_LOGS_DATA);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [takeRateInput, setTakeRateInput] = useState<string>('12.0');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState<boolean>(false);

  // New Tenant Form State
  const [newOrgName, setNewOrgName] = useState<string>('');
  const [newOrgTier, setNewOrgTier] = useState<TenantOrg['tier']>('Standard Partner');
  const [newOrgDea, setNewOrgDea] = useState<string>('');
  const [newOrgShard, setNewOrgShard] = useState<string>('us-east-db-01');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.schemaKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.shard.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApplyTakeRate = () => {
    const rate = parseFloat(takeRateInput);
    if (isNaN(rate) || rate <= 0 || rate > 50) {
      alert('Please enter a valid take rate percentage (0.1% to 50.0%)');
      return;
    }
    setTenants((prev) => prev.map((t) => ({ ...t, takeRate: rate })));
    const newLog: Sec18AuditLog = {
      id: `audit-${Date.now()}`,
      timestampUtc: 'Just now',
      type: 'COMMISSION SETTLEMENT RUN',
      summary: `Global Platform Default Take Rate updated to ${rate}%. Clearinghouse recalculation triggered.`,
      actorOrTarget: 'Actor: Elena Vance (Root)',
      sha256: '7f91c98124b81029471928471928471928471928471928471928471928471928',
      statusBadge: 'COMMITTED',
      badgeStyle: 'primary'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`Global take rate updated to ${rate}% and applied across all active tenant routing pools.`);
  };

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) {
      alert('Please enter an organization name.');
      return;
    }
    const slug = newOrgName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newTenant: TenantOrg = {
      id: `org_${Math.floor(1000 + Math.random() * 9000)}`,
      slug,
      name: newOrgName,
      schemaKey: `tenant_${slug.replace(/-/g, '_')}_prod`,
      tier: newOrgTier,
      takeRate: parseFloat(takeRateInput) || 12.0,
      shard: newOrgShard,
      replicaLag: '0.2ms',
      monthlyOrders: 0,
      monthlyVolumeText: '0 orders/mo (Provisioned)',
      slaRate: 100.0,
      complianceStatus: 'Verified',
      nodeHealthPercent: 100.0,
      healthStatus: 'OK'
    };

    setTenants((prev) => [newTenant, ...prev]);
    setIsProvisionModalOpen(false);
    setNewOrgName('');
    setNewOrgDea('');
    showToast(`Tenant "${newTenant.name}" provisioned on ${newTenant.shard} with isolated schema "${newTenant.schemaKey}".`);
  };

  const handleRunSecurityScan = () => {
    showToast('Cross-tenant boundary scan executed: 0 data leaks detected across 18,420 queries.');
  };

  const handleFlushCache = () => {
    showToast('Redis Drug Substitution Cache flushed and invalidated across 4 edge clusters.');
  };

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] min-h-screen flex flex-col font-body">
      {/* Top Header */}
      <header className="bg-[#131b2e] text-white border-b border-[#283044] px-4 py-2.5 flex items-center justify-between sticky top-10 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6ffbbe] animate-pulse"></span>
            <span className="font-headline font-bold text-sm text-white">
              genericMed Root SuperAdmin
            </span>
            <span className="bg-[#00685f] text-white text-[10px] font-bold px-2 py-0.5 rounded font-data-mono">
              GLOBAL ROOT
            </span>
          </div>
          <span className="hidden md:inline text-xs text-gray-400">
            Multi-Region (US-East / US-Central)
          </span>
        </div>

        {/* Telemetry Health Ribbon */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 text-xs bg-[#283044] px-3 py-1 rounded-lg">
            <div className="flex items-center gap-1 text-[#6ffbbe]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6ffbbe]"></span>
              <span>PG: 99.99%</span>
            </div>
            <div className="flex items-center gap-1 text-[#6ffbbe]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6ffbbe]"></span>
              <span>Redis: 94.8%</span>
            </div>
            <div className="flex items-center gap-1 text-[#6ffbbe]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6ffbbe]"></span>
              <span>WAF: Active</span>
            </div>
            <div className="flex items-center gap-1 text-[#ffdad6]">
              <span>0 Crit / 2 Warn</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-gray-700">
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1Wy7VvC1evCNrHbcHWsqYoIQY1yIiBgLtufmHg6ei71FLzorFc3-VoB0tJ-NgkESv_X4sG2xu_jJe1xHcZwGkd39HO4RsMdtEd3UOaUysr3p68B-D-QcBzOgz2i_fV0NVmJBzNUpHegPShpxrmf7qDgUANlTGAQTAkpWpt_VOyvU8WuTHtHsG8Cs0uYZwCB7S58aau2SzPnqWGzz2cSwoTH-mxgw2kAlDSvu2WCLA-FbXStZx4bPBaZ9w"
              alt="Elena Vance"
              className="w-8 h-8 rounded-full border border-gray-600 object-cover"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="font-bold text-xs text-white">Dr. Elena Vance</span>
              <span className="text-[10px] text-gray-400">Root SuperAdmin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Context Ribbon */}
      <div className="bg-[#eaedff] border-b border-[#dae2fd] px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#00685f]">Orchestrator v4.8.2</span>
          <span>•</span>
          <span className="text-[#3d4947]">4 Database Clusters Synchronized</span>
          <span>•</span>
          <span className="text-[#006947] font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            HIPAA / DEA Sec 18 Ledger Enforced
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunSecurityScan}
            className="px-2.5 py-1 bg-white text-[#00685f] hover:bg-gray-50 rounded-lg text-xs font-bold border border-[#dae2fd] flex items-center gap-1 shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">security</span>
            <span>Verify Tenant Isolation</span>
          </button>
          <button
            onClick={() => setIsProvisionModalOpen(true)}
            className="px-3 py-1 bg-[#00685f] hover:bg-[#008378] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">add</span>
            <span>Provision Tenant</span>
          </button>
        </div>
      </div>

      {/* Executive KPI Ribbon */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3 rounded-xl shadow-sm border border-[#eaedff] flex flex-col">
          <span className="text-[11px] text-[#6d7a77] font-medium">Total Network GMV</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-headline font-bold text-xl text-[#131b2e]">$4.82M</span>
            <span className="text-[10px] text-[#006947] font-bold">+18.4%</span>
          </div>
          <span className="text-[10px] text-[#6d7a77] mt-1">30-day clearing volume</span>
        </div>

        <div className="bg-white p-3 rounded-xl shadow-sm border border-[#eaedff] flex flex-col">
          <span className="text-[11px] text-[#6d7a77] font-medium">Retained Platform Take</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-headline font-bold text-xl text-[#00685f]">$578,400</span>
            <span className="text-[10px] text-[#006947] font-bold">{takeRateInput}% EFF</span>
          </div>
          <span className="text-[10px] text-[#6d7a77] mt-1">Direct SaaS revenues</span>
        </div>

        <div className="bg-white p-3 rounded-xl shadow-sm border border-[#eaedff] flex flex-col">
          <span className="text-[11px] text-[#6d7a77] font-medium">Active Pharmacy Orgs</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-headline font-bold text-xl text-[#131b2e]">{tenants.length}</span>
            <span className="text-[10px] text-[#00685f] font-bold">+2 pending</span>
          </div>
          <span className="text-[10px] text-[#6d7a77] mt-1">Fully licensed partners</span>
        </div>

        <div className="bg-white p-3 rounded-xl shadow-sm border border-[#eaedff] flex flex-col">
          <span className="text-[11px] text-[#6d7a77] font-medium">Global Gateway Rate</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-headline font-bold text-xl text-[#006947]">14,820</span>
            <span className="text-[10px] text-[#6d7a77]">req/s</span>
          </div>
          <span className="text-[10px] text-[#006947] font-bold mt-1">99.99% edge uptime</span>
        </div>

        <div className="bg-white p-3 rounded-xl shadow-sm border border-[#eaedff] flex flex-col col-span-2 sm:col-span-1">
          <span className="text-[11px] text-[#6d7a77] font-medium">Escalation Queue</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-headline font-bold text-xl text-[#ba1a1a]">4</span>
            <span className="text-[10px] text-[#ba1a1a] font-bold">Requires Action</span>
          </div>
          <span className="text-[10px] text-[#6d7a77] mt-1">SLA warnings & reviews</span>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="px-4 pb-6 flex flex-col gap-4">
        {/* Tenant Fleet & Schema Isolation Matrix Table */}
        <section className="bg-white rounded-xl shadow-sm border border-[#eaedff] p-4 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-headline font-bold text-sm text-[#131b2e]">
                Tenant Fleet & Schema Isolation Matrix
              </h2>
              <p className="text-xs text-[#6d7a77]">
                Multi-tenant architecture partition with row-level security & independent database shards
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-gray-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Filter tenants, shards, schemas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f2f3ff] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#131b2e] focus:outline-none focus:ring-1 focus:ring-[#00685f]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-[#6d7a77] uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-2.5 px-3">Tenant Organization</th>
                  <th className="py-2.5 px-3">Schema Key</th>
                  <th className="py-2.5 px-3">Commercial Tier</th>
                  <th className="py-2.5 px-3">Database Shard</th>
                  <th className="py-2.5 px-3">Volume</th>
                  <th className="py-2.5 px-3">Compliance</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTenants.map((t) => (
                  <tr key={t.id} className="hover:bg-[#faf8ff] transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-[#131b2e]">{t.name}</div>
                      <div className="text-[10px] text-[#6d7a77]">ID: {t.id}</div>
                    </td>
                    <td className="py-2.5 px-3 font-data-mono text-[#00685f] font-semibold">
                      {t.schemaKey}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-gray-800">{t.tier}</div>
                      <span className="text-[10px] text-[#006947] font-bold">
                        {t.takeRate}% take rate
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-data-mono">
                      <div>{t.shard}</div>
                      <div className="text-[10px] text-gray-500">Lag: {t.replicaLag}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-gray-800">{t.monthlyVolumeText}</div>
                      <div className="text-[10px] text-[#006947] font-bold">{t.slaRate}% SLA</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.complianceStatus.includes('Warning')
                            ? 'bg-[#ffdad6] text-[#ba1a1a]'
                            : t.complianceStatus.includes('Review')
                            ? 'bg-[#eaedff] text-[#006398]'
                            : 'bg-[#6ffbbe]/30 text-[#002113]'
                        }`}
                      >
                        {t.complianceStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] font-bold ${
                          t.healthStatus === 'OK'
                            ? 'text-[#006947]'
                            : t.healthStatus === 'PROBATION'
                            ? 'text-[#ba1a1a]'
                            : 'text-[#006398]'
                        }`}
                      >
                        ● {t.nodeHealthPercent}% {t.healthStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {t.healthStatus === 'PROBATION' ? (
                          <button
                            onClick={() =>
                              showToast(`Escalation ticket dispatched to operations lead at ${t.name}!`)
                            }
                            className="px-2 py-1 bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffb4ab] rounded font-bold text-[10px] transition-colors"
                          >
                            Escalate
                          </button>
                        ) : t.healthStatus === 'IN-FLIGHT' ? (
                          <button
                            onClick={() => {
                              setTenants((prev) =>
                                prev.map((item) =>
                                  item.id === t.id
                                    ? {
                                        ...item,
                                        healthStatus: 'OK',
                                        complianceStatus: 'HIPAA & DEA Validated',
                                      }
                                    : item
                                )
                              );
                              showToast(`Tenant ${t.name} DEA clearance approved & migrated to live traffic!`);
                            }}
                            className="px-2 py-1 bg-[#00685f] text-white hover:bg-[#008378] rounded font-bold text-[10px] transition-colors"
                          >
                            Approve & Live
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              showToast(`Inspecting schema ${t.schemaKey}: Isolation verified 100%.`)
                            }
                            className="px-2 py-1 bg-[#f2f3ff] text-[#00685f] hover:bg-[#eaedff] rounded font-bold text-[10px] transition-colors"
                          >
                            Inspect Schema
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Clearinghouse & Platform Take Rate Settings + Quick SuperAdmin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Platform Take Rate Configuration */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[#eaedff] flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00685f] text-[20px]">tune</span>
              <h3 className="font-headline font-bold text-xs text-[#131b2e]">
                Clearinghouse Take Rate Engine
              </h3>
            </div>
            <p className="text-xs text-[#6d7a77]">
              Configure the platform baseline commission rate deducted from pharmacy disbursements on each generic dispense.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="relative flex-1">
                <input
                  type="number"
                  step="0.1"
                  value={takeRateInput}
                  onChange={(e) => setTakeRateInput(e.target.value)}
                  className="w-full bg-[#f2f3ff] border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-[#131b2e] focus:outline-none focus:ring-1 focus:ring-[#00685f]"
                />
                <span className="absolute right-3 top-1.5 text-xs text-gray-500 font-bold">%</span>
              </div>
              <button
                onClick={handleApplyTakeRate}
                className="px-3 py-1.5 bg-[#00685f] hover:bg-[#008378] text-white rounded-lg font-bold text-xs transition-colors shadow-sm"
              >
                Apply Rate
              </button>
            </div>
            <div className="text-[10px] text-[#006947] font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">lock</span>
              <span>Zero price slippage guard subsidized by platform reserve.</span>
            </div>
          </div>

          {/* Automated ACH Escrow & Settlement */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[#eaedff] flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006398] text-[20px]">
                account_balance_wallet
              </span>
              <h3 className="font-headline font-bold text-xs text-[#131b2e]">
                Automated Settlement Escrow
              </h3>
            </div>
            <p className="text-xs text-[#6d7a77]">
              Funds held in escrow pending 48h dispense signoff and courier tamper-evident verification.
            </p>
            <div className="bg-[#f2f3ff] p-2.5 rounded-lg border border-[#eaedff] flex flex-col gap-1 mt-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#6d7a77]">Current Escrow Balance:</span>
                <span className="font-headline font-bold text-[#131b2e]">$1,420,910.40</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#6d7a77]">Next Automated ACH Batch:</span>
                <span className="font-bold text-[#006947]">Today at 23:59 UTC</span>
              </div>
            </div>
          </div>

          {/* SuperAdmin Instant Triggers */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[#eaedff] flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00685f] text-[20px]">bolt</span>
              <h3 className="font-headline font-bold text-xs text-[#131b2e]">
                Platform Control Triggers
              </h3>
            </div>
            <p className="text-xs text-[#6d7a77]">
              Execute immediate platform operations across all 4 database shards and cache clusters.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={handleFlushCache}
                className="py-1.5 px-2 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#00685f] rounded-lg text-[11px] font-bold border border-[#eaedff] transition-colors"
              >
                Flush Drug Cache
              </button>
              <button
                onClick={() => showToast('Rotated JWT Token signing keys with 24h grace period.')}
                className="py-1.5 px-2 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#00685f] rounded-lg text-[11px] font-bold border border-[#eaedff] transition-colors"
              >
                Rotate JWT Keys
              </button>
              <button
                onClick={() => showToast('Generated SHA-256 DEA Title 21 compliance package: compliance_audit_2026.zip')}
                className="py-1.5 px-2 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#00685f] rounded-lg text-[11px] font-bold border border-[#eaedff] transition-colors"
              >
                Export DEA Audit
              </button>
              <button
                onClick={() => setIsProvisionModalOpen(true)}
                className="py-1.5 px-2 bg-[#00685f] hover:bg-[#008378] text-white rounded-lg text-[11px] font-bold transition-colors shadow-sm"
              >
                + New Tenant
              </button>
            </div>
          </div>
        </div>

        {/* Section 18 Immutable Audit Log Stream */}
        <section className="bg-white rounded-xl shadow-sm border border-[#eaedff] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00685f] text-[20px]">history_edu</span>
              <h2 className="font-headline font-bold text-sm text-[#131b2e]">
                Section 18 Immutable Audit Log Stream
              </h2>
            </div>
            <span className="text-[10px] text-[#6d7a77] font-data-mono">
              WORM Compliant • SHA-256 Hashed
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-lg bg-[#faf8ff] border border-[#eaedff] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-data-mono text-[10px] text-gray-500 font-bold">
                      {log.timestampUtc}
                    </span>
                    <span className="font-bold text-[#131b2e]">{log.type}</span>
                    <span className="bg-[#6ffbbe]/30 text-[#002113] text-[9px] font-bold px-1.5 py-0.2 rounded">
                      {log.statusBadge}
                    </span>
                  </div>
                  <p className="text-[#3d4947] mt-0.5">{log.summary}</p>
                  <span className="text-[10px] text-gray-400 font-data-mono truncate mt-0.5">
                    {log.actorOrTarget}
                  </span>
                </div>
                <div className="text-[10px] font-data-mono text-gray-400 bg-white px-2 py-1 rounded border border-gray-200 truncate max-w-[180px]">
                  {log.sha256.slice(0, 16)}...
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Provision New Tenant Modal */}
      {isProvisionModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-gray-100 flex flex-col gap-3 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00685f] text-[24px]">
                  add_business
                </span>
                <h3 className="font-headline font-bold text-base text-[#131b2e]">
                  Provision New Pharmacy Tenant
                </h3>
              </div>
              <button
                onClick={() => setIsProvisionModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-gray-700">Pharmacy Organization Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gotham City Medical Dispensary"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  className="bg-[#f2f3ff] border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#00685f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-700">Commercial Tier</label>
                  <select
                    value={newOrgTier}
                    onChange={(e) => setNewOrgTier(e.target.value as TenantOrg['tier'])}
                    className="bg-[#f2f3ff] border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#00685f]"
                  >
                    <option value="Standard Partner">Standard Partner</option>
                    <option value="Enterprise Tier">Enterprise Tier</option>
                    <option value="Regional Partner">Regional Partner</option>
                    <option value="Starter Dispensary">Starter Dispensary</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-700">Database Shard</label>
                  <select
                    value={newOrgShard}
                    onChange={(e) => setNewOrgShard(e.target.value)}
                    className="bg-[#f2f3ff] border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#00685f]"
                  >
                    <option value="us-east-db-01">us-east-db-01 (Primary)</option>
                    <option value="us-east-db-02">us-east-db-02 (Regional)</option>
                    <option value="us-east-db-03">us-east-db-03 (High Density)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-gray-700">DEA Registration / State License #</label>
                <input
                  type="text"
                  placeholder="e.g. NY-RX-884920-DEA"
                  value={newOrgDea}
                  onChange={(e) => setNewOrgDea(e.target.value)}
                  className="bg-[#f2f3ff] border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#00685f]"
                />
              </div>

              <div className="bg-[#f2f3ff] p-2.5 rounded-lg border border-[#eaedff] flex items-center gap-2 text-gray-600">
                <span className="material-symbols-outlined text-[#006947] text-[18px]">verified</span>
                <span>Automated DDL isolation schema will be applied to selected shard.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsProvisionModalOpen(false)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#00685f] hover:bg-[#008378] text-white font-bold rounded-lg shadow-sm"
                >
                  Deploy & Provision Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* System Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#131b2e] text-white px-4 py-2.5 rounded-xl shadow-2xl z-50 flex items-center gap-2 text-xs font-medium border border-gray-700 animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-[#6ffbbe] text-[18px]">shield</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
