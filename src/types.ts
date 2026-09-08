export type AppView = 
  | 'customer-search' 
  | 'customer-drug-detail' 
  | 'customer-cart' 
  | 'partner-portal' 
  | 'super-admin' 
  | 'dev-console'
  | 'system-architecture';

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  brandName: string;
  brandManufacturer: string;
  dosage: string;
  packageDescription: string;
  category: string;
  rxType: 'Rx Only' | 'OTC Medicine' | 'Rx Antibiotic';
  bioequivalentRating: string;
  brandPrice: number;
  lowestPrice: number;
  savingsPercent: number;
  savingsAmount: number;
  rating: number;
  reviewCount: number;
  pharmacyCount: number;
  imageUrl: string;
  description: string;
  ndc: string;
  fdaApproved: boolean;
}

export interface PharmacyOffer {
  id: string;
  pharmacyName: string;
  nodeId: string;
  subtitle: string;
  rating: number;
  auditCount: number;
  distanceMiles: number;
  price: number;
  brandBenchmarkPrice: number;
  savingsAmount: number;
  platformFee: string;
  deliveryEstimate: string;
  slaMinutes: number;
  slaBadge: string;
  inStock: boolean;
  stockCountVerified?: number;
  tagBadge?: string;
  badgeType?: 'best-match' | 'fastest' | 'standard';
  isOutOfStock?: boolean;
}

export interface CartItem {
  id: string;
  medicineId: string;
  name: string;
  strength: string;
  format: string;
  countDescription: string;
  brandEquivalent: string;
  brandMSRP: number;
  price: number;
  savings: number;
  savingsPercentage: number;
  quantity: number;
  doctorInfo: string;
  npiNumber: string;
  refillsRemaining?: number;
  imageUrl: string;
  ndc: string;
}

export interface PartnerOrder {
  orderId: string;
  patientName: string;
  patientDemographics: string;
  urgency: 'urgent-2h' | 'curbside-ready' | 'new-received' | 'completed';
  status: 'Needs Dispensing' | 'Ready in Locker' | 'Just Received' | 'Packed & Staged';
  elapsedTime: string;
  slaTarget: string;
  courierEta?: string;
  courierName?: string;
  courierVan?: string;
  courierStatus?: string;
  customerPin?: string;
  patientAddress?: string;
  claimTimerSeconds?: number;
  items: {
    sku: string;
    dosage: string;
    ndc: string;
    lot: string;
    exp: string;
    quantityText: string;
    binLocation: string;
    scanned: boolean;
    rxRating: string;
  }[];
  prescriber: {
    name: string;
    npi: string;
    specialty: string;
    hospital: string;
    teleRxVerified: boolean;
  };
  financials: {
    patientTotal: number;
    platformFee: number;
    netPayout: number;
  };
}

export interface TenantOrg {
  id: string;
  slug: string;
  name: string;
  schemaKey: string;
  tier: 'Enterprise Tier' | 'Standard Partner' | 'Regional Partner' | 'Starter Dispensary' | 'Enterprise Sandbox';
  takeRate: number;
  shard: string;
  replicaLag: string;
  monthlyOrders: number;
  monthlyVolumeText: string;
  slaRate: number;
  complianceStatus: 'HIPAA & DEA Validated' | 'Verified' | 'SLA Warning' | 'DEA Under Review';
  nodeHealthPercent: number;
  healthStatus: 'OK' | 'PROBATION' | 'IN-FLIGHT';
}

export interface Sec18AuditLog {
  id: string;
  timestampUtc: string;
  type: 'TENANT ISOLATION AUDIT' | 'GLOBAL NDC SYNC' | 'COMMISSION SETTLEMENT RUN' | 'SLA GUARD BREACH';
  summary: string;
  actorOrTarget: string;
  sha256: string;
  statusBadge: string;
  badgeStyle: 'success' | 'info' | 'primary' | 'warning';
}

export interface ApiCredential {
  id: string;
  label: string;
  keyPrefix: string;
  scopes: string[];
  createdDate: string;
  lastDispatched: string;
  status: 'ACTIVE' | 'SANDBOX' | 'REVOKED';
  icon: string;
}

export interface WebhookEvent {
  id: string;
  topic: string;
  entityContext: string;
  targetEndpoint: string;
  responseCode: number;
  latencyMs: number;
  dispatchedAgo: string;
}
