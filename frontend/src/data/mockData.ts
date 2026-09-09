import { Medicine, PharmacyOffer, CartItem, PartnerOrder, TenantOrg, Sec18AuditLog, ApiCredential, WebhookEvent } from '../types';

export const MEDICINES_DATA: Medicine[] = [
  {
    id: 'atorvastatin-calcium',
    name: 'Atorvastatin Calcium',
    genericName: 'Atorvastatin Calcium',
    brandName: 'Lipitor®',
    brandManufacturer: 'Pfizer',
    dosage: '20mg',
    packageDescription: '20mg • 30 Film-coated Tablets',
    category: 'Cholesterol',
    rxType: 'Rx Only',
    bioequivalentRating: 'AB Bioequivalent',
    brandPrice: 180.00,
    lowestPrice: 12.80,
    savingsPercent: 92,
    savingsAmount: 167.20,
    rating: 4.9,
    reviewCount: 482,
    pharmacyCount: 3,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzRiBb72qasj5ohS9N8Csyw3HnV1eqhzOcMTRdu8xYpviNFpRGJ6Y6ZXkHHKNlZHRqkns_xWOFdrRb2e3Odg-qW6h4zrquKn6CODMVwWRmDAO1D1INMQdC13H6K-wGdHUduF1GJ1QbYx752i3gQ5qtymtwk7gEoz4BYwXI-YSvYKkNTPhPBJDQldglrMZZ9NVEUdnuLRXB780wYLn0rZwbYIIyaRVb3apI4SWe1oueq7PKVqBabLwK',
    description: 'Therapeutically & chemically identical active ingredient verified under FDA Orange Book guidelines.',
    ndc: '00093-7155-98',
    fdaApproved: true,
  },
  {
    id: 'metformin-hci-er',
    name: 'Metformin HCl ER',
    genericName: 'Metformin Hydrochloride Extended Release',
    brandName: 'Glucophage® XR',
    brandManufacturer: 'Bristol-Myers Squibb',
    dosage: '500mg',
    packageDescription: '500mg • 60 Extended Release Tabs',
    category: 'Diabetes',
    rxType: 'Rx Only',
    bioequivalentRating: 'ER Formula',
    brandPrice: 42.50,
    lowestPrice: 6.90,
    savingsPercent: 83,
    savingsAmount: 35.60,
    rating: 4.8,
    reviewCount: 319,
    pharmacyCount: 4,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1U9kRfEop3ylZQIouEik9mUkaoEYjbJhpG4TaiLXjCY-yISsR7QkDebmY3sDHULsxjm9n3mWE5wMCxqlxiQVMEdxutAll7ORrLZm1mcQVyp1XNZo6lLKemlFyE0XXxvdekb9L9mMlF8mTuN3Er0pzrgjGxjXHEwRqvRUWY4Ii74-pVWAWjcAGjvHURZoj9mCLJd2gDl1Fbbp3mWb1DP84YpDX5mQ5kmx20LfQod0zLH_EM0sbVuGM',
    description: 'First-line medication for the treatment of type 2 diabetes, formulated for steady 24-hour absorption.',
    ndc: '68180-0337-01',
    fdaApproved: true,
  },
  {
    id: 'amoxicillin-trihydrate',
    name: 'Amoxicillin Trihydrate',
    genericName: 'Amoxicillin Trihydrate',
    brandName: 'Amoxil®',
    brandManufacturer: 'GlaxoSmithKline',
    dosage: '500mg',
    packageDescription: '500mg • 21 Capsules',
    category: 'Antibiotics',
    rxType: 'Rx Antibiotic',
    bioequivalentRating: 'Fast Dissolve',
    brandPrice: 34.00,
    lowestPrice: 9.50,
    savingsPercent: 72,
    savingsAmount: 24.50,
    rating: 4.7,
    reviewCount: 210,
    pharmacyCount: 2,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnVh3XOw_g01KJ94j-XSCbz7MJ-GO9KJxaqp-MKgdY7AenFSQc0OLlrk3h6BPw1iM0rtWpyIxp3zxLwOUMkVRjtGkA_Ppf__B6f2Ou22lzTjEO4x_wgP0D86f7EPlDZ2KdGRMdybvC5C3ybMojH3ztvNgy8oAg6EoX5SgjssKrIbKhUMe7ROj1LHeIWIlM_-ZVYeQXXvREMtzRIJoURVfxQH0uuqAtyQDyiKplTJB58-0l8G-KtSVs',
    description: 'Broad-spectrum aminopenicillin antibiotic used to treat a wide variety of bacterial infections.',
    ndc: '00781-2613-05',
    fdaApproved: true,
  },
  {
    id: 'acetaminophen-care-pack',
    name: 'Acetaminophen Care Pack',
    genericName: 'Acetaminophen Extra Strength',
    brandName: 'Tylenol® Extra Strength',
    brandManufacturer: 'Johnson & Johnson',
    dosage: '500mg',
    packageDescription: '500mg • 100 Caplets • Extra Strength',
    category: 'Pain Relief',
    rxType: 'OTC Medicine',
    bioequivalentRating: 'Tylenol® Active Salt',
    brandPrice: 14.99,
    lowestPrice: 2.90,
    savingsPercent: 80,
    savingsAmount: 12.09,
    rating: 4.9,
    reviewCount: 1402,
    pharmacyCount: 5,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpN1R2RYzg1PPBsv37TUsZ34ju3pHytv26u3YqrsHcimWjJLGuj42rgHjoD1sgEo9ShZTAM8cGyUC2Ldo-RXBzXa2VJoeE6O0_8Z-L3MF0Xap8hbNarkmqHluU3zCbn3_tJpG3GiE5opiKF5Aa4VY34uZnL72rYA7Te-U7WtVFZHXGhPmPeZ9imdZnNFXI7qfq4FPbbVdx65P4PBG4aNvuMexcfBd4LPxOmSwL4chGnoomBxd0R4Ju',
    description: 'Pain reliever and fever reducer formulated with 100% bioequivalent USP acetaminophen active ingredient.',
    ndc: '50580-498-00',
    fdaApproved: true,
  }
];

