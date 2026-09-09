import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PlatformAnalytics } from '../types';

interface Props {
  onBackToOverview?: () => void;
  onOpenOnboarding?: () => void;
}

export const AdminAnalyticsDashboard: React.FC<Props> = ({ onBackToOverview, onOpenOnboarding }) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.getPlatformAnalytics(timeframe).then((data) => {
      if (mounted) {
        setAnalytics(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [timeframe]);

  const handleExportCsv = () => {
    if (!analytics) return;
    const headers = 'Date,GMV_USD,Patient_Savings_USD,Orders_Count\n';
    const rows = analytics.timeSeries.map((p) => `${p.date},${p.gmv},${p.patientSavings},${p.orderCount}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genericMed_analytics_${timeframe}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  if (loading || !analytics) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-surface-container-lowest dark:bg-slate-900 rounded-3xl border border-outline-variant/30 min-h-[450px]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-body-lg font-bold text-on-surface dark:text-white">Calculating platform performance analytics...</p>
        <p className="text-body-sm text-on-surface-variant dark:text-slate-400">Aggregating shard transactions and SEC-18 ledger entries</p>
      </div>
    );
  }

  const { metrics, timeSeries, categoryBreakdown, slaDistribution, topPerformingTenants } = analytics;

  // SVG Chart Dimensions & Scalers
  const chartHeight = 220;
  const chartWidth = 720;
  const maxGmv = Math.max(...timeSeries.map((p) => p.gmv), 1000);
  const maxSavings = Math.max(...timeSeries.map((p) => p.patientSavings), 5000);

  const pointsGmv = timeSeries.map((p, i) => {
    const x = (i / (timeSeries.length - 1 || 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - (p.gmv / maxGmv) * (chartHeight - 40) - 20;
    return `${x},${y}`;
  }).join(' ');

  const pointsSavings = timeSeries.map((p, i) => {
    const x = (i / (timeSeries.length - 1 || 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - (p.patientSavings / maxSavings) * (chartHeight - 40) - 20;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-3xl border border-outline-variant/30 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-2xl">monitoring</span>
            <h2 className="text-headline-sm font-bold text-on-surface dark:text-white">Platform Intelligence & Analytics</h2>
          </div>
          <p className="text-body-sm text-on-surface-variant dark:text-slate-400">
            Real-time telemetry, gross merchandise volume (GMV), and multi-tenant SLA compliance
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timeframe selector */}
          <div className="inline-flex p-1 bg-surface-container-high dark:bg-slate-800 rounded-xl border border-outline-variant/30">
            {(['7d', '30d', '90d'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg text-label-md font-bold transition-all ${
                  timeframe === tf
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant dark:text-slate-300 hover:text-on-surface'
                }`}
              >
                {tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-4 py-2 bg-surface-container-highest dark:bg-slate-800 hover:bg-surface-variant text-on-surface dark:text-white rounded-xl text-label-md font-bold transition-all border border-outline-variant/30"
            title="Export CSV audit dataset"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            <span>{downloadSuccess ? 'Downloaded!' : 'Export CSV'}</span>
          </button>

          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary rounded-xl text-label-md font-bold shadow-sm hover:shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-lg">add_business</span>
              <span>Onboard Pharmacy</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-surface-container-lowest dark:bg-slate-900 rounded-3xl border border-outline-variant/30 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-label-md font-bold text-on-surface-variant dark:text-slate-400">Total GMV</span>
            <span className="p-2 bg-primary/10 text-primary rounded-xl material-symbols-outlined text-xl">payments</span>
          </div>
          <div className="text-display-sm font-extrabold text-on-surface dark:text-white mb-1">
            ${metrics.totalGmv.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 text-label-sm font-bold text-emerald-600 dark:text-emerald-400">
            <span className="material-symbols-outlined text-base">trending_up</span>
            <span>+{metrics.gmvChangePercent}% vs prior period</span>
          </div>
        </div>

        <div className="p-6 bg-surface-container-lowest dark:bg-slate-900 rounded-3xl border border-outline-variant/30 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-label-md font-bold text-on-surface-variant dark:text-slate-400">Patient Savings</span>
            <span className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl material-symbols-outlined text-xl">savings</span>
          </div>
          <div className="text-display-sm font-extrabold text-emerald-600 dark:text-emerald-400 mb-1">
            ${metrics.totalPatientSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 text-label-sm font-bold text-emerald-600 dark:text-emerald-400">
            <span className="material-symbols-outlined text-base">trending_up</span>
            <span>+{metrics.savingsChangePercent}% direct generic savings</span>
          </div>
        </div>

        <div className="p-6 bg-surface-container-lowest dark:bg-slate-900 rounded-3xl border border-outline-variant/30 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-label-md font-bold text-on-surface-variant dark:text-slate-400">Mean Dispensing SLA</span>
            <span className="p-2 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl material-symbols-outlined text-xl">timer</span>
          </div>
          <div className="text-display-sm font-extrabold text-on-surface dark:text-white mb-1">
            {metrics.meanSlaMinutes} min
          </div>
          <div className="flex items-center gap-1.5 text-label-sm font-bold text-on-surface-variant dark:text-slate-400">
            <span className="material-symbols-outlined text-base text-emerald-600">verified</span>
            <span>Target: &lt;45 min (98.6% compliance)</span>
          </div>
        </div>

        <div className="p-6 bg-surface-container-lowest dark:bg-slate-900 rounded-3xl border border-outline-variant/30 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-label-md font-bold text-on-surface-variant dark:text-slate-400">SEC-18 Audit Rate</span>
            <span className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl material-symbols-outlined text-xl">verified_user</span>
          </div>
          <div className="text-display-sm font-extrabold text-purple-600 dark:text-purple-400 mb-1">
            {metrics.sec18ComplianceRate}%
          </div>
          <div className="flex items-center gap-1.5 text-label-sm font-bold text-on-surface-variant dark:text-slate-400">
            <span>{metrics.activeTenantsCount} active isolated shards</span>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Time Series Trend Chart (2 Cols) */}
        <div className="lg:col-span-2 p-6 bg-surface-container-lowest dark:bg-slate-900 rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-lg font-bold text-on-surface dark:text-white">Financial & Savings Volume Trends</h3>
              <p className="text-body-xs text-on-surface-variant dark:text-slate-400">
                Daily GMV trajectory vs. cumulative patient out-of-pocket generic savings
              </p>
            </div>
            <div className="flex items-center gap-4 text-label-sm font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-on-surface dark:text-slate-300">GMV Volume</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-on-surface dark:text-slate-300">Generic Savings</span>
              </div>
            </div>
          </div>

          {/* Interactive SVG Chart */}
          <div className="relative w-full overflow-x-auto">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-56 select-none overflow-visible">
              <defs>
                <linearGradient id="gmvGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#006a6a" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#006a6a" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0.25, 0.5, 0.75, 1].map((ratio, idx) => (
                <line
                  key={idx}
                  x1="20"
                  y1={chartHeight * (1 - ratio) + 10}
                  x2={chartWidth - 20}
                  y2={chartHeight * (1 - ratio) + 10}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                  className="dark:stroke-slate-800"
                />
              ))}

              {/* Area & Lines */}
              <polygon
                points={`20,${chartHeight - 20} ${pointsSavings} ${chartWidth - 20},${chartHeight - 20}`}
                fill="url(#savingsGradient)"
              />
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsSavings}
              />

              <polygon
                points={`20,${chartHeight - 20} ${pointsGmv} ${chartWidth - 20},${chartHeight - 20}`}
                fill="url(#gmvGradient)"
              />
              <polyline
                fill="none"
                stroke="#006a6a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsGmv}
              />

              {/* Data Interactive Points */}
              {timeSeries.map((p, i) => {
                const x = (i / (timeSeries.length - 1 || 1)) * (chartWidth - 40) + 20;
                const yGmv = chartHeight - (p.gmv / maxGmv) * (chartHeight - 40) - 20;
                const isHovered = hoveredPoint === i;

                return (
                  <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)}>
                    <circle
                      cx={x}
                      cy={yGmv}
                      r={isHovered ? 6 : 3.5}
                      fill="#006a6a"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="transition-all duration-150"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip display */}
            {hoveredPoint !== null && timeSeries[hoveredPoint] && (
              <div
                className="absolute top-2 bg-slate-900 text-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl text-xs space-y-1 border border-slate-700 pointer-events-none transform -translate-x-1/2 transition-all z-10"
                style={{
                  left: `${((hoveredPoint / (timeSeries.length - 1 || 1)) * 100)}%`
                }}
              >
                <p className="font-bold text-slate-300">{timeSeries[hoveredPoint].date} ({timeSeries[hoveredPoint].label})</p>
                <p className="text-teal-300 font-extrabold">GMV: ${timeSeries[hoveredPoint].gmv.toLocaleString()}</p>
                <p className="text-emerald-400 font-extrabold">Savings: ${timeSeries[hoveredPoint].patientSavings.toLocaleString()}</p>
                <p className="text-slate-400 font-semibold">{timeSeries[hoveredPoint].orderCount} Dispensary Orders</p>
              </div>
            )}
          </div>

          {/* Timeline range labels */}
          <div className="flex justify-between text-body-xs font-semibold text-on-surface-variant dark:text-slate-400 px-2">
            <span>{timeSeries[0]?.label}</span>
            <span>{timeSeries[Math.floor(timeSeries.length / 2)]?.label}</span>
            <span>{timeSeries[timeSeries.length - 1]?.label}</span>
          </div>
        </div>

        {/* SLA & Fulfillment Distribution (1 Col) */}
        <div className="p-6 bg-surface-container-lowest dark:bg-slate-900 rounded-3xl border border-outline-variant/30 shadow-sm space-y-5">
          <div>
            <h3 className="text-title-lg font-bold text-on-surface dark:text-white">Fulfillment SLA Breakdown</h3>
            <p className="text-body-xs text-on-surface-variant dark:text-slate-400">Order delivery speed distribution</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-label-md font-bold mb-1.5 text-on-surface dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>&lt; 1 Hour Express</span>
                </span>
                <span>{slaDistribution.under1Hour}%</span>
              </div>
              <div className="w-full h-2.5 bg-surface-container-high dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${slaDistribution.under1Hour}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-label-md font-bold mb-1.5 text-on-surface dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span>1 - 2 Hours Standard</span>
                </span>
                <span>{slaDistribution.under2Hours}%</span>
              </div>
              <div className="w-full h-2.5 bg-surface-container-high dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${slaDistribution.under2Hours}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-label-md font-bold mb-1.5 text-on-surface dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>2 - 4 Hours Same-Day</span>
                </span>
                <span>{slaDistribution.under4Hours}%</span>
              </div>
              <div className="w-full h-2.5 bg-surface-container-high dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${slaDistribution.under4Hours}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-label-md font-bold mb-1.5 text-on-surface dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>SLA Breached (&gt; 4h)</span>
                </span>
                <span>{slaDistribution.breached}%</span>
              </div>
              <div className="w-full h-2.5 bg-surface-container-high dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${slaDistribution.breached}%` }} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-surface-container-high dark:bg-slate-800/80 rounded-2xl border border-outline-variant/30 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">shield</span>
            <div className="text-body-xs text-on-surface-variant dark:text-slate-300">
              <span className="font-bold text-on-surface dark:text-white">Automated SLA Guard</span> actively routes orders to nearest nodes when backlog passes 80% capacity.
            </div>
          </div>
        </div>
      </div>

      {/* Category Volume & Top Tenant Rankings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="p-6 bg-surface-container-lowest dark:bg-slate-900 rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
          <h3 className="text-title-lg font-bold text-on-surface dark:text-white">Therapeutic Category Share</h3>
          <div className="space-y-3">
            {categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="p-4 bg-surface-container-high/60 dark:bg-slate-800/60 rounded-2xl border border-outline-variant/20 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-label-lg font-bold text-on-surface dark:text-white">{cat.category}</span>
                  </div>
                  <p className="text-body-xs text-on-surface-variant dark:text-slate-400">
                    {cat.ordersCount.toLocaleString()} orders • ${cat.totalSavings.toLocaleString()} saved
                  </p>
                </div>
                <div className="text-title-md font-extrabold text-on-surface dark:text-white">
                  {cat.volumePercent}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Pharmacy Tenants */}
        <div className="p-6 bg-surface-container-lowest dark:bg-slate-900 rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
          <h3 className="text-title-lg font-bold text-on-surface dark:text-white">Top Pharmacy Fulfillers</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead>
                <tr className="border-b border-outline-variant/30 text-on-surface-variant dark:text-slate-400 text-label-sm">
                  <th className="pb-3 font-bold">Pharmacy</th>
                  <th className="pb-3 font-bold">Tier</th>
                  <th className="pb-3 font-bold">Monthly Orders</th>
                  <th className="pb-3 font-bold text-right">SLA Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {topPerformingTenants.map((ten, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-high/40 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-bold text-on-surface dark:text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-label-xs font-bold">
                        {idx + 1}
                      </span>
                      <span>{ten.name}</span>
                    </td>
                    <td className="py-3 text-body-xs text-on-surface-variant dark:text-slate-400">{ten.tier}</td>
                    <td className="py-3 font-bold text-on-surface dark:text-white">{ten.orders.toLocaleString()}</td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-label-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {ten.slaScore}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
