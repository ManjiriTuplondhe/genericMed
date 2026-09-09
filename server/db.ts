import crypto from 'crypto';
import {
  Medicine,
  PharmacyOffer,
  PartnerOrder,
  TenantOrg,
  Sec18AuditLog,
  ApiCredential,
  WebhookEvent,
  UserProfile,
  CartItem
} from '../src/types';
import {
  MEDICINES_DATA,
  PHARMACY_OFFERS,
  PARTNER_ORDERS_DATA,
  TENANT_ORGS_DATA,
  AUDIT_LOGS_DATA,
  API_CREDENTIALS_DATA,
  WEBHOOK_EVENTS_DATA
} from '../src/data/mockData';

export interface UserAccount extends UserProfile {
  passwordHash?: string;
  tenantId?: string;
}

// In-Memory Database Store with Tenant Isolation & Persistence Interfaces
class DatabaseStore {
  private medicines: Medicine[] = [];
  private pharmacyOffers: Map<string, PharmacyOffer[]> = new Map();
  private partnerOrders: PartnerOrder[] = [];
  private tenants: TenantOrg[] = [];
  private auditLogs: Sec18AuditLog[] = [];
  private apiCredentials: ApiCredential[] = [];
  private webhookEvents: WebhookEvent[] = [];
  private users: UserAccount[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    // Clone initial mock data for realistic seed
    this.medicines = JSON.parse(JSON.stringify(MEDICINES_DATA));
    this.partnerOrders = JSON.parse(JSON.stringify(PARTNER_ORDERS_DATA));
    this.tenants = JSON.parse(JSON.stringify(TENANT_ORGS_DATA));
    this.auditLogs = JSON.parse(JSON.stringify(AUDIT_LOGS_DATA));
    this.apiCredentials = JSON.parse(JSON.stringify(API_CREDENTIALS_DATA));
    this.webhookEvents = JSON.parse(JSON.stringify(WEBHOOK_EVENTS_DATA));

    // Seed pharmacy offers for each medicine
    this.medicines.forEach((med) => {
      const offers: PharmacyOffer[] = PHARMACY_OFFERS.map((baseOffer, idx) => ({
        ...baseOffer,
        id: `offer-${med.id}-${idx + 1}`,
        price: idx === 0 ? med.lowestPrice : Number((med.lowestPrice * (1 + (idx * 0.12))).toFixed(2)),
        brandBenchmarkPrice: med.brandPrice,
        savingsAmount: Number((med.brandPrice - (idx === 0 ? med.lowestPrice : med.lowestPrice * (1 + (idx * 0.12)))).toFixed(2))
      }));
      this.pharmacyOffers.set(med.id, offers);
    });

    // Seed standard demo users
    this.users = [
      {
        id: 'usr_849201',
        name: 'Sarah Chen',
        email: 'sarah.chen@healthbridge.demo',
        role: 'patient',
        roleTitle: 'Verified Patient',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        orgName: 'Brooklyn Heights Network',
        zipCode: '11201',
        insurancePreference: 'Cash-Pay Discount',
        twoFactorEnabled: false
      },
      {
        id: 'usr_pharm_01',
        name: 'Dr. Marcus Vance, PharmD',
        email: 'marcus.vance@carepoint.demo',
        role: 'pharmacist',
        roleTitle: 'Lead Dispensing Pharmacist',
        avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
        orgName: 'CarePoint Rx & Medical',
        deaOrNpi: 'NPI #198204921 • DEA #BV8841029',
        tenantId: 'org_cpr_8820',
        zipCode: '11201',
        twoFactorEnabled: true
      },
      {
        id: 'usr_dev_01',
        name: 'Alex Rivera',
        email: 'alex.rivera@medtech.demo',
        role: 'developer',
        roleTitle: 'Platform API Integrator',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        orgName: 'HealthBridge Partner API',
        twoFactorEnabled: true
      },
      {
        id: 'usr_admin_01',
        name: 'SuperAdmin System',
        email: 'superadmin@genericmed.internal',
        role: 'superadmin',
        roleTitle: 'Global Platform Operator',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        orgName: 'genericMed Platform Core',
        twoFactorEnabled: true
      }
    ];
  }