export const PHARMACY_OFFERS: PharmacyOffer[] = [
  {
    id: 'offer-carepoint',
    pharmacyName: 'CarePoint Pharmacy & Medical',
    nodeId: 'US-CP-049',
    subtitle: 'Downtown Clinical Hub • Express Dispensary',
    rating: 4.9,
    auditCount: 1200,
    distanceMiles: 1.4,
    price: 12.80,
    brandBenchmarkPrice: 180.00,
    savingsAmount: 167.20,
    platformFee: 'Zero Platform Fee',
    deliveryEstimate: 'Today by 5:30 PM (2h SLA)',
    slaMinutes: 120,
    slaBadge: '2h SLA',
    inStock: true,
    stockCountVerified: 45,
    tagBadge: 'BEST PRICE MATCH',
    badgeType: 'best-match'
  },
  {
    id: 'offer-apollo',
    pharmacyName: 'Apollo MedCorp',
    nodeId: 'US-APL-9401',
    subtitle: 'Downtown Clinical Hub',
    rating: 4.8,
    auditCount: 840,
    distanceMiles: 0.8,
    price: 14.20,
    brandBenchmarkPrice: 180.00,
    savingsAmount: 165.80,
    platformFee: 'Standard Generic Copay',
    deliveryEstimate: 'Dispatch in 45 mins',
    slaMinutes: 45,
    slaBadge: '45m SLA',
    inStock: true,
    stockCountVerified: 120,
    tagBadge: 'FASTEST DELIVERY',
    badgeType: 'fastest'
  },
  {
    id: 'offer-medlife',
    pharmacyName: 'MedLife Express',
    nodeId: 'US-MLE-3319',
    subtitle: 'Suburban Dispensary',
    rating: 4.7,
    auditCount: 610,
    distanceMiles: 2.6,
    price: 15.00,
    brandBenchmarkPrice: 180.00,
    savingsAmount: 165.00,
    platformFee: 'Free ship on $25+',
    deliveryEstimate: 'Tomorrow Morning (Scheduled)',
    slaMinutes: 720,
    slaBadge: 'Next Day',
    inStock: true,
    stockCountVerified: 88,
    badgeType: 'standard'
  },
  {
    id: 'offer-quickcure',
    pharmacyName: 'QuickCure Local Store',
    nodeId: 'US-QCK-1042',
    subtitle: 'Neighborhood Partner • 0.4 mi away',
    rating: 4.5,
    auditCount: 290,
    distanceMiles: 0.4,
    price: 16.50,
    brandBenchmarkPrice: 180.00,
    savingsAmount: 163.50,
    platformFee: 'Curbside Ready',
    deliveryEstimate: 'Restocking (24h replenish)',
    slaMinutes: 1440,
    slaBadge: 'Restocking',
    inStock: false,
    isOutOfStock: true,
    badgeType: 'standard'
  }
];

