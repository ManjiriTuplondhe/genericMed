export type AppView = 
  | 'customer-search' 
  | 'customer-drug-detail' 
  | 'customer-cart' 
  | 'patient-orders'
  | 'partner-portal' 
  | 'super-admin' 
  | 'dev-console'
  | 'system-architecture'
  | 'auth';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'pharmacist' | 'developer' | 'superadmin';
  roleTitle: string;
  avatarUrl?: string;
  phone?: string;
  orgName?: string;
  deaOrNpi?: string;
  zipCode?: string;
  insurancePreference?: 'Cash-Pay Discount' | 'Commercial Insurance' | 'Medicare / Medicaid';
  twoFactorEnabled?: boolean;
}

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
  status: 'Needs Dispensing' | 'Ready in Locker' | 'Just Received' | 'Packed & Staged' | 'Out for Delivery' | 'Delivered & Verified' | 'Cancelled & Refunded';
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
  type: 'TENANT ISOLATION AUDIT' | 'GLOBAL NDC SYNC' | 'COMMISSION SETTLEMENT RUN' | 'SLA GUARD BREACH' | 'SECURITY / AUDIT EVENT';
  summary: string;
  actorOrTarget: string;
  sha256: string;
  statusBadge: string;
  badgeStyle: 'success' | 'info' | 'primary' | 'warning' | 'neutral';
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

export interface PaymentIntent {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'ESCROW_HOLD' | 'CAPTURED' | 'REFUNDED';
  paymentMethod: 'card' | 'apple_pay' | 'google_pay' | 'fsa_hsa';
  last4?: string;
  createdAt: string;
  escrowReleaseEstimatedAt: string;
}

export interface ReceiptData {
  receiptNumber: string;
  orderId: string;
  date: string;
  patientName: string;
  patientAddress?: string;
  prescriberName?: string;
  prescriberNpi?: string;
  pharmacyName?: string;
  dispensingPharmacy?: string;
  deaRegistration?: string;
  npiPrescriber?: string;
  items: {
    name: string;
    dosage?: string;
    ndc: string;
    quantity: number;
    unitPrice?: number;
    price?: number;
    total?: number;
    brandMSRP?: number;
    brandComparisonPrice?: number;
    savings?: number;
  }[];
  subtotal: number;
  taxesAndFees?: number;
  platformFee?: number;
  deliveryFee?: number;
  tax?: number;
  total?: number;
  totalPaid?: number;
  totalSaved?: number;
  estimatedInsuranceSavings?: number;
  paymentMethod?: string;
}

export interface PrescriptionRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientDob?: string;
  brandPrescribed?: string;
  genericMatched?: string;
  medicationName: string;
  genericEquivalent: string;
  dosage: string;
  quantityText: string;
  refillsTotal: number;
  refillsRemaining: number;
  prescriberName: string;
  prescriberNpi: string;
  prescriberClinic: string;
  rxNumber: string;
  ocrConfidence: number;
  status: 'VERIFIED' | 'PENDING_REVIEW' | 'EXPIRED';
  issuedDate: string;
  expirationDate: string;
  estimatedGenericSavings: number;
}

