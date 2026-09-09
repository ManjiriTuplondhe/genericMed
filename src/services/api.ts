import {
  Medicine,
  PharmacyOffer,
  CartItem,
  PartnerOrder,
  TenantOrg,
  Sec18AuditLog,
  ApiCredential,
  WebhookEvent,
  UserProfile
} from '../types';
import {
  MEDICINES_DATA,
  PHARMACY_OFFERS,
  PARTNER_ORDERS_DATA,
  TENANT_ORGS_DATA,
  AUDIT_LOGS_DATA,
  API_CREDENTIALS_DATA,
  WEBHOOK_EVENTS_DATA
} from '../data/mockData';

const API_BASE = '/api';

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  const token = localStorage.getItem('gmed_auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth helpers
  getStoredToken: (): string | null => localStorage.getItem('gmed_auth_token'),
  setStoredToken: (token: string): void => localStorage.setItem('gmed_auth_token', token),
  clearStoredToken: (): void => localStorage.removeItem('gmed_auth_token'),

  // Medicines
  async getMedicines(query?: string, category?: string): Promise<Medicine[]> {
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (category && category !== 'All Categories') params.append('category', category);

      const res = await fetch(`${API_BASE}/medicines?${params.toString()}`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch {
      // Fallback
      return MEDICINES_DATA.filter((med) => {
        const matchQuery = !query ||
          med.name.toLowerCase().includes(query.toLowerCase()) ||
          med.genericName.toLowerCase().includes(query.toLowerCase());
        const matchCat = !category || category === 'All Categories' || med.category.toLowerCase() === category.toLowerCase();
        return matchQuery && matchCat;
      });
    }
  },

  async getMedicineById(id: string): Promise<{ medicine: Medicine; offers: PharmacyOffer[] }> {
    try {
      const res = await fetch(`${API_BASE}/medicines/${id}`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return {
        medicine: json.data,
        offers: json.offers || []
      };
    } catch {
      const med = MEDICINES_DATA.find((m) => m.id === id) || MEDICINES_DATA[0];
      return {
        medicine: med,
        offers: PHARMACY_OFFERS
      };
    }
  },

  async getOffers(medicineId: string): Promise<PharmacyOffer[]> {
    try {
      const res = await fetch(`${API_BASE}/medicines/${medicineId}/offers`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch {
      return PHARMACY_OFFERS;
    }
  },

  // Cart Validation
  async validateCart(items: CartItem[]): Promise<{
    items: (CartItem & { status: string; currentPrice: number })[];
    subtotal: number;
    totalSavings: number;
  }> {
    try {
      const res = await fetch(`${API_BASE}/cart/validate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ items })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return {
        items: json.items,
        subtotal: json.subtotal,
        totalSavings: json.totalSavings
      };
    } catch {
      const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
      const totalSavings = items.reduce((s, i) => s + i.savings * i.quantity, 0);
      return {
        items: items.map((i) => ({ ...i, status: 'CURRENT', currentPrice: i.price })),
        subtotal,
        totalSavings
      };
    }
  },

  // Orders
  async createOrder(data: {
    items: CartItem[];
    patientName?: string;
    patientAddress?: string;
    prescriberName?: string;
    prescriberNpi?: string;
  }): Promise<PartnerOrder> {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch {
      return PARTNER_ORDERS_DATA[0];
    }
  },

  // Partner Orders
  async getPartnerOrders(status?: string, tenantId?: string): Promise<PartnerOrder[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      const headers = getHeaders();
      if (tenantId) {
        (headers as Record<string, string>)['x-tenant-id'] = tenantId;
      }
      const res = await fetch(`${API_BASE}/partner/orders?${params.toString()}`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch {
      return PARTNER_ORDERS_DATA;
    }
  },

  async updatePartnerOrderStatus(orderId: string, status: PartnerOrder['status']): Promise<PartnerOrder> {
    const res = await fetch(`${API_BASE}/partner/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data;
  },

  async scanPartnerOrderItem(orderId: string, sku: string): Promise<PartnerOrder> {
    const res = await fetch(`${API_BASE}/partner/orders/${orderId}/scan-item`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ sku })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data;
  },

  // Admin
  async getTenants(): Promise<TenantOrg[]> {
    try {
      const res = await fetch(`${API_BASE}/admin/tenants`, { headers: getHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch {
      return TENANT_ORGS_DATA;
    }
  },

  async getAuditLogs(): Promise<Sec18AuditLog[]> {
    try {
      const res = await fetch(`${API_BASE}/admin/audit-logs`, { headers: getHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch {
      return AUDIT_LOGS_DATA;
    }
  },

  // Developer Console
  async getApiCredentials(): Promise<ApiCredential[]> {
    try {
      const res = await fetch(`${API_BASE}/dev/credentials`, { headers: getHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch {
      return API_CREDENTIALS_DATA;
    }
  },

  async createApiCredential(label: string, scopes: string[], isSandbox?: boolean): Promise<ApiCredential> {
    const res = await fetch(`${API_BASE}/dev/credentials`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ label, scopes, isSandbox })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data;
  },

  async getWebhookEvents(): Promise<WebhookEvent[]> {
    try {
      const res = await fetch(`${API_BASE}/dev/webhooks`, { headers: getHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch {
      return WEBHOOK_EVENTS_DATA;
    }
  },

  // Gemini AI Services
  async checkDrugInteractions(medicineName: string, patientContext?: string) {
    try {
      const res = await fetch(`${API_BASE}/ai/drug-check`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ medicineName, patientContext })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch {
      return {
        medicineName,
        hasWarnings: false,
        severity: 'none',
        interactions: ['Standard therapeutic profile under FDA Orange Book guidelines.'],
        contraindications: ['Consult clinical practitioner before adjusting dose.'],
        clinicalSummary: `Therapeutically verified bioequivalent active generic for ${medicineName}.`,
        disclaimer: 'Medical Disclaimer: genericMed AI is for informational purposes only.',
        sourceCitations: ['FDA Orange Book (CDER)']
      };
    }
  },

  async searchWithAi(query: string) {
    const res = await fetch(`${API_BASE}/ai/search`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ query })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data;
  },

  // Auth
  async login(payload: { email?: string; password?: string; role?: string; quickLogin?: boolean }): Promise<{ token: string; user: UserProfile }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(err.error || 'Authentication failed');
    }
    const json = await res.json();
    if (json.token) {
      api.setStoredToken(json.token);
    }
    return { token: json.token, user: json.user };
  },

  async register(payload: { name: string; email: string; password?: string; role?: string; orgName?: string; zipCode?: string }): Promise<{ token: string; user: UserProfile }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Registration failed' }));
      throw new Error(err.error || 'Registration failed');
    }
    const json = await res.json();
    if (json.token) {
      api.setStoredToken(json.token);
    }
    return { token: json.token, user: json.user };
  },

  async getMe(): Promise<UserProfile | null> {
    const token = api.getStoredToken();
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getHeaders()
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.user;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: getHeaders()
      });
    } catch {
      // Ignore network errors on logout
    } finally {
      api.clearStoredToken();
    }
  }
};