export const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: 'cart-item-1',
    medicineId: 'atorvastatin-calcium',
    name: 'Atorvastatin Calcium',
    strength: '20mg',
    format: 'Film-Coated',
    countDescription: '30 Tablets',
    brandEquivalent: 'Lipitor®',
    brandMSRP: 180.00,
    price: 12.80,
    savings: 167.20,
    savingsPercentage: 92.8,
    quantity: 1,
    doctorInfo: 'Dr. S. Lin (NPI: #198204921)',
    npiNumber: '198204921',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjERVoh1WLWzLLtA57TZ9vfEFD96GYAqz2nIUPUGfJiyFvW2bgIdKa0rl36W1dZA8A1H5mOfolJZkO8AdYP2TM8mLhLUsnbCNcCgCwOdfh6dP4r_BPdxg9duBACwc3bWGqvIt6uuHc9ojHf0IfilCCKg327JSde2d2Qx_s8DEcD1flhlxUoMzS4ihPJKQE0U0cRBbNdhzD1NNOnAm97tTr0KyrXlDJHs9FPPV0BLMdSS91hanNJM05',
    ndc: '00093-7155-98'
  },
  {
    id: 'cart-item-2',
    medicineId: 'metformin-hci-er',
    name: 'Metformin HCl ER',
    strength: '500mg',
    format: 'Extended Release',
    countDescription: '60 Tabs',
    brandEquivalent: 'Glucophage XR®',
    brandMSRP: 42.50,
    price: 6.90,
    savings: 35.60,
    savingsPercentage: 83.7,
    quantity: 1,
    doctorInfo: 'Pre-authorized • 2 Refills Remaining',
    npiNumber: '198204921',
    refillsRemaining: 2,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjtGvTAWhrcruAWvaiapCpi4UrE0quoMjP1mwZ0O-b6l8D2-mGD2CA7Usv7rU4LisLvTrcqc7-UqfmWPu_4_0RYIM2gQTuKqqywde6m_UxGXifdgpj3uZbzg2SugJxa-TqWcYYo32QlQVvNQ04tEPGBoObNaz55w7lHofhy6iXNzjUwfco_LMRCkKzxyzgAr0PugdjpG1TLTxTruDbhGxfzDQCnXJas3s0kEqBIjfyXS4JpW2VAIOc',
    ndc: '68180-0337-01'
  }
];

export const PARTNER_ORDERS_DATA: PartnerOrder[] = [
  {
    orderId: 'GM-88241',
    patientName: 'David Miller',
    patientDemographics: 'M, 54',
    urgency: 'urgent-2h',
    status: 'Needs Dispensing',
    elapsedTime: '04:12',
    slaTarget: '15:00',
    courierEta: '18 mins',
    courierName: 'Driver Marcus B.',
    courierVan: 'Van #NY-442',
    courierStatus: '18 mins to Store • Geo-tracking Active',
    patientAddress: '142 Joralemon St, Apt 4B, Brooklyn NY',
    items: [
      {
        sku: 'Atorvastatin Calcium 20mg',
        dosage: 'Film-Coated Tab',
        ndc: '00093-7155-98',
        lot: 'AT-2026-X8',
        exp: '11/2026',
        quantityText: '30 Tabs',
        binLocation: 'Shelf A-14',
        scanned: true,
        rxRating: 'AB Rated'
      },
      {
        sku: 'Metformin HCl ER 500mg',
        dosage: 'Ext-Release',
        ndc: '68180-0337-01',
        lot: 'MF-9941-K2',
        exp: '08/2027',
        quantityText: '60 Tabs',
        binLocation: 'Shelf D-08',
        scanned: true,
        rxRating: 'AB Rated'
      }
    ],
    prescriber: {
      name: 'Dr. Sharon Lin, MD',
      npi: '198204921',
      specialty: 'Cardiology',
      hospital: 'New York Presbyterian Medical Group',
      teleRxVerified: true
    },
    financials: {
      patientTotal: 19.70,
      platformFee: 2.36,
      netPayout: 17.34
    }
  },
  {
    orderId: 'GM-88245',
    patientName: 'Elena Rostova',
    patientDemographics: 'F, 38',
    urgency: 'curbside-ready',
    status: 'Ready in Locker',
    elapsedTime: '01:20',
    slaTarget: '30:00',
    customerPin: '#8824',
    patientAddress: 'Pickup Locker #3 • CarePoint Curbside',
    items: [
      {
        sku: 'Paracetamol 500mg Extra Strength',
        dosage: 'Caplets',
        ndc: '50580-498-00',
        lot: 'PR-2026-C1',
        exp: '04/2028',
        quantityText: '100 Caplets',
        binLocation: 'OTC-04',
        scanned: true,
        rxRating: 'USP Grade'
      }
    ],
    prescriber: {
      name: 'OTC Pharmacist Verified',
      npi: 'N/A (Direct Over-The-Counter)',
      specialty: 'Pharmacy Staff Check',
      hospital: 'CarePoint Downtown',
      teleRxVerified: true
    },
    financials: {
      patientTotal: 2.90,
      platformFee: 0.35,
      netPayout: 2.55
    }
  },
  {
    orderId: 'GM-88249',
    patientName: 'J. Kowalski',
    patientDemographics: 'M, 29',
    urgency: 'new-received',
    status: 'Just Received',
    elapsedTime: '00:18',
    slaTarget: '15:00',
    claimTimerSeconds: 102,
    patientAddress: '88 Prospect Park W, Brooklyn, NY',
    items: [
      {
        sku: 'Amoxicillin 500mg Capsules',
        dosage: 'Oral Capsule',
        ndc: '00781-2613-05',
        lot: 'AM-2026-P9',
        exp: '03/2027',
        quantityText: '21 Caps',
        binLocation: 'Shelf B-02',
        scanned: false,
        rxRating: 'AB Bioequivalent'
      }
    ],
    prescriber: {
      name: 'Dr. Arthur Campbell, DO',
      npi: '104829104',
      specialty: 'Infectious Disease',
      hospital: 'Brooklyn Community Clinic',
      teleRxVerified: true
    },
    financials: {
      patientTotal: 9.50,
      platformFee: 1.14,
      netPayout: 8.36
    }
  }
];