export interface InAppNotification {
  id: string;
  userId?: string;
  roleTarget?: 'all' | 'patient' | 'pharmacist' | 'superadmin' | 'developer';
  title: string;
  message: string;
  type: 'ORDER_STATUS' | 'SLA_ALERT' | 'REFILL_REMINDER' | 'PRICE_DROP';
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface InsuranceEligibility {
  memberId: string;
  providerName: string;
  groupNumber: string;
  planType: 'Commercial PPO' | 'Medicare Part D' | 'Medicaid' | 'High-Deductible HSA' | 'Comprehensive Health Plan';
  status: 'ACTIVE' | 'PENDING_VERIFICATION' | 'INELIGIBLE';
  deductibleTotal: number;
  deductibleRemaining: number;
  copayGenericTier1: number;
  copayBrandTier3: number;
  genericCashAdvantage: number;
}

export interface AnalyticsTimeSeriesPoint {
  date: string;
  label: string;
  gmv: number;
  patientSavings: number;
  orderCount: number;
}

export interface CategoryVolumeStat {
  category: string;
  volumePercent: number;
  ordersCount: number;
  totalSavings: number;
  color: string;
}

export interface PlatformAnalytics {
  timeframe: '7d' | '30d' | '90d';
  metrics: {
    totalGmv: number;
    gmvChangePercent: number;
    totalPatientSavings: number;
    savingsChangePercent: number;
    activeTenantsCount: number;
    meanSlaMinutes: number;
    totalOrdersCount: number;
    sec18ComplianceRate: number;
  };
  timeSeries: AnalyticsTimeSeriesPoint[];
  categoryBreakdown: CategoryVolumeStat[];
  slaDistribution: {
    under1Hour: number;
    under2Hours: number;
    under4Hours: number;
    breached: number;
  };
  topPerformingTenants: {
    name: string;
    tier: string;
    orders: number;
    volume: number;
    slaScore: number;
  }[];
}

export interface TenantOnboardingPayload {
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
}

export interface PharmacyMarketplaceAdapter {
  id: string;
  name: string;
  vendor: 'QS/1' | 'PioneerRx' | 'Liberty Software' | 'Rx30' | 'Computer-Rx' | 'Epic Willow';
  version: string;
  category: 'PMS Connector' | 'E-Prescribing Gateway' | 'Wholesaler EDI' | 'Automated Dispensing';
  status: 'CONNECTED' | 'DISCONNECTED' | 'SYNCING' | 'ERROR';
  description: string;
  icon: string;
  lastSyncTimestamp?: string;
  inventoryCountSynced: number;
  features: string[];
  protocol: 'REST / JSON' | 'NCPDP SCRIPT v2017071' | 'HL7 FHIR R4' | 'EDI 850/855';
  config: {
    apiUrl?: string;
    authMethod: 'API_KEY' | 'OAUTH2' | 'MTLS';
    autoSyncEnabled: boolean;
    syncIntervalMinutes: number;
  };
}

export interface MultiDrugInteractionCheck {
  medicationIds: string[];
  medicationNames: string[];
  overallRiskLevel: 'HIGH' | 'MODERATE' | 'LOW' | 'NONE';
  summary: string;
  interactions: {
    drug1: string;
    drug2: string;
    severity: 'CRITICAL' | 'MAJOR' | 'MODERATE' | 'MINOR';
    mechanism: string;
    clinicalEffect: string;
    managementRecommendation: string;
    cypEnzymesInvolved?: string[];
  }[];
  fdaWarningCitations: string[];
  checkedAt: string;
}

export interface MultiRegionNode {
  regionId: string;
  regionName: string;
  datacenter: string;
  role: 'PRIMARY_LEADER' | 'READ_REPLICA' | 'STANDBY_FAILOVER';
  status: 'HEALTHY' | 'DEGRADED' | 'FAILOVER_TEST';
  replicationLagMs: number;
  activeConnections: number;
  qpsThroughput: number;
  storageUsagePercent: number;
  lastHealthCheck: string;
  geographicZone: string;
}

export interface FraudDetectionAlert {
  alertId: string;
  orderId?: string;
  patientId?: string;
  riskScore: number; // 0 - 100
  riskLevel: 'CRITICAL_HOLD' | 'SUSPICIOUS_REVIEW' | 'ELEVATED' | 'NORMAL';
  ruleTriggered: 'CONTROLLED_SUBSTANCE_VELOCITY' | 'GEO_ANOMALY' | 'PRESCRIBER_NPI_SURGE' | 'DUPLICATE_RX_FILL' | 'PAYMENT_VELOCITY';
  description: string;
  timestamp: string;
  status: 'PENDING_ACTION' | 'RESOLVED_CLEARED' | 'BLOCKED';
  deaSchedule?: 'Schedule II' | 'Schedule III' | 'Schedule IV' | 'Schedule V' | 'Non-Controlled';
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestedActions?: {
    label: string;
    actionType: 'NAVIGATE' | 'VIEW_DRUG' | 'CHECK_INTERACTION' | 'CALL_PHARMACIST';
    payload?: string;
  }[];
  fdaDisclaimerIncluded?: boolean;
}