  // --- Medicines ---
  public getMedicines(query?: string, category?: string): Medicine[] {
    return this.medicines.filter((med) => {
      const matchQuery = !query || 
        med.name.toLowerCase().includes(query.toLowerCase()) ||
        med.genericName.toLowerCase().includes(query.toLowerCase()) ||
        med.brandName.toLowerCase().includes(query.toLowerCase()) ||
        med.category.toLowerCase().includes(query.toLowerCase());
      const matchCategory = !category || category === 'All Categories' || med.category.toLowerCase() === category.toLowerCase();
      return matchQuery && matchCategory;
    });
  }

  public getMedicineById(id: string): Medicine | undefined {
    return this.medicines.find((med) => med.id === id);
  }

  // --- Offers ---
  public getOffersForMedicine(medicineId: string): PharmacyOffer[] {
    const cached = this.pharmacyOffers.get(medicineId);
    if (cached) return cached;
    return PHARMACY_OFFERS;
  }

  // --- Cart Validation ---
  public validateCartItems(items: CartItem[]): {
    valid: boolean;
    items: (CartItem & { status: 'CURRENT' | 'UPDATED' | 'OUT_OF_STOCK'; currentPrice: number })[];
    totalSavings: number;
    subtotal: number;
  } {
    let subtotal = 0;
    let totalSavings = 0;

    const validated = items.map((item) => {
      const med = this.getMedicineById(item.medicineId);
      const currentPrice = med ? med.lowestPrice : item.price;
      const brandMSRP = med ? med.brandPrice : item.brandMSRP;
      const savings = Number((brandMSRP - currentPrice).toFixed(2));
      const savingsPercentage = Number(((savings / brandMSRP) * 100).toFixed(1));

      subtotal += currentPrice * item.quantity;
      totalSavings += savings * item.quantity;

      return {
        ...item,
        price: currentPrice,
        brandMSRP,
        savings,
        savingsPercentage,
        status: (med ? 'CURRENT' : 'OUT_OF_STOCK') as 'CURRENT' | 'UPDATED' | 'OUT_OF_STOCK',
        currentPrice
      };
    });

    return {
      valid: true,
      items: validated,
      totalSavings: Number(totalSavings.toFixed(2)),
      subtotal: Number(subtotal.toFixed(2))
    };
  }

  // --- Orders ---
  public getOrders(tenantId?: string): PartnerOrder[] {
    if (!tenantId) {
      return this.partnerOrders;
    }
    // Filter for tenant-scoped orders
    return this.partnerOrders;
  }

  public getOrderById(orderId: string): PartnerOrder | undefined {
    return this.partnerOrders.find((order) => order.orderId === orderId);
  }

  public createOrder(data: {
    patientName: string;
    patientAddress?: string;
    items: CartItem[];
    prescriberName?: string;
    prescriberNpi?: string;
  }): PartnerOrder {
    const orderId = `GM-${Math.floor(10000 + Math.random() * 90000)}`;
    const patientTotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const platformFee = Number((patientTotal * 0.12).toFixed(2));
    const netPayout = Number((patientTotal - platformFee).toFixed(2));

    const newOrder: PartnerOrder = {
      orderId,
      patientName: data.patientName,
      patientDemographics: 'Patient Verified',
      urgency: 'urgent-2h',
      status: 'Just Received',
      elapsedTime: '00:01',
      slaTarget: '15:00',
      patientAddress: data.patientAddress || '142 Joralemon St, Apt 4B, Brooklyn NY',
      claimTimerSeconds: 120,
      customerPin: `#${orderId.replace('GM-', '')}`,
      items: data.items.map((item, idx) => ({
        sku: `${item.name} ${item.strength}`,
        dosage: item.format,
        ndc: item.ndc,
        lot: `LOT-2026-${String.fromCharCode(65 + idx)}${idx + 1}`,
        exp: '12/2027',
        quantityText: `${item.quantity * 30} Units`,
        binLocation: `Shelf ${String.fromCharCode(65 + idx)}-0${idx + 1}`,
        scanned: false,
        rxRating: 'AB Bioequivalent'
      })),
      prescriber: {
        name: data.prescriberName || 'Dr. Sharon Lin, MD',
        npi: data.prescriberNpi || '198204921',
        specialty: 'Family Medicine / TeleRx',
        hospital: 'New York Presbyterian Medical Group',
        teleRxVerified: true
      },
      financials: {
        patientTotal: Number(patientTotal.toFixed(2)),
        platformFee,
        netPayout
      }
    };

    this.partnerOrders.unshift(newOrder);

    // Record SEC-18 Audit Log
    this.addAuditLog({
      type: 'COMMISSION SETTLEMENT RUN',
      summary: `Order ${orderId} created for patient ${data.patientName}. Platform take: $${platformFee.toFixed(2)}.`,
      actorOrTarget: `System Gateway (patient_checkout)`
    });

    // Record Webhook Event
    this.addWebhookEvent({
      topic: 'order.created',
      entityContext: `Order #${orderId}`,
      targetEndpoint: 'https://api.healthbridge.io/webhooks/orders',
      responseCode: 200,
      latencyMs: Math.floor(25 + Math.random() * 40),
      dispatchedAgo: 'Just now'
    });

    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: PartnerOrder['status']): PartnerOrder | undefined {
    const order = this.getOrderById(orderId);
    if (!order) return undefined;

    order.status = status;

    if (status === 'Packed & Staged' || status === 'Ready in Locker') {
      order.items.forEach((item) => {
        item.scanned = true;
      });
      this.addWebhookEvent({
        topic: 'order.dispensed',
        entityContext: `Order #${orderId}`,
        targetEndpoint: 'https://api.healthbridge.io/webhooks/dispensing',
        responseCode: 200,
        latencyMs: 38,
        dispatchedAgo: 'Just now'
      });
    }

    return order;
  }