export const TENANT_ORGS_DATA: TenantOrg[] = [
  {
    id: 'org_apl_9401',
    slug: 'apollo-medcorp',
    name: 'Apollo MedCorp',
    schemaKey: 'tenant_apollo_prod',
    tier: 'Enterprise Tier',
    takeRate: 12.0,
    shard: 'us-east-db-01',
    replicaLag: '0.2ms',
    monthlyOrders: 4820,
    monthlyVolumeText: '4,820 orders/mo',
    slaRate: 99.4,
    complianceStatus: 'HIPAA & DEA Validated',
    nodeHealthPercent: 99.8,
    healthStatus: 'OK'
  },
  {
    id: 'org_cpr_8820',
    slug: 'carepoint-rx',
    name: 'CarePoint Rx & Medical',
    schemaKey: 'tenant_carepoint_prod',
    tier: 'Standard Partner',
    takeRate: 11.5,
    shard: 'us-east-db-01',
    replicaLag: '0.3ms',
    monthlyOrders: 3190,
    monthlyVolumeText: '3,190 orders/mo',
    slaRate: 99.1,
    complianceStatus: 'Verified',
    nodeHealthPercent: 99.9,
    healthStatus: 'OK'
  },
  {
    id: 'org_mle_3319',
    slug: 'medlife-express',
    name: 'MedLife Express',
    schemaKey: 'tenant_medlife_prod',
    tier: 'Regional Partner',
    takeRate: 12.5,
    shard: 'us-east-db-02',
    replicaLag: '0.8ms',
    monthlyOrders: 5410,
    monthlyVolumeText: '5,410 orders/mo',
    slaRate: 97.4,
    complianceStatus: 'SLA Warning',
    nodeHealthPercent: 97.4,
    healthStatus: 'PROBATION'
  },
  {
    id: 'org_qck_1042',
    slug: 'quickcure-direct',
    name: 'QuickCure Direct',
    schemaKey: 'tenant_quickcure_prod',
    tier: 'Starter Dispensary',
    takeRate: 10.0,
    shard: 'us-east-db-02',
    replicaLag: '0.1ms',
    monthlyOrders: 1120,
    monthlyVolumeText: '1,120 orders/mo',
    slaRate: 99.8,
    complianceStatus: 'Verified',
    nodeHealthPercent: 100.0,
    healthStatus: 'OK'
  },
  {
    id: 'org_mph_0094',
    slug: 'metropharma-hub',
    name: 'MetroPharma Hub (Provisioning)',
    schemaKey: 'tenant_metropharma_stg',
    tier: 'Enterprise Sandbox',
    takeRate: 12.0,
    shard: 'us-east-db-03',
    replicaLag: 'Migration Ready',
    monthlyOrders: 0,
    monthlyVolumeText: '0 / pre-live',
    slaRate: 100.0,
    complianceStatus: 'DEA Under Review',
    nodeHealthPercent: 100.0,
    healthStatus: 'IN-FLIGHT'
  }
];

