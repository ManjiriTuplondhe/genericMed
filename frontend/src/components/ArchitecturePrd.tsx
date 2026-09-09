import React, { useState } from 'react';

export const ArchitecturePrd: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'prd'>('architecture');
  const [selectedLayer, setSelectedLayer] = useState<number>(3);

  const layers = [
    {
      level: 1,
      name: 'Layer 1: Client & External Ingress',
      color: 'border-blue-500 bg-blue-50/50',
      tag: 'CLIENT TIER',
      components: [
        { title: 'Customer Web App', tech: 'React 19, Tailwind CSS v4, Motion', role: 'Drug search, bioequivalence comparison, cart price lock' },
        { title: 'Partner POS Terminal', tech: 'Desktop WebHID / Hardware Barcode', role: 'Dispensing pharmacist queue, NDC verification, tamper seals' },
        { title: 'Super Admin Cockpit', tech: 'Enterprise Root Portal', role: 'Tenant provisioning, schema isolation matrix, clearinghouse take rate' },
        { title: 'B2B Partner Integrations', tech: 'REST APIs, Webhooks, HMAC', role: 'Telehealth EHR systems, e-prescribing, inventory ingest' }
      ]
    },
    {
      level: 2,
      name: 'Layer 2: Edge & Security Perimeter',
      color: 'border-emerald-500 bg-emerald-50/50',
      tag: 'EDGE GATEWAY',
      components: [
        { title: 'Cloudflare Enterprise', tech: 'Global Anycast CDN', role: 'DDoS protection, TLS 1.3 termination, edge caching (89.2% hit)' },
        { title: 'WAF & Bot Management', tech: 'OWASP Top 10 Ruleset', role: 'Rate limiting (100 req/min/IP), token bucket throttle' },
        { title: 'Geo-Routing Proxy', tech: 'Edge Workers', role: 'Routes to closest US-East / US-Central cluster with <15ms latency' }
      ]
    },
    {
      level: 3,
      name: 'Layer 3: API Gateway & Tenant Router',
      color: 'border-teal-600 bg-teal-50/50',
      tag: 'ROUTING CORE',
      components: [
        { title: 'Tenant Identification Middleware', tech: 'Subdomain / JWT / Header', role: 'Resolves tenant slug e.g. tenant_carepoint_prod dynamically' },
        { title: 'Context Injection & Schema Switcher', tech: 'Postgres search_path', role: 'Enforces strict tenant isolation per database transaction' },
        { title: 'Auth & RBAC Service', tech: 'JWT, Scopes, DEA Credentials', role: 'Enforces Customer, Pharmacist, Partner, and SuperAdmin roles' }
      ]
    },
    {
      level: 4,
      name: 'Layer 4: Core Modular Monolith',
      color: 'border-indigo-500 bg-indigo-50/50',
      tag: 'BUSINESS LOGIC',
      components: [
        { title: 'Medicine & Pricing Engine', tech: 'FDA Orange Book AB Matcher', role: 'NDC master catalog, bioactive salt comparator, 92% savings calculator' },
        { title: 'Inventory & Order Manager', tech: '15-Min Batch Reservation Lock', role: 'Zero price slippage guard ($5 subsidy), courier dispatch tracking' },
        { title: 'Clearinghouse & Settlement', tech: 'Stripe Connect, ACH Escrow', role: 'Automatic 12% take rate deduction, 48h dispense signoff escrow' },
        { title: 'Audit & Compliance Logger', tech: 'DEA Title 21, HIPAA Sec 18', role: 'WORM-compliant immutable SHA-256 hash chains' }
      ]
    },
    {
      level: 5,
      name: 'Layer 5: Asynchronous & Event-Driven Backbone',
      color: 'border-amber-500 bg-amber-50/50',
      tag: 'QUEUES & EVENTS',
      components: [
        { title: 'Redis Pub/Sub & BullMQ', tech: 'Distributed Task Queues', role: 'Async prescription OCR, webhook dispatch, SMS courier tracking' },
        { title: 'Dead Letter Queue (DLQ)', tech: 'Exponential Backoff Retry', role: 'Automated retry with 72-hour partner outage tolerance' }
      ]
    },
    {
      level: 6,
      name: 'Layer 6: Persistence & Storage Tier',
      color: 'border-purple-500 bg-purple-50/50',
      tag: 'CANONICAL DATA',
      components: [
        { title: 'Multi-Tenant PostgreSQL', tech: 'Isolated Schemas + RLS', role: 'Dedicated tables per dispensary tenant with cross-tenant leak prevention' },
        { title: 'Redis In-Memory Cache', tech: 'Sub-millisecond KV store', role: 'Drug pricing matrix, active sessions, 15-min cart locks' },
        { title: 'S3 Prescription Vault', tech: 'AES-256 Encrypted Storage', role: 'DEA compliant prescription images, signed URLs (10-min expiry)' }
      ]
    }
  ];

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] min-h-screen flex flex-col font-body">
      {/* Header */}
      <header className="bg-white border-b border-[#eaedff] px-4 py-3 flex items-center justify-between sticky top-10 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00685f] text-[24px]">account_tree</span>
          <div>
            <h1 className="font-headline font-bold text-sm text-[#131b2e]">
              genericMed — System Architecture & PRD Blueprint
            </h1>
            <p className="text-[11px] text-[#6d7a77]">
              Multi-Tenant SaaS Platform for Online Generic Medicine Price Comparison & Dispensing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-[#f2f3ff] p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
              activeTab === 'architecture'
                ? 'bg-[#00685f] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            System Architecture
          </button>
          <button
            onClick={() => setActiveTab('prd')}
            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
              activeTab === 'prd'
                ? 'bg-[#00685f] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            PRD Specification (17pgs)
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4 max-w-6xl mx-auto w-full flex flex-col gap-5">
        {activeTab === 'architecture' ? (
          <>
            {/* Architecture Overview Banner */}
            <div className="bg-gradient-to-r from-[#00685f] to-[#006398] text-white p-4 rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  ENTERPRISE MULTI-TENANT TOPOLOGY
                </span>
                <h2 className="font-headline font-bold text-lg mt-1 text-white">
                  6-Layer Modular Monolith with Schema-Per-Tenant Isolation
                </h2>
                <p className="text-xs text-white/90 max-w-2xl mt-0.5">
                  Engineered to achieve &lt;15ms edge price lookups, zero price slippage, HIPAA Title II encryption, and strict DEA Sec 18 immutable dispensing audit trails.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/20 text-xs flex flex-col gap-1 min-w-[180px]">
                <div className="flex justify-between">
                  <span className="text-white/80">Architecture:</span>
                  <span className="font-bold">Modular Monolith</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Isolation Model:</span>
                  <span className="font-bold">Schema-per-Tenant</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Edge Cache Hit:</span>
                  <span className="font-bold text-[#6ffbbe]">89.2%</span>
                </div>
              </div>
            </div>

            {/* Interactive Architecture Layers Stack */}
            <div className="flex flex-col gap-3">
              {layers.map((layer) => {
                const isExpanded = selectedLayer === layer.level;
                return (
                  <div
                    key={layer.level}
                    className={`bg-white rounded-xl border p-4 shadow-sm transition-all cursor-pointer ${
                      isExpanded
                        ? `${layer.color} ring-2 ring-[#00685f]/30 shadow-md`
                        : 'border-[#eaedff] hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedLayer(layer.level)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#131b2e] text-white flex items-center justify-center font-data-mono font-bold text-xs">
                          {layer.level}
                        </span>
                        <h3 className="font-headline font-bold text-sm text-[#131b2e]">
                          {layer.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-[#eaedff] text-[#00685f] text-[10px] font-bold px-2 py-0.5 rounded font-data-mono">
                          {layer.tag}
                        </span>
                        <span className="material-symbols-outlined text-gray-400 text-[18px]">
                          {isExpanded ? 'expand_less' : 'expand_more'}
                        </span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-3 border-t border-gray-200">
                        {layer.components.map((comp, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs flex flex-col gap-1"
                          >
                            <span className="font-bold text-xs text-[#131b2e]">{comp.title}</span>
                            <span className="text-[10px] font-data-mono text-[#00685f] font-semibold">
                              {comp.tech}
                            </span>
                            <p className="text-[11px] text-[#6d7a77] leading-relaxed mt-0.5">
                              {comp.role}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* PRD Explorer Tab */
          <div className="bg-white rounded-xl shadow-sm border border-[#eaedff] p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h2 className="font-headline font-bold text-base text-[#131b2e]">
                  Product Requirements Document (PRD) — genericMed Platform
                </h2>
                <span className="text-xs text-[#6d7a77]">
                  Version 4.8.2 • Status: Approved for Production Deployment
                </span>
              </div>
              <span className="bg-[#6ffbbe]/30 text-[#002113] text-xs font-bold px-2.5 py-1 rounded-full">
                HIPAA / DEA COMPLIANT
              </span>
            </div>

            <div className="flex flex-col gap-4 text-xs text-[#3d4947] leading-relaxed">
              <section className="flex flex-col gap-1.5">
                <h3 className="font-headline font-bold text-sm text-[#131b2e]">
                  1. Executive Summary & Problem Statement
                </h3>
                <p>
                  American patients overpay by up to 92% for branded prescription medications (e.g. paying $180 for Lipitor instead of $12.80 for bioequivalent Atorvastatin Calcium). genericMed democratizes prescription pricing through a multi-tenant marketplace that connects consumers, licensed independent pharmacies, and telehealth systems directly using FDA Orange Book AB-rated equivalence tables.
                </p>
              </section>

              <section className="flex flex-col gap-1.5">
                <h3 className="font-headline font-bold text-sm text-[#131b2e]">
                  2. Core Functional Pillars
                </h3>
                <ul className="list-disc pl-5 flex flex-col gap-1">
                  <li>
                    <strong>Consumer Marketplace:</strong> Search by brand, generic active salt, or condition. Real-time comparator showing local stock, delivery SLAs, and verified patient reviews.
                  </li>
                  <li>
                    <strong>Drug Equivalency Detail Engine:</strong> Interactive bioequivalence cards with dosage configuration, real-time pricing benchmarks, and guaranteed counter pricing.
                  </li>
                  <li>
                    <strong>15-Minute Dynamic Price Lock:</strong> Prevents price slippage at checkout with an automated $5.00 platform reserve subsidy.
                  </li>
                  <li>
                    <strong>Pharmacy Dispensing Workstation:</strong> WebHID handheld hardware barcode scanning, electronic DEA compliance verification, tamper-evident bag sealing, and courier dispatch staging.
                  </li>
                  <li>
                    <strong>Multi-Tenant Root SuperAdmin Suite:</strong> Tenant provisioning with schema-per-tenant isolation, real-time clearinghouse take rate tuning (12.0%), and WORM-compliant Sec 18 audit logging.
                  </li>
                  <li>
                    <strong>B2B Developer API Platform:</strong> Telehealth EHR ingestion via high-throughput REST endpoints (&lt;15ms latency) and webhook event streaming.
                  </li>
                </ul>
              </section>

              <section className="flex flex-col gap-1.5">
                <h3 className="font-headline font-bold text-sm text-[#131b2e]">
                  3. Key Non-Functional & Regulatory Constraints
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                  <div className="bg-[#f2f3ff] p-3 rounded-lg border border-[#eaedff]">
                    <div className="font-bold text-[#131b2e] mb-0.5">HIPAA Security Rule</div>
                    <p className="text-[11px] text-gray-600">
                      All e-prescriptions and PHI encrypted in transit (TLS 1.3) and at rest (AES-256). Signed URLs expire in 10 minutes.
                    </p>
                  </div>
                  <div className="bg-[#f2f3ff] p-3 rounded-lg border border-[#eaedff]">
                    <div className="font-bold text-[#131b2e] mb-0.5">DEA Title 21 CFR § 1311</div>
                    <p className="text-[11px] text-gray-600">
                      Digital signature validation for electronic prescriptions, lead pharmacist sign-off, and immutable audit logging.
                    </p>
                  </div>
                  <div className="bg-[#f2f3ff] p-3 rounded-lg border border-[#eaedff]">
                    <div className="font-bold text-[#131b2e] mb-0.5">FDA Orange Book AB Rating</div>
                    <p className="text-[11px] text-gray-600">
                      Only bioequivalent generic salts carrying AB or approved therapeutic ratings are surfaced for automatic substitution.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
