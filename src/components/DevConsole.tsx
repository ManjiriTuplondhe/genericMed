import React, { useState } from 'react';
import { API_CREDENTIALS_DATA, WEBHOOK_EVENTS_DATA } from '../data/mockData';
import { ApiCredential, WebhookEvent } from '../types';

export const DevConsole: React.FC = () => {
  const [credentials, setCredentials] = useState<ApiCredential[]>(API_CREDENTIALS_DATA);
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>(WEBHOOK_EVENTS_DATA);
  const [environment, setEnvironment] = useState<'live' | 'sandbox'>('live');
  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'python' | 'nodejs'>('curl');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Playground state
  const [requestPayload, setRequestPayload] = useState<string>(
    JSON.stringify(
      {
        query: 'Atorvastatin',
        dosage: '20mg',
        user_location: {
          lat: 40.6928,
          lng: -73.9903,
          radius_miles: 5
        },
        include_out_of_stock: false
      },
      null,
      2
    )
  );

  const [isLoadingResponse, setIsLoadingResponse] = useState<boolean>(false);
  const [responseOutput, setResponseOutput] = useState<any>({
    status: 'success',
    timestamp: '2026-09-08T14:52:10.192Z',
    latency_ms: 12.4,
    cache_state: 'REDIS_HIT_EDGE',
    data: {
      canonical_drug: {
        name: 'Atorvastatin Calcium',
        strength: '20mg',
        equivalent_brand: 'Lipitor®',
        fda_orange_book_rating: 'AB',
        ndc: '00093-7155-98'
      },
      benchmark_retail_price: 180.00,
      lowest_network_price: 12.80,
      savings_percentage: 92.8,
      verified_pharmacies_count: 4,
      offers: [
        {
          pharmacy_node_id: 'US-CP-049',
          name: 'CarePoint Pharmacy & Medical',
          price: 12.80,
          in_stock: true,
          estimated_delivery_sla_minutes: 120,
          distance_miles: 1.4
        },
        {
          pharmacy_node_id: 'US-APL-9401',
          name: 'Apollo MedCorp',
          price: 14.20,
          in_stock: true,
          estimated_delivery_sla_minutes: 45,
          distance_miles: 0.8
        }
      ]
    }
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendRequest = () => {
    setIsLoadingResponse(true);
    setTimeout(() => {
      setIsLoadingResponse(false);
      try {
        const parsed = JSON.parse(requestPayload);
        setResponseOutput({
          status: 'success',
          timestamp: new Date().toISOString(),
          latency_ms: Math.round(10 + Math.random() * 8),
          cache_state: 'REDIS_HIT_EDGE',
          data: {
            query: parsed.query,
            canonical_drug: {
              name: parsed.query.includes('Metformin')
                ? 'Metformin HCl ER'
                : 'Atorvastatin Calcium',
              strength: parsed.dosage || '20mg',
              equivalent_brand: parsed.query.includes('Metformin') ? 'Glucophage XR®' : 'Lipitor®',
              fda_orange_book_rating: 'AB',
              ndc: '00093-7155-98'
            },
            benchmark_retail_price: parsed.query.includes('Metformin') ? 42.50 : 180.00,
            lowest_network_price: parsed.query.includes('Metformin') ? 6.90 : 12.80,
            savings_percentage: 92.8,
            verified_pharmacies_count: 4,
            offers: [
              {
                pharmacy_node_id: 'US-CP-049',
                name: 'CarePoint Pharmacy & Medical',
                price: parsed.query.includes('Metformin') ? 6.90 : 12.80,
                in_stock: true,
                estimated_delivery_sla_minutes: 120,
                distance_miles: 1.4
              }
            ]
          }
        });
        showToast('API Request executed successfully (200 OK • 12ms latency)');
      } catch (err) {
        alert('Invalid JSON in request payload.');
      }
    }, 450);
  };

  const handleSendTestWebhook = () => {
    const newEvt: WebhookEvent = {
      id: `evt_${Math.floor(100000 + Math.random() * 900000)}`,
      topic: 'order.dispensed',
      entityContext: 'Order #GM-88241',
      targetEndpoint: 'https://api.healthbridge.io/webhooks/listener',
      responseCode: 200,
      latencyMs: 38,
      dispatchedAgo: 'Just now'
    };
    setWebhookEvents((prev) => [newEvt, ...prev]);
    showToast('Test Webhook Ping sent! Received HTTP 200 OK from HealthBridge listener.');
  };

  const codeSnippets = {
    curl: `curl -X POST "https://api.genericmed.com/v1/medicines/search-and-compare" \\
  -H "Authorization: Bearer gmed_live_89f2****************4a91" \\
  -H "Content-Type: application/json" \\
  -d '${requestPayload.replace(/\n/g, '')}'`,
    python: `import requests

url = "https://api.genericmed.com/v1/medicines/search-and-compare"
headers = {
    "Authorization": "Bearer gmed_live_89f2****************4a91",
    "Content-Type": "application/json"
}
payload = ${requestPayload}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
    nodejs: `import axios from 'axios';

const response = await axios.post(
  'https://api.genericmed.com/v1/medicines/search-and-compare',
  ${requestPayload},
  {
    headers: {
      'Authorization': 'Bearer gmed_live_89f2****************4a91',
      'Content-Type': 'application/json'
    }
  }
);
console.log(response.data);`
  };

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] min-h-screen flex flex-col font-body">
      {/* Top Header */}
      <header className="bg-[#131b2e] text-white border-b border-[#283044] px-4 py-2.5 flex items-center justify-between sticky top-10 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00685f]"></span>
            <span className="font-headline font-bold text-sm text-white">
              genericMed Developer Console
            </span>
            <span className="bg-[#00685f] text-white text-[10px] font-bold px-2 py-0.5 rounded font-data-mono">
              B2B ENTERPRISE
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-[#283044] p-1 rounded-lg text-xs">
            <button
              onClick={() => setEnvironment('live')}
              className={`px-2.5 py-0.5 rounded font-bold transition-all ${
                environment === 'live'
                  ? 'bg-[#00685f] text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Production
            </button>
            <button
              onClick={() => setEnvironment('sandbox')}
              className={`px-2.5 py-0.5 rounded font-bold transition-all ${
                environment === 'sandbox'
                  ? 'bg-[#006398] text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sandbox
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="hidden md:flex items-center gap-2 text-gray-400">
            <span>Client ID:</span>
            <span className="font-data-mono text-[#6ffbbe] font-bold">pub_cli_hb9921</span>
            <span>(HealthBridge Telehealth Systems Inc.)</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#6ffbbe] bg-[#283044] px-2.5 py-1 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6ffbbe]"></span>
            <span>API SLA: 99.99%</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="p-4 flex flex-col gap-4 max-w-7xl mx-auto w-full">
        {/* KPI Metrics Ribbon */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-xl shadow-sm border border-[#eaedff] flex flex-col">
            <span className="text-[11px] text-[#6d7a77] font-medium">Monthly API Calls</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-headline font-bold text-xl text-[#131b2e]">4.89M</span>
              <span className="text-[10px] text-[#00685f] font-bold">/ 10.0M quota</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-gray-100 mt-2 overflow-hidden">
              <div className="w-[48.9%] h-full bg-[#00685f] rounded-full"></div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl shadow-sm border border-[#eaedff] flex flex-col">
            <span className="text-[11px] text-[#6d7a77] font-medium">Average Edge Latency</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-headline font-bold text-xl text-[#006947]">14.2ms</span>
              <span className="text-[10px] text-[#006947] font-bold">Global P95</span>
            </div>
            <span className="text-[10px] text-[#6d7a77] mt-2">Cloudflare Enterprise Edge</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl shadow-sm border border-[#eaedff] flex flex-col">
            <span className="text-[11px] text-[#6d7a77] font-medium">Webhook Delivery SLA</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-headline font-bold text-xl text-[#00685f]">99.98%</span>
              <span className="text-[10px] text-[#006947] font-bold">0 Drop</span>
            </div>
            <span className="text-[10px] text-[#6d7a77] mt-2">48 retries auto-cleared in DLQ</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl shadow-sm border border-[#eaedff] flex flex-col">
            <span className="text-[11px] text-[#6d7a77] font-medium">Active Credentials</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-headline font-bold text-xl text-[#131b2e]">
                {credentials.length}
              </span>
              <span className="text-[10px] text-[#00685f] font-bold">2 Live / 1 Sand</span>
            </div>
            <span className="text-[10px] text-[#6d7a77] mt-2">mTLS & HMAC-SHA256</span>
          </div>
        </section>

        {/* Provisioned Client Credentials Table */}
        <section className="bg-white rounded-xl shadow-sm border border-[#eaedff] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline font-bold text-sm text-[#131b2e]">
                Provisioned API Keys & Scopes
              </h2>
              <p className="text-xs text-[#6d7a77]">
                Authenticated B2B access credentials with granular permission scopes
              </p>
            </div>
            <button
              onClick={() => showToast('Generated new sandbox API key token!')}
              className="px-3 py-1.5 bg-[#00685f] hover:bg-[#008378] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Generate API Key</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-[#6d7a77] uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-2.5 px-3">Credential Label</th>
                  <th className="py-2.5 px-3">Key Prefix</th>
                  <th className="py-2.5 px-3">Active Scopes</th>
                  <th className="py-2.5 px-3">Last Dispatched</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {credentials.map((cred) => (
                  <tr key={cred.id} className="hover:bg-[#faf8ff] transition-colors">
                    <td className="py-2.5 px-3 font-bold text-[#131b2e] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#00685f] text-[16px]">
                        {cred.icon}
                      </span>
                      <span>{cred.label}</span>
                    </td>
                    <td className="py-2.5 px-3 font-data-mono text-[#006398] font-bold">
                      {cred.keyPrefix}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {cred.scopes.map((s, idx) => (
                          <span
                            key={idx}
                            className="bg-[#f2f3ff] text-[#00685f] text-[10px] font-bold px-1.5 py-0.5 rounded"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-[#6d7a77]">{cred.lastDispatched}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          cred.status === 'ACTIVE'
                            ? 'bg-[#6ffbbe]/30 text-[#002113]'
                            : 'bg-[#cce5ff] text-[#00476e]'
                        }`}
                      >
                        {cred.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => showToast(`Copied token ${cred.keyPrefix} to clipboard!`)}
                          className="px-2 py-1 bg-[#f2f3ff] text-[#00685f] hover:bg-[#eaedff] rounded text-[10px] font-bold transition-colors"
                        >
                          Copy
                        </button>
                        <button
                          onClick={() => showToast(`Rotated secret key for ${cred.label}!`)}
                          className="px-2 py-1 bg-white text-gray-700 hover:bg-gray-100 rounded text-[10px] font-bold border border-gray-200 transition-colors"
                        >
                          Rotate
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Interactive API Playground */}
        <section className="bg-white rounded-xl shadow-sm border border-[#eaedff] p-4 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-headline font-bold text-sm text-[#131b2e]">
                Interactive API Explorer & Testing Sandbox
              </h2>
              <p className="text-xs text-[#6d7a77]">
                Execute live requests against the generic medicine search & bioequivalence comparator
              </p>
            </div>
            <div className="flex items-center gap-1 bg-[#f2f3ff] p-1 rounded-lg">
              {(['curl', 'python', 'nodejs'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-2.5 py-1 rounded text-xs font-bold uppercase transition-all ${
                    selectedLanguage === lang
                      ? 'bg-[#00685f] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Endpoint Bar */}
          <div className="bg-[#131b2e] text-white p-2.5 rounded-lg flex items-center gap-2 font-data-mono text-xs">
            <span className="bg-[#00855b] text-white px-2 py-0.5 rounded font-bold">POST</span>
            <span className="text-gray-300 flex-1 truncate">
              https://api.genericmed.com/v1/medicines/search-and-compare
            </span>
            <button
              disabled={isLoadingResponse}
              onClick={handleSendRequest}
              className="px-3 py-1 bg-[#00685f] hover:bg-[#008378] text-white font-bold rounded flex items-center gap-1 text-xs transition-colors disabled:opacity-50"
            >
              {isLoadingResponse ? (
                <>
                  <span className="material-symbols-outlined text-[14px] animate-spin">refresh</span>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[14px]">send</span>
                  <span>Send Request</span>
                </>
              )}
            </button>
          </div>

          {/* Code Snippet & Request/Response Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Left: Request Payload */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#131b2e]">
                  Request Body (JSON Payload)
                </span>
                <span className="text-[11px] text-gray-500 font-data-mono">
                  application/json
                </span>
              </div>
              <textarea
                value={requestPayload}
                onChange={(e) => setRequestPayload(e.target.value)}
                rows={11}
                className="w-full bg-[#131b2e] text-[#6ffbbe] font-data-mono text-xs p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-1 focus:ring-[#00685f] resize-none"
              />
            </div>

            {/* Right: Live Response Output */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#131b2e]">Response Output</span>
                  <span className="bg-[#006947] text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                    200 OK
                  </span>
                  <span className="text-[10px] text-[#006947] font-bold font-data-mono">
                    {responseOutput.latency_ms}ms
                  </span>
                  <span className="bg-[#eaedff] text-[#00685f] text-[10px] font-bold px-1.5 py-0.2 rounded font-data-mono">
                    REDIS_HIT
                  </span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(responseOutput, null, 2));
                    showToast('Response JSON copied to clipboard!');
                  }}
                  className="text-[11px] text-[#00685f] font-bold hover:underline"
                >
                  Copy JSON
                </button>
              </div>
              <pre className="w-full bg-[#131b2e] text-[#89f5e7] font-data-mono text-xs p-3 rounded-lg border border-gray-700 overflow-y-auto max-h-[240px]">
                {JSON.stringify(responseOutput, null, 2)}
              </pre>
            </div>
          </div>

          {/* Generated Code Preview */}
          <div className="bg-[#faf8ff] rounded-lg p-3 border border-[#eaedff] flex flex-col gap-1">
            <span className="text-[11px] font-bold text-[#3d4947] uppercase tracking-wider">
              Sample {selectedLanguage.toUpperCase()} Code
            </span>
            <pre className="text-xs font-data-mono text-[#131b2e] bg-white p-2.5 rounded border border-gray-200 overflow-x-auto">
              {codeSnippets[selectedLanguage]}
            </pre>
          </div>
        </section>

        {/* Webhooks & Event Stream */}
        <section className="bg-white rounded-xl shadow-sm border border-[#eaedff] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline font-bold text-sm text-[#131b2e]">
                Webhook Subscriptions & Delivery Log
              </h2>
              <p className="text-xs text-[#6d7a77]">
                Real-time push notifications delivered on prescription verification, price lock, and courier dispatch
              </p>
            </div>
            <button
              onClick={handleSendTestWebhook}
              className="px-3 py-1.5 bg-[#006398] hover:bg-[#00476e] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">sensors</span>
              <span>Test Webhook Ping</span>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {webhookEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-[#faf8ff] p-2.5 rounded-lg border border-[#eaedff] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00685f] text-[18px]">
                    call_made
                  </span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#131b2e] font-data-mono">{evt.topic}</span>
                      <span className="text-[10px] text-gray-500 font-medium">({evt.entityContext})</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-data-mono">
                      {evt.targetEndpoint}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="bg-[#006947] text-white font-bold text-[10px] px-1.5 py-0.2 rounded font-data-mono">
                    HTTP {evt.responseCode}
                  </span>
                  <span className="font-data-mono text-[10px] text-gray-500 font-bold">
                    {evt.latencyMs}ms
                  </span>
                  <span className="text-[10px] text-gray-400">{evt.dispatchedAgo}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Floating System Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#131b2e] text-white px-4 py-2.5 rounded-xl shadow-2xl z-50 flex items-center gap-2 text-xs font-medium border border-gray-700 animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-[#6ffbbe] text-[18px]">code</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