export const AUDIT_LOGS_DATA: Sec18AuditLog[] = [
  {
    id: 'audit-1',
    timestampUtc: '14:48:12 UTC',
    type: 'TENANT ISOLATION AUDIT',
    summary: 'Automated query scanner checked 18,420 tenant-scoped queries; 0 cross-tenant data leaks detected.',
    actorOrTarget: 'Actor: Tenant_Isolation_Daemon (worker-east-01)',
    sha256: '4f8ae29b0811c79802d2f3a609d94f61e89dcb7547020a112df380e210ca3824',
    statusBadge: 'PASSED (0ms leak)',
    badgeStyle: 'success'
  },
  {
    id: 'audit-2',
    timestampUtc: '14:42:05 UTC',
    type: 'GLOBAL NDC SYNC',
    summary: 'FDA Orange Book nightly catalog differential applied (+142 new generic bioequivalent salts approved).',
    actorOrTarget: 'Actor: System_Cron_Job (worker-east-09)',
    sha256: 'e4b981ca982fa1029c8821adbc430291938faedc918237461947bca8810293fa',
    statusBadge: 'COMMITTED',
    badgeStyle: 'info'
  },
  {
    id: 'audit-3',
    timestampUtc: '14:35:50 UTC',
    type: 'COMMISSION SETTLEMENT RUN',
    summary: 'ACH Batch #SETTLE-2026-09-08 processed $84,210 to 4 partner dispensary accounts. Zero ledger variance.',
    actorOrTarget: 'Escrow clearance: 48h dispense rule satisfied across 114 orders.',
    sha256: '98dcf1082ab28394bca0918471b8294719284719283746192847192837461928',
    statusBadge: 'SETTLED',
    badgeStyle: 'primary'
  },
  {
    id: 'audit-4',
    timestampUtc: '14:18:22 UTC',
    type: 'SLA GUARD BREACH',
    summary: 'Tenant C (MedLife Express) triggered automated warning (Courier dispatch SLA fell below 98.0% threshold).',
    actorOrTarget: 'Notification sent to partner operations lead: ops@medlife-rx.com',
    sha256: '18491028471b2849182741928374192847192837461928471928374619284719',
    statusBadge: 'ALERT DISPATCHED',
    badgeStyle: 'warning'
  }
];

export const API_CREDENTIALS_DATA: ApiCredential[] = [
  {
    id: 'cred-1',
    label: 'Production Primary Gateway',
    keyPrefix: 'gmed_live_89f2****************4a91',
    scopes: ['medicine:read', 'offers:compare', 'orders:write', 'webhooks:receive'],
    createdDate: 'Sep 14, 2025',
    lastDispatched: '4 seconds ago',
    status: 'ACTIVE',
    icon: 'key'
  },
  {
    id: 'cred-2',
    label: 'Production Ingestion Worker',
    keyPrefix: 'gmed_live_33b1****************78ef',
    scopes: ['inventory:sync', 'pricing:matrix'],
    createdDate: 'Oct 02, 2025',
    lastDispatched: '2 mins ago',
    status: 'ACTIVE',
    icon: 'sync_alt'
  },
  {
    id: 'cred-3',
    label: 'Staging Sandbox Key',
    keyPrefix: 'gmed_test_90a1****************11cb',
    scopes: ['* (All Staging Permissions)'],
    createdDate: 'Jan 11, 2026',
    lastDispatched: '3 hours ago',
    status: 'SANDBOX',
    icon: 'science'
  }
];

export const WEBHOOK_EVENTS_DATA: WebhookEvent[] = [
  {
    id: 'evt_998124',
    topic: 'order.dispensed',
    entityContext: 'Order #GM-88241',
    targetEndpoint: 'https://api.healthbridge.io/webhooks/...',
    responseCode: 200,
    latencyMs: 48,
    dispatchedAgo: '1m ago'
  },
  {
    id: 'evt_998123',
    topic: 'price.revalidated',
    entityContext: 'Cart #CRT-4029',
    targetEndpoint: 'https://api.healthbridge.io/webhooks/...',
    responseCode: 200,
    latencyMs: 32,
    dispatchedAgo: '4m ago'
  },
  {
    id: 'evt_998119',
    topic: 'order.created',
    entityContext: 'Order #GM-88239',
    targetEndpoint: 'https://api.healthbridge.io/webhooks/...',
    responseCode: 200,
    latencyMs: 51,
    dispatchedAgo: '12m ago'
  }
];
