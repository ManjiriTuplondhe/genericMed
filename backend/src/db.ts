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
  CartItem,
  PaymentIntent,
  ReceiptData,
  PrescriptionRecord,
  InAppNotification,
  InsuranceEligibility,
  PharmacyMarketplaceAdapter,
  MultiDrugInteractionCheck,
  MultiRegionNode,
  FraudDetectionAlert,
  AiChatMessage
} from './types';
import {
  MEDICINES_DATA,
  PHARMACY_OFFERS,
  PARTNER_ORDERS_DATA,
  TENANT_ORGS_DATA,
  AUDIT_LOGS_DATA,
  API_CREDENTIALS_DATA,
  WEBHOOK_EVENTS_DATA
} from './data/mockData';

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
  private payments: PaymentIntent[] = [];
  private prescriptions: PrescriptionRecord[] = [];
  private notifications: InAppNotification[] = [];
  private insuranceProfiles: InsuranceEligibility[] = [];
  private marketplaceAdapters: PharmacyMarketplaceAdapter[] = [];
  private multiRegionNodes: MultiRegionNode[] = [];
  private fraudAlerts: FraudDetectionAlert[] = [];

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

    // Phase 4: Seed Pharmacy Management System (PMS) Marketplace Adapters
    this.marketplaceAdapters = [
      {
        id: 'pms-qs1-connect',
        name: 'QS/1 NRx Live Sync',
        vendor: 'QS/1',
        version: 'v14.2.8',
        category: 'PMS Connector',
        status: 'CONNECTED',
        description: 'Bidirectional sync with QS/1 NRx system for instant NDC lot verification, shelf availability, and automated claim submission.',
        icon: 'sync_alt',
        lastSyncTimestamp: '2 mins ago',
        inventoryCountSynced: 14820,
        features: ['Real-time NDC Stock Level', 'Auto Claim Adjudication', 'Electronic Signature Capture', 'Scheduled Refill Sync'],
        protocol: 'NCPDP SCRIPT v2017071',
        config: {
          apiUrl: 'https://gateway.qs1.healthnet.internal/api/v2',
          authMethod: 'MTLS',
          autoSyncEnabled: true,
          syncIntervalMinutes: 5
        }
      },
      {
        id: 'pms-pioneerrx-bridge',
        name: 'PioneerRx Enterprise Bridge',
        vendor: 'PioneerRx',
        version: 'v8.9.4',
        category: 'PMS Connector',
        status: 'CONNECTED',
        description: 'High-throughput PioneerRx cloud integration with automated cleanroom verification barcodes and TeleRx prescription routing.',
        icon: 'hub',
        lastSyncTimestamp: '5 mins ago',
        inventoryCountSynced: 22450,
        features: ['Automated Cleanroom Barcoding', 'TeleRx Prescriber Auth', 'Real-time Copay Calculation', 'Courier Hand-off Webhooks'],
        protocol: 'HL7 FHIR R4',
        config: {
          apiUrl: 'https://api.pioneerrx.cloud/v1/dispense',
          authMethod: 'OAUTH2',
          autoSyncEnabled: true,
          syncIntervalMinutes: 3
        }
      },
      {
        id: 'pms-liberty-sync',
        name: 'Liberty Software Exchange',
        vendor: 'Liberty Software',
        version: 'v5.1.0',
        category: 'PMS Connector',
        status: 'CONNECTED',
        description: 'Direct Liberty Pharmacy Software integration supporting compound batch records, DEA Schedule reporting, and insurance switch gateways.',
        icon: 'receipt_long',
        lastSyncTimestamp: '12 mins ago',
        inventoryCountSynced: 9340,
        features: ['DEA Schedule Tracking', 'Compound Batch Record Sync', 'Real-time Insurance Switch', 'Audit Trail Hashing'],
        protocol: 'REST / JSON',
        config: {
          apiUrl: 'https://liberty-pms.securenode.io/api',
          authMethod: 'API_KEY',
          autoSyncEnabled: true,
          syncIntervalMinutes: 10
        }
      },
      {
        id: 'pms-rx30-connector',
        name: 'Rx30 / Computer-Rx Suite',
        vendor: 'Rx30',
        version: 'v11.0.2',
        category: 'PMS Connector',
        status: 'DISCONNECTED',
        description: 'Legacy and cloud Rx30 dispensing adapter with automated point-of-sale receipt linking and wholesaler EDI replenishment.',
        icon: 'inventory_2',
        lastSyncTimestamp: '1 hour ago',
        inventoryCountSynced: 12100,
        features: ['Wholesaler EDI Replenishment', 'POS Receipt Linking', 'Express Locker Integration'],
        protocol: 'EDI 850/855',
        config: {
          apiUrl: '',
          authMethod: 'API_KEY',
          autoSyncEnabled: false,
          syncIntervalMinutes: 15
        }
      },
      {
        id: 'pms-epic-willow',
        name: 'Epic Willow Inpatient & Retail Gateway',
        vendor: 'Epic Willow',
        version: 'v2025.2',
        category: 'E-Prescribing Gateway',
        status: 'CONNECTED',
        description: 'Enterprise health-system integration connecting hospital outpatient pharmacies directly to genericMed direct cash dispensaries.',
        icon: 'local_hospital',
        lastSyncTimestamp: '8 mins ago',
        inventoryCountSynced: 38900,
        features: ['EHR Medication Reconciliation', 'Hospital Discharge Rx Routing', 'Institutional Pricing Rules', 'Biometric Sign-off'],
        protocol: 'HL7 FHIR R4',
        config: {
          apiUrl: 'https://fhir.epiccare.health/R4/Pharmacy',
          authMethod: 'MTLS',
          autoSyncEnabled: true,
          syncIntervalMinutes: 5
        }
      }
    ];

    // Phase 4: Seed Multi-Region Database Replication Nodes
    this.multiRegionNodes = [
      {
        regionId: 'us-east-1',
        regionName: 'US East (N. Virginia)',
        datacenter: 'AWS us-east-1a (Equinix DC10)',
        role: 'PRIMARY_LEADER',
        status: 'HEALTHY',
        replicationLagMs: 0,
        activeConnections: 1420,
        qpsThroughput: 3840,
        storageUsagePercent: 46.2,
        lastHealthCheck: '5 seconds ago',
        geographicZone: 'North America (East Coast)'
      },
      {
        regionId: 'us-west-2',
        regionName: 'US West (Oregon)',
        datacenter: 'AWS us-west-2b (Portland Edge)',
        role: 'READ_REPLICA',
        status: 'HEALTHY',
        replicationLagMs: 8.4,
        activeConnections: 980,
        qpsThroughput: 2150,
        storageUsagePercent: 44.8,
        lastHealthCheck: '6 seconds ago',
        geographicZone: 'North America (West Coast)'
      },
      {
        regionId: 'us-central-1',
        regionName: 'US Central (Iowa)',
        datacenter: 'GCP us-central1-a (Council Bluffs)',
        role: 'STANDBY_FAILOVER',
        status: 'HEALTHY',
        replicationLagMs: 12.1,
        activeConnections: 450,
        qpsThroughput: 1100,
        storageUsagePercent: 43.1,
        lastHealthCheck: '4 seconds ago',
        geographicZone: 'North America (Midwest)'
      },
      {
        regionId: 'eu-west-1',
        regionName: 'EU West (Frankfurt)',
        datacenter: 'AWS eu-central-1a (Frankfurt Telecity)',
        role: 'READ_REPLICA',
        status: 'HEALTHY',
        replicationLagMs: 64.2,
        activeConnections: 310,
        qpsThroughput: 890,
        storageUsagePercent: 38.5,
        lastHealthCheck: '8 seconds ago',
        geographicZone: 'Europe / International'
      }
    ];

    // Phase 4: Seed Fraud Detection & DEA Velocity Alerts
    this.fraudAlerts = [
      {
        alertId: 'fraud_90184',
        orderId: 'GM-88241',
        patientId: 'usr_849201',
        riskScore: 84,
        riskLevel: 'SUSPICIOUS_REVIEW',
        ruleTriggered: 'CONTROLLED_SUBSTANCE_VELOCITY',
        description: 'Patient attempted 3 refill orders within 14 days across 2 distinct regional pharmacy nodes. DEA Schedule IV threshold exceeded.',
        timestamp: '15 mins ago',
        status: 'PENDING_ACTION',
        deaSchedule: 'Schedule IV'
      },
      {
        alertId: 'fraud_90182',
        orderId: 'GM-77402',
        riskScore: 92,
        riskLevel: 'CRITICAL_HOLD',
        ruleTriggered: 'GEO_ANOMALY',
        description: 'Prescription uploaded from IP in Florida, delivery address in Washington, prescriber NPI active only in Ohio.',
        timestamp: '1 hour ago',
        status: 'BLOCKED',
        deaSchedule: 'Non-Controlled'
      },
      {
        alertId: 'fraud_90175',
        orderId: 'GM-66408',
        riskScore: 28,
        riskLevel: 'NORMAL',
        ruleTriggered: 'PRESCRIBER_NPI_SURGE',
        description: 'Standard prescriber volume check passed. License validated with State Medical Board.',
        timestamp: '3 hours ago',
        status: 'RESOLVED_CLEARED',
        deaSchedule: 'Non-Controlled'
      }
    ];

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

    // Seed initial Prescriptions
    this.prescriptions = [
      {
        id: 'rx_994101',
        patientId: 'usr_849201',
        patientName: 'Sarah Chen',
        medicationName: 'Lipitor® 20mg (Atorvastatin Calcium)',
        genericEquivalent: 'Atorvastatin Calcium 20mg',
        dosage: '20mg Oral Film-Coated Tablet',
        quantityText: '30 Tablets',
        refillsTotal: 3,
        refillsRemaining: 2,
        prescriberName: 'Dr. Sharon Lin, MD',
        prescriberNpi: '198204921',
        prescriberClinic: 'New York Presbyterian Cardiology',
        rxNumber: 'RX-2026-88194',
        ocrConfidence: 98.4,
        status: 'VERIFIED',
        issuedDate: '2026-08-15',
        expirationDate: '2027-08-15',
        estimatedGenericSavings: 167.20
      },
      {
        id: 'rx_994102',
        patientId: 'usr_849201',
        patientName: 'Sarah Chen',
        medicationName: 'Glucophage XR® 500mg',
        genericEquivalent: 'Metformin HCl ER 500mg',
        dosage: '500mg Extended Release',
        quantityText: '60 Tablets',
        refillsTotal: 2,
        refillsRemaining: 1,
        prescriberName: 'Dr. Arthur Campbell, DO',
        prescriberNpi: '104829104',
        prescriberClinic: 'Brooklyn Community Endocrinology',
        rxNumber: 'RX-2026-33918',
        ocrConfidence: 96.8,
        status: 'VERIFIED',
        issuedDate: '2026-07-20',
        expirationDate: '2027-07-20',
        estimatedGenericSavings: 35.60
      }
    ];

    // Seed Notifications
    this.notifications = [
      {
        id: 'notif_1',
        roleTarget: 'all',
        title: 'Real-Time Price Sync Active',
        message: 'Brooklyn Heights fulfillment network refreshed generic prices. Lowest Lipitor generic now $12.80.',
        type: 'PRICE_DROP',
        read: false,
        timestamp: '10 mins ago'
      },
      {
        id: 'notif_2',
        roleTarget: 'patient',
        userId: 'usr_849201',
        title: 'Prescription Refill Ready',
        message: 'Dr. Sharon Lin authorized 2 refills for Atorvastatin Calcium 20mg.',
        type: 'REFILL_REMINDER',
        read: false,
        timestamp: '2 hours ago'
      },
      {
        id: 'notif_3',
        roleTarget: 'pharmacist',
        title: 'Urgent 2h SLA Dispatch Claimed',
        message: 'Order #GM-88241 locked for Driver Marcus B. Van #NY-442 arriving at store in 18 mins.',
        type: 'SLA_ALERT',
        read: true,
        timestamp: '3 hours ago'
      }
    ];

    // Seed Insurance Profiles
    this.insuranceProfiles = [
      {
        memberId: 'HB-88910429',
        providerName: 'BlueCross BlueShield CareFirst',
        groupNumber: 'GRP-99210-NY',
        planType: 'Commercial PPO',
        status: 'ACTIVE',
        deductibleTotal: 1500.00,
        deductibleRemaining: 340.00,
        copayGenericTier1: 10.00,
        copayBrandTier3: 75.00,
        genericCashAdvantage: 62.20
      },
      {
        memberId: 'AET-7718942',
        providerName: 'Aetna Health Choice',
        groupNumber: 'GRP-44102-METRO',
        planType: 'High-Deductible HSA',
        status: 'ACTIVE',
        deductibleTotal: 3000.00,
        deductibleRemaining: 1800.00,
        copayGenericTier1: 15.00,
        copayBrandTier3: 90.00,
        genericCashAdvantage: 74.50
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

  // --- Phase 2: Payments & Escrow ---
  public processPayment(
    orderId: string,
    amount: number,
    paymentMethod: PaymentIntent['paymentMethod'],
    last4?: string
  ): PaymentIntent {
    const paymentId = `pi_${crypto.randomBytes(6).toString('hex')}`;
    const newPayment: PaymentIntent = {
      id: paymentId,
      orderId,
      amount,
      currency: 'USD',
      status: 'ESCROW_HOLD',
      paymentMethod,
      escrowReleaseEstimatedAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      last4: last4 || (paymentMethod === 'card' || paymentMethod === 'fsa_hsa' ? '4242' : undefined),
      createdAt: new Date().toISOString()
    };

    this.payments.unshift(newPayment);

    // Add SEC-18 log
    this.addAuditLog({
      type: 'COMMISSION SETTLEMENT RUN',
      summary: `Payment escrow held for Order #${orderId}. Amount: $${amount.toFixed(2)} via ${paymentMethod}.`,
      actorOrTarget: `Stripe/Card Escrow Gateway (${paymentId})`,
      statusBadge: 'ESCROW_HELD',
      badgeStyle: 'neutral'
    });

    return newPayment;
  }

  public getReceipt(orderId: string): ReceiptData | undefined {
    const order = this.getOrderById(orderId);
    if (!order) return undefined;

    const subtotal = order.financials.patientTotal;
    const tax = Number((subtotal * 0.08875).toFixed(2));
    const platformFee = order.financials.platformFee;
    const deliveryFee = 0;
    const total = Number((subtotal + tax).toFixed(2));
    const totalSaved = Number((subtotal * 1.85).toFixed(2));

    return {
      orderId,
      receiptNumber: `REC-${orderId.replace('GM-', '')}-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString(),
      patientName: order.patientName,
      patientAddress: order.patientAddress || '142 Montague St, Apt 4B, Brooklyn, NY 11201',
      paymentMethod: 'Credit Card (ending in 4242)',
      items: order.items.map((i) => ({
        name: i.sku,
        dosage: i.dosage,
        ndc: i.ndc,
        quantity: 1,
        unitPrice: order.financials.patientTotal / (order.items.length || 1),
        total: order.financials.patientTotal / (order.items.length || 1),
        brandMSRP: (order.financials.patientTotal / (order.items.length || 1)) * 3.5,
        savings: (order.financials.patientTotal / (order.items.length || 1)) * 2.5
      })),
      subtotal,
      platformFee,
      deliveryFee,
      tax,
      total,
      totalSaved,
      dispensingPharmacy: 'Brooklyn Central Heights Pharmacy',
      deaRegistration: 'FB-9842109',
      npiPrescriber: order.prescriber.npi
    };
  }

  public processRefund(orderId: string, reason: string): { success: boolean; message: string } {
    const order = this.getOrderById(orderId);
    if (!order) {
      return { success: false, message: 'Order not found' };
    }

    order.status = 'Cancelled & Refunded';

    this.addAuditLog({
      type: 'SECURITY / AUDIT EVENT',
      summary: `Order #${orderId} cancelled and refunded. Reason: ${reason}. Full escrow release.`,
      actorOrTarget: `Escrow Service (order_refund)`,
      statusBadge: 'REFUNDED',
      badgeStyle: 'warning'
    });

    this.addWebhookEvent({
      topic: 'order.refunded',
      entityContext: `Order #${orderId}`,
      targetEndpoint: 'https://api.healthbridge.io/webhooks/refunds',
      responseCode: 200,
      latencyMs: 29,
      dispatchedAgo: 'Just now'
    });

    return { success: true, message: `Order #${orderId} was refunded successfully.` };
  }

  // --- Phase 2: Prescriptions & OCR Parsing ---
  public getPrescriptions(patientId?: string): PrescriptionRecord[] {
    if (patientId) {
      return this.prescriptions.filter((rx) => rx.patientId === patientId);
    }
    return this.prescriptions;
  }

  public getPrescriptionById(id: string): PrescriptionRecord | undefined {
    return this.prescriptions.find((rx) => rx.id === id);
  }

  public addPrescription(record: PrescriptionRecord): PrescriptionRecord {
    this.prescriptions.unshift(record);
    return record;
  }

  public verifyNpi(npi: string): {
    valid: boolean;
    providerName?: string;
    specialty?: string;
    clinic?: string;
    state?: string;
    status: 'ACTIVE' | 'INACTIVE' | 'NOT_FOUND';
  } {
    const npiRegistry: Record<string, { providerName: string; specialty: string; clinic: string; state: string }> = {
      '198204921': {
        providerName: 'Dr. Sharon Lin, MD',
        specialty: 'Internal Medicine / Cardiology',
        clinic: 'Mount Sinai Heart Health Center',
        state: 'NY'
      },
      '104829104': {
        providerName: 'Dr. Arthur Campbell, DO',
        specialty: 'Endocrinology & Metabolism',
        clinic: 'Brooklyn Community Endocrinology',
        state: 'NY'
      },
      '148729103': {
        providerName: 'Dr. Elena Rostova, MD',
        specialty: 'Pulmonology',
        clinic: 'NYU Langone Medical Plaza',
        state: 'NY'
      }
    };

    const found = npiRegistry[npi];
    if (found) {
      return { valid: true, ...found, status: 'ACTIVE' };
    }

    if (npi.length === 10 && /^\d+$/.test(npi)) {
      return {
        valid: true,
        providerName: 'Dr. Verified Practitioner, MD',
        specialty: 'General Practice',
        clinic: 'Metro Health Alliance',
        state: 'NY',
        status: 'ACTIVE'
      };
    }

    return { valid: false, status: 'NOT_FOUND' };
  }

  // --- Phase 2: Notifications ---
  public getNotifications(role?: string, userId?: string): InAppNotification[] {
    return this.notifications.filter((n) => {
      const roleMatch = !role || n.roleTarget === 'all' || n.roleTarget === role;
      const userMatch = !n.userId || !userId || n.userId === userId;
      return roleMatch && userMatch;
    });
  }

  public markNotificationAsRead(id: string): boolean {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      return true;
    }
    return false;
  }

  public addNotification(notification: Omit<InAppNotification, 'id' | 'timestamp'>): InAppNotification {
    const newNotif: InAppNotification = {
      ...notification,
      id: `notif_${Date.now()}`,
      timestamp: 'Just now'
    };
    this.notifications.unshift(newNotif);
    return newNotif;
  }

  // --- Phase 2: Insurance Eligibility ---
  public verifyInsurance(memberId: string, groupNumber?: string, providerName?: string): InsuranceEligibility {
    const existing = this.insuranceProfiles.find(
      (p) => p.memberId.toLowerCase() === memberId.toLowerCase()
    );

    if (existing) {
      return existing;
    }

    const calculatedEligibility: InsuranceEligibility = {
      memberId: memberId.toUpperCase(),
      providerName: providerName || 'BlueCross BlueShield Standard Network',
      groupNumber: groupNumber || 'GRP-STANDARD-01',
      planType: 'Comprehensive Health Plan',
      status: 'ACTIVE',
      deductibleTotal: 2000.0,
      deductibleRemaining: 650.0,
      copayGenericTier1: 10.0,
      copayBrandTier3: 85.0,
      genericCashAdvantage: 75.0
    };

    this.insuranceProfiles.push(calculatedEligibility);
    return calculatedEligibility;
  }

  public calculateInsuranceCopay(medicineId: string, planType: string): {
    medicineName: string;
    brandName: string;
    brandCashPrice: number;
    brandInsuranceCopay: number;
    genericCashPrice: number;
    genericInsuranceCopay: number;
    bestOption: 'GENERIC_CASH' | 'GENERIC_INSURANCE' | 'BRAND_INSURANCE';
    netSavings: number;
    recommendationSummary: string;
  } {
    const med = this.getMedicineById(medicineId) || this.medicines[0];
    const brandCash = med.brandPrice;
    const genericCash = med.lowestPrice;

    let brandCopay = 75.0;
    let genericCopay = 10.0;

    if (planType.toLowerCase().includes('hsa') || planType.toLowerCase().includes('high-deductible')) {
      brandCopay = Number((brandCash * 0.8).toFixed(2));
      genericCopay = Number(genericCash.toFixed(2));
    } else if (planType.toLowerCase().includes('medicare') || planType.toLowerCase().includes('medicaid')) {
      brandCopay = 45.0;
      genericCopay = 3.5;
    }

    const bestPrice = Math.min(genericCash, genericCopay, brandCopay);
    let bestOption: 'GENERIC_CASH' | 'GENERIC_INSURANCE' | 'BRAND_INSURANCE' = 'GENERIC_CASH';
    if (bestPrice === genericCash) {
      bestOption = 'GENERIC_CASH';
    } else if (bestPrice === genericCopay) {
      bestOption = 'GENERIC_INSURANCE';
    } else {
      bestOption = 'BRAND_INSURANCE';
    }

    const netSavings = Number((brandCash - bestPrice).toFixed(2));

    return {
      medicineName: med.genericName,
      brandName: med.brandName,
      brandCashPrice: brandCash,
      brandInsuranceCopay: brandCopay,
      genericCashPrice: genericCash,
      genericInsuranceCopay: genericCopay,
      bestOption,
      netSavings,
      recommendationSummary:
        bestOption === 'GENERIC_CASH'
          ? `Cash price for generic (${med.genericName}) is $${genericCash.toFixed(2)}, beating both your brand copay ($${brandCopay.toFixed(2)}) and generic copay ($${genericCopay.toFixed(2)})!`
          : `Using insurance generic copay of $${genericCopay.toFixed(2)} saves you $${(brandCash - genericCopay).toFixed(2)} vs brand MSRP.`
    };
  }

  // --- Phase 3: Platform Analytics & Insights ---
  public getPlatformAnalytics(timeframe: '7d' | '30d' | '90d' = '30d') {
    const days = timeframe === '7d' ? 7 : timeframe === '90d' ? 90 : 30;
    
    // Generate realistic historical daily points
    const timeSeries = [];
    const baseGmv = timeframe === '7d' ? 4200 : timeframe === '90d' ? 5100 : 4600;
    const baseSavings = baseGmv * 4.2;
    const baseOrders = Math.round(baseGmv / 28);

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dayVariance = 0.85 + Math.sin(i * 0.7) * 0.2 + (Math.random() * 0.1);
      const dayGmv = Math.round(baseGmv * dayVariance);
      const daySavings = Math.round(baseSavings * dayVariance * 1.05);
      const dayOrders = Math.round(baseOrders * dayVariance);

      timeSeries.push({
        date: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        gmv: dayGmv,
        patientSavings: daySavings,
        orderCount: dayOrders
      });
    }

    const totalGmv = timeSeries.reduce((sum, p) => sum + p.gmv, 0);
    const totalPatientSavings = timeSeries.reduce((sum, p) => sum + p.patientSavings, 0);
    const totalOrdersCount = timeSeries.reduce((sum, p) => sum + p.orderCount, 0);

    return {
      timeframe,
      metrics: {
        totalGmv,
        gmvChangePercent: 14.8,
        totalPatientSavings,
        savingsChangePercent: 18.2,
        activeTenantsCount: this.tenants.length,
        meanSlaMinutes: 34,
        totalOrdersCount,
        sec18ComplianceRate: 99.8
      },
      timeSeries,
      categoryBreakdown: [
        { category: 'Cardiovascular (Lipid / Statin)', volumePercent: 38, ordersCount: Math.round(totalOrdersCount * 0.38), totalSavings: Math.round(totalPatientSavings * 0.42), color: '#006a6a' },
        { category: 'Endocrine & Metabolic (Metformin)', volumePercent: 29, ordersCount: Math.round(totalOrdersCount * 0.29), totalSavings: Math.round(totalPatientSavings * 0.28), color: '#0062a1' },
        { category: 'Anti-Infectives (Antibiotics)', volumePercent: 21, ordersCount: Math.round(totalOrdersCount * 0.21), totalSavings: Math.round(totalPatientSavings * 0.19), color: '#7e525d' },
        { category: 'Analgesics & Anti-Inflammatory', volumePercent: 12, ordersCount: Math.round(totalOrdersCount * 0.12), totalSavings: Math.round(totalPatientSavings * 0.11), color: '#825500' }
      ],
      slaDistribution: {
        under1Hour: 68,
        under2Hours: 24,
        under4Hours: 7,
        breached: 1
      },
      topPerformingTenants: this.tenants.map((t) => ({
        name: t.name,
        tier: t.tier,
        orders: t.monthlyOrders,
        volume: Number((t.monthlyOrders * 28.5).toFixed(2)),
        slaScore: t.slaRate
      }))
    };
  }

  // --- Phase 3: Tenant Self-Serve Onboarding ---
  public onboardTenant(payload: {
    organizationName: string;
    dbaName?: string;
    stateLicenseNumber: string;
    deaRegistrationNumber: string;
    primaryContactName: string;
    primaryContactEmail: string;
    primaryContactPhone: string;
    pharmacistInChargeNpi: string;
    tier: 'Enterprise Tier' | 'Standard Partner' | 'Regional Partner' | 'Starter Dispensary';
    deliveryRadiusMiles: number;
    expressSlaMinutes: number;
    webhookNotificationUrl?: string;
  }) {
    const slug = payload.organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const shardId = `us-east-shard-${Math.floor(10 + Math.random() * 90)}`;
    const schemaKey = `tenant_${slug.replace(/-/g, '_')}`;

    const takeRateMap = {
      'Enterprise Tier': 12.0,
      'Standard Partner': 11.5,
      'Regional Partner': 12.5,
      'Starter Dispensary': 10.0
    };

    const newTenant: TenantOrg = {
      id: `ten_${Date.now()}`,
      slug,
      name: payload.organizationName,
      schemaKey,
      tier: payload.tier,
      takeRate: takeRateMap[payload.tier] || 11.5,
      shard: shardId,
      replicaLag: '12ms',
      monthlyOrders: 0,
      monthlyVolumeText: '$0.00 / mo',
      slaRate: 99.9,
      complianceStatus: 'HIPAA & DEA Validated',
      nodeHealthPercent: 100,
      healthStatus: 'OK'
    };

    this.tenants.push(newTenant);

    // Record immutable SEC-18 registration log
    this.addAuditLog({
      type: 'TENANT ISOLATION AUDIT',
      summary: `New Pharmacy Partner Onboarded: ${payload.organizationName} (${payload.tier}). Shard ${shardId} provisioned with schema isolation ${schemaKey}.`,
      actorOrTarget: `System Onboarding Gateway (DEA ${payload.deaRegistrationNumber})`,
      statusBadge: 'PROVISIONED',
      badgeStyle: 'success'
    });

    if (payload.webhookNotificationUrl) {
      this.addWebhookEvent({
        topic: 'tenant.provisioned',
        entityContext: `Tenant ${payload.organizationName}`,
        targetEndpoint: payload.webhookNotificationUrl,
        responseCode: 200,
        latencyMs: 41,
        dispatchedAgo: 'Just now'
      });
    }

    return {
      success: true,
      tenant: newTenant,
      credentials: {
        apiKey: `gm_live_${crypto.randomBytes(16).toString('hex')}`,
        schemaKey,
        shardId,
        complianceCert: `SEC18-CERT-${Date.now().toString(36).toUpperCase()}`
      }
    };
  }

  // ==========================================
  // Phase 4: PMS Marketplace Adapter Methods
  // ==========================================

  public getMarketplaceAdapters(): PharmacyMarketplaceAdapter[] {
    return this.marketplaceAdapters;
  }

  public getMarketplaceAdapter(id: string): PharmacyMarketplaceAdapter | undefined {
    return this.marketplaceAdapters.find((a) => a.id === id);
  }

  public configureMarketplaceAdapter(id: string, config: Partial<PharmacyMarketplaceAdapter['config']>): PharmacyMarketplaceAdapter {
    const adapter = this.marketplaceAdapters.find((a) => a.id === id);
    if (!adapter) {
      throw new Error(`Marketplace adapter ${id} not found`);
    }

    adapter.config = { ...adapter.config, ...config };
    adapter.status = 'CONNECTED';
    adapter.lastSyncTimestamp = 'Just now';

    this.addAuditLog({
      type: 'SECURITY / AUDIT EVENT',
      summary: `Pharmacy PMS Adapter Configured: ${adapter.name} (${adapter.vendor}) with ${adapter.config.authMethod} auth.`,
      actorOrTarget: `Partner Integration Gateway (${id})`,
      statusBadge: 'CONFIGURED',
      badgeStyle: 'info'
    });

    return adapter;
  }

  public syncMarketplaceAdapter(id: string): { success: boolean; adapter: PharmacyMarketplaceAdapter; syncedItems: number } {
    const adapter = this.marketplaceAdapters.find((a) => a.id === id);
    if (!adapter) {
      throw new Error(`Marketplace adapter ${id} not found`);
    }

    adapter.status = 'CONNECTED';
    const additionalSynced = Math.floor(Math.random() * 450) + 50;
    adapter.inventoryCountSynced += additionalSynced;
    adapter.lastSyncTimestamp = 'Just now';

    this.addAuditLog({
      type: 'GLOBAL NDC SYNC',
      summary: `Automated PMS Inventory & Prescription Sync via ${adapter.name}: +${additionalSynced} verified NDC lots updated.`,
      actorOrTarget: `PMS Gateway (${adapter.vendor})`,
      statusBadge: 'SYNCED',
      badgeStyle: 'success'
    });

    this.addWebhookEvent({
      topic: 'pms.inventory.synced',
      entityContext: `Adapter ${adapter.name}`,
      targetEndpoint: adapter.config.apiUrl || 'https://partner.webhook.local/events',
      responseCode: 200,
      latencyMs: 38,
      dispatchedAgo: 'Just now'
    });

    return {
      success: true,
      adapter,
      syncedItems: additionalSynced
    };
  }

  // ==========================================
  // Phase 4: Multi-Drug Clinical Interaction Matrix
  // ==========================================

  public checkMultiDrugInteractions(medicationIds: string[]): MultiDrugInteractionCheck {
    const meds = this.medicines.filter((m) => medicationIds.includes(m.id));
    const medNames = meds.map((m) => m.genericName);

    const interactions: MultiDrugInteractionCheck['interactions'] = [];

    // Check known pairwise clinical interactions
    const lowerNames = medNames.map((n) => n.toLowerCase());

    const hasStatin = lowerNames.some((n) => n.includes('atorvastatin') || n.includes('simvastatin') || n.includes('rosuvastatin'));
    const hasAntibiotic = lowerNames.some((n) => n.includes('amoxicillin') || n.includes('clarithromycin') || n.includes('erythromycin'));
    const hasMetformin = lowerNames.some((n) => n.includes('metformin'));
    const hasAcetaminophen = lowerNames.some((n) => n.includes('acetaminophen') || n.includes('paracetamol'));

    if (hasStatin && hasAntibiotic) {
      interactions.push({
        drug1: 'Atorvastatin Calcium',
        drug2: 'Amoxicillin / Macrolide Antibiotic',
        severity: 'MODERATE',
        mechanism: 'CYP3A4 / OATP1B1 competitive hepatic pathway clearance and renal tubular secretion.',
        clinicalEffect: 'May transiently elevate serum statin levels, increasing risk of myopathy or hepatic transaminase elevation. Routine monitoring advised.',
        managementRecommendation: 'Maintain standard hydration. Advise patient to report any unexplained muscle soreness or dark urine. Dose adjustment generally not required for short amoxicillin courses.',
        cypEnzymesInvolved: ['CYP3A4', 'OATP1B1']
      });
    }

    if (hasMetformin && hasAcetaminophen) {
      interactions.push({
        drug1: 'Metformin HCl',
        drug2: 'Acetaminophen (APAP)',
        severity: 'MINOR',
        mechanism: 'Shared mild hepatic gluconeogenesis and minor glutathione pathway utilization under therapeutic dosages.',
        clinicalEffect: 'Safe at therapeutic doses (<3g/day acetaminophen). No clinically significant glycemic disturbance.',
        managementRecommendation: 'Safe for concurrent use. Reinforce adherence to maximum 3,000 mg/24h acetaminophen limit from all sources.',
        cypEnzymesInvolved: ['CYP2E1']
      });
    }

    if (hasStatin && hasMetformin) {
      interactions.push({
        drug1: 'Atorvastatin Calcium',
        drug2: 'Metformin HCl',
        severity: 'MINOR',
        mechanism: 'Co-administration is synergistic for metabolic syndrome and Type 2 Diabetes management without pharmacokinetic inhibition.',
        clinicalEffect: 'Cardioprotective synergy. No negative pharmacokinetic drug-drug interaction.',
        managementRecommendation: 'Standard clinical guideline dual-therapy. Annual lipid panel and HbA1c surveillance recommended.',
        cypEnzymesInvolved: ['OCT1', 'OCT2']
      });
    }

    let overallRisk: MultiDrugInteractionCheck['overallRiskLevel'] = 'NONE';
    if (interactions.some((i) => i.severity === 'CRITICAL' || i.severity === 'MAJOR')) {
      overallRisk = 'HIGH';
    } else if (interactions.some((i) => i.severity === 'MODERATE')) {
      overallRisk = 'MODERATE';
    } else if (interactions.length > 0) {
      overallRisk = 'LOW';
    }

    return {
      medicationIds,
      medicationNames: medNames.length > 0 ? medNames : ['Selected Medications'],
      overallRiskLevel: overallRisk,
      summary: interactions.length > 0
        ? `Found ${interactions.length} clinical drug-drug interaction(s). Overall severity rating is ${overallRisk}.`
        : 'No significant pharmacokinetic drug-drug interactions detected among the selected medications.',
      interactions,
      fdaWarningCitations: [
        'FDA Orange Book (Approved Drug Products with Therapeutic Equivalence Evaluations, 44th Ed.)',
        'Clinical Pharmacogenetics Implementation Consortium (CPIC) Guidelines for Statins & Biguanides',
        'National Library of Medicine (NLM) RxNorm Clinical Drug Vocabulary'
      ],
      checkedAt: new Date().toISOString()
    };
  }

  // ==========================================
  // Phase 4: Multi-Region Database Replication & Failover
  // ==========================================

  public getMultiRegionStatus(): {
    nodes: MultiRegionNode[];
    globalTopology: {
      primaryRegion: string;
      totalActiveConnections: number;
      globalTps: number;
      consensusEngine: string;
      rtoSeconds: number;
      rpoSeconds: number;
    };
  } {
    const totalConnections = this.multiRegionNodes.reduce((acc, n) => acc + n.activeConnections, 0);
    const globalTps = this.multiRegionNodes.reduce((acc, n) => acc + n.qpsThroughput, 0);

    return {
      nodes: this.multiRegionNodes,
      globalTopology: {
        primaryRegion: 'us-east-1 (N. Virginia)',
        totalActiveConnections: totalConnections,
        globalTps,
        consensusEngine: 'Raft Multi-Paxos Distributed Leader',
        rtoSeconds: 15,
        rpoSeconds: 1
      }
    };
  }

  public simulateRegionFailover(targetRegionId: string): {
    success: boolean;
    previousLeader: string;
    newLeader: string;
    failoverDurationMs: number;
    sec18AuditHash: string;
    nodes: MultiRegionNode[];
  } {
    const previousPrimary = this.multiRegionNodes.find((n) => n.role === 'PRIMARY_LEADER');
    const targetNode = this.multiRegionNodes.find((n) => n.regionId === targetRegionId);

    if (!targetNode) {
      throw new Error(`Target region ${targetRegionId} not found`);
    }

    if (previousPrimary) {
      previousPrimary.role = 'READ_REPLICA';
      previousPrimary.replicationLagMs = 9.8;
    }

    targetNode.role = 'PRIMARY_LEADER';
    targetNode.replicationLagMs = 0;
    targetNode.status = 'HEALTHY';
    targetNode.lastHealthCheck = 'Just now (Elected Leader)';

    const auditEntry = this.addAuditLog({
      type: 'SECURITY / AUDIT EVENT',
      summary: `Automated Multi-Region Disaster Recovery Failover Executed. Primary Leader promoted to ${targetNode.regionName} (${targetNode.regionId}). Consensus election verified.`,
      actorOrTarget: `Global Orchestration Raft Cluster (${targetNode.datacenter})`,
      statusBadge: 'FAILOVER OK',
      badgeStyle: 'success'
    });

    return {
      success: true,
      previousLeader: previousPrimary?.regionId || 'us-east-1',
      newLeader: targetNode.regionId,
      failoverDurationMs: 420,
      sec18AuditHash: auditEntry.sha256,
      nodes: this.multiRegionNodes
    };
  }

  // ==========================================
  // Phase 4: Fraud Detection & DEA Velocity Engine
  // ==========================================

  public getFraudAlerts(): FraudDetectionAlert[] {
    return this.fraudAlerts;
  }

  public evaluateOrderRisk(payload: {
    patientId?: string;
    orderItems: { medicineId: string; quantity: number }[];
    shippingAddress?: string;
    prescriberNpi?: string;
  }): {
    approved: boolean;
    riskScore: number;
    riskLevel: FraudDetectionAlert['riskLevel'];
    flags: string[];
    alert?: FraudDetectionAlert;
  } {
    let riskScore = 15;
    const flags: string[] = [];

    // Check if any item contains controlled substances
    const totalQty = payload.orderItems.reduce((acc, i) => acc + i.quantity, 0);
    if (totalQty > 8) {
      riskScore += 45;
      flags.push('Unusually high order unit volume (>8 units)');
    }

    if (payload.prescriberNpi && payload.prescriberNpi.startsWith('999')) {
      riskScore += 40;
      flags.push('Prescriber NPI under recent State Board audit surveillance');
    }

    let riskLevel: FraudDetectionAlert['riskLevel'] = 'NORMAL';
    if (riskScore >= 80) {
      riskLevel = 'CRITICAL_HOLD';
    } else if (riskScore >= 50) {
      riskLevel = 'SUSPICIOUS_REVIEW';
    } else if (riskScore >= 30) {
      riskLevel = 'ELEVATED';
    }

    let alert: FraudDetectionAlert | undefined;

    if (riskScore >= 50) {
      alert = {
        alertId: `fraud_${Date.now()}`,
        patientId: payload.patientId || 'anonymous',
        riskScore,
        riskLevel,
        ruleTriggered: 'CONTROLLED_SUBSTANCE_VELOCITY',
        description: `Automated Risk Engine Flagged: ${flags.join('; ')}`,
        timestamp: 'Just now',
        status: riskLevel === 'CRITICAL_HOLD' ? 'BLOCKED' : 'PENDING_ACTION',
        deaSchedule: 'Non-Controlled'
      };
      this.fraudAlerts.unshift(alert);

      this.addAuditLog({
        type: 'SECURITY / AUDIT EVENT',
        summary: `Automated Fraud & DEA Velocity Alert Triggered: Risk Score ${riskScore}/100 (${riskLevel}).`,
        actorOrTarget: `Fraud Shield Engine (NPI ${payload.prescriberNpi || 'N/A'})`,
        statusBadge: riskLevel === 'CRITICAL_HOLD' ? 'BLOCKED' : 'FLAGGED',
        badgeStyle: riskLevel === 'CRITICAL_HOLD' ? 'warning' : 'neutral'
      });
    }

    return {
      approved: riskScore < 80,
      riskScore,
      riskLevel,
      flags,
      alert
    };
  }

  // ==========================================
  // Phase 4: Patient Clinical AI Assistant Chat
  // ==========================================

  public generatePatientChatResponse(userMessage: string, history: { sender: string; text: string }[] = []): AiChatMessage {
    const lower = userMessage.toLowerCase();

    let reply = '';
    const suggestions: AiChatMessage['suggestedActions'] = [];

    if (lower.includes('atorvastatin') || lower.includes('lipitor') || lower.includes('cholesterol') || lower.includes('statin')) {
      reply = `**Atorvastatin Calcium (Generic for Lipitor®)** is an HMG-CoA reductase inhibitor indicated to reduce elevated LDL-C and total cholesterol.\n\n• **Therapeutic Equivalence**: FDA AB-rated bioequivalent with identical active moiety absorption profile.\n• **Average Savings on genericMed**: Up to **94% direct cash savings** ($4.20 generic vs $78.00 brand MSRP).\n• **Common Guidance**: Take once daily, with or without food. Avoid excessive grapefruit consumption.`;
      suggestions.push(
        { label: 'View Atorvastatin Prices', actionType: 'VIEW_DRUG', payload: 'med-1' },
        { label: 'Check Drug Interactions', actionType: 'CHECK_INTERACTION', payload: 'med-1' },
        { label: 'Speak with Pharmacist', actionType: 'CALL_PHARMACIST' }
      );
    } else if (lower.includes('metformin') || lower.includes('glucophage') || lower.includes('diabetes') || lower.includes('sugar')) {
      reply = `**Metformin Hydrochloride (Generic for Glucophage®)** is the first-line oral biguanide for Type 2 Diabetes mellitus management.\n\n• **Therapeutic Equivalence**: FDA AB-rated generic bioequivalent.\n• **Average Savings on genericMed**: Up to **92% direct cash savings** ($3.80 generic vs $48.00 brand).\n• **Common Guidance**: Best taken with meals to minimize initial GI upset. Regular HbA1c and renal monitoring is recommended.`;
      suggestions.push(
        { label: 'View Metformin Offers', actionType: 'VIEW_DRUG', payload: 'med-2' },
        { label: 'Check Drug Interactions', actionType: 'CHECK_INTERACTION', payload: 'med-2' }
      );
    } else if (lower.includes('interaction') || lower.includes('safe') || lower.includes('combine') || lower.includes('together')) {
      reply = `You can evaluate multi-drug combinations directly in our **Clinical Interaction Matrix**. It checks CYP450 metabolic competition, therapeutic duplications, and FDA Orange Book safety citations in real time.`;
      suggestions.push(
        { label: 'Open Multi-Drug Analyzer', actionType: 'CHECK_INTERACTION' },
        { label: 'Contact On-Call Pharmacist', actionType: 'CALL_PHARMACIST' }
      );
    } else if (lower.includes('generic') || lower.includes('safe') || lower.includes('quality') || lower.includes('fda')) {
      reply = `Every generic medication listed on genericMed holds an **FDA AB bioequivalency rating**. This certifies that the generic delivers the identical active ingredient, strength, dosage form, and pharmacokinetic bioavailability as the brand-name medication at 80–95% lower direct cash cost.`;
      suggestions.push(
        { label: 'Search Generic Medicines', actionType: 'NAVIGATE', payload: 'customer-search' }
      );
    } else {
      reply = `Hello! I am the **genericMed 24/7 Clinical Assistant**. I can help you compare generic savings, explain FDA AB bioequivalence ratings, check multi-drug interactions, and connect you with our licensed pharmacist dispensing network. How can I assist with your prescription today?`;
      suggestions.push(
        { label: 'Find Generic for Lipitor', actionType: 'VIEW_DRUG', payload: 'med-1' },
        { label: 'Check Drug Interactions', actionType: 'CHECK_INTERACTION' },
        { label: 'Track Active Orders', actionType: 'NAVIGATE', payload: 'patient-orders' }
      );
    }

    return {
      id: `chat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sender: 'assistant',
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: suggestions,
      fdaDisclaimerIncluded: true
    };
  }
}

export const db = new DatabaseStore();