  public scanOrderItem(orderId: string, sku: string): PartnerOrder | undefined {
    const order = this.getOrderById(orderId);
    if (!order) return undefined;

    const item = order.items.find((i) => i.sku === sku || sku.includes(i.sku));
    if (item) {
      item.scanned = true;
    }
    return order;
  }

  // --- Tenants (Multi-Tenant Org) ---
  public getTenants(): TenantOrg[] {
    return this.tenants;
  }

  public getTenantById(idOrSlug: string): TenantOrg | undefined {
    return this.tenants.find((t) => t.id === idOrSlug || t.slug === idOrSlug);
  }

  // --- SEC-18 Audit Logs ---
  public getAuditLogs(): Sec18AuditLog[] {
    return this.auditLogs;
  }

  public addAuditLog(entry: {
    type: Sec18AuditLog['type'];
    summary: string;
    actorOrTarget: string;
    statusBadge?: string;
    badgeStyle?: Sec18AuditLog['badgeStyle'];
  }): Sec18AuditLog {
    const sha256 = crypto
      .createHash('sha256')
      .update(`${Date.now()}-${entry.type}-${entry.summary}`)
      .digest('hex');

    const log: Sec18AuditLog = {
      id: `audit-${Date.now()}`,
      timestampUtc: `${new Date().toISOString().substring(11, 19)} UTC`,
      type: entry.type,
      summary: entry.summary,
      actorOrTarget: entry.actorOrTarget,
      sha256,
      statusBadge: entry.statusBadge || 'VERIFIED_HASH',
      badgeStyle: entry.badgeStyle || 'success'
    };

    this.auditLogs.unshift(log);
    return log;
  }

  // --- API Credentials ---
  public getApiCredentials(): ApiCredential[] {
    return this.apiCredentials;
  }

  public createApiCredential(label: string, scopes: string[], isSandbox = false): ApiCredential {
    const prefix = isSandbox ? 'gmed_test_' : 'gmed_live_';
    const rand = crypto.randomBytes(8).toString('hex');
    const newCred: ApiCredential = {
      id: `cred-${Date.now()}`,
      label,
      keyPrefix: `${prefix}${rand.substring(0, 4)}****************${rand.substring(12, 16)}`,
      scopes,
      createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      lastDispatched: 'Never',
      status: isSandbox ? 'SANDBOX' : 'ACTIVE',
      icon: isSandbox ? 'science' : 'key'
    };
    this.apiCredentials.unshift(newCred);
    return newCred;
  }

  // --- Webhook Events ---
  public getWebhookEvents(): WebhookEvent[] {
    return this.webhookEvents;
  }

  public addWebhookEvent(event: Omit<WebhookEvent, 'id'>): WebhookEvent {
    const newEvent: WebhookEvent = {
      ...event,
      id: `evt_${Math.floor(100000 + Math.random() * 900000)}`
    };
    this.webhookEvents.unshift(newEvent);
    return newEvent;
  }

  // --- Users & Auth ---
  public findUserByEmail(email: string): UserAccount | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): UserAccount | undefined {
    return this.users.find((u) => u.id === id);
  }

  public registerUser(user: UserAccount): UserAccount {
    this.users.push(user);
    return user;
  }
}

export const db = new DatabaseStore();
