import mongoose from 'mongoose';
import dns from 'dns';
import { logger } from '../utils/logger';

// Ensure standard public DNS servers are used for MongoDB SRV resolution if local DNS blocks SRV
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch {
  // Ignore if custom DNS resolution cannot be overridden
}
import {
  MedicineModel,
  PharmacyOfferModel,
  OrderModel,
  TenantModel,
  UserModel,
  AuditLogModel
} from '../models';
import {
  MEDICINES_DATA,
  PHARMACY_OFFERS,
  PARTNER_ORDERS_DATA,
  TENANT_ORGS_DATA,
  AUDIT_LOGS_DATA
} from '../data/mockData';

let isConnected = false;

export function isMongoConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

export async function connectMongoDB(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    logger.warn('No MONGODB_URI found in environment; operating in in-memory mode.');
    return false;
  }

  try {
    logger.info('Connecting to MongoDB Atlas cluster...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    isConnected = true;
    const dbName = mongoose.connection.name || 'genericmed';
    logger.info(`✓ Successfully connected to MongoDB Atlas database: "${dbName}"`);

    // Auto-seed initial catalog and records if collection is empty
    await seedMongoDatabaseIfEmpty();

    return true;
  } catch (error: any) {
    isConnected = false;
    logger.error(`MongoDB connection failed: ${error.message}. Running in resilient fallback mode.`);
    return false;
  }
}

export async function seedMongoDatabaseIfEmpty(): Promise<void> {
  if (!isMongoConnected()) return;

  // 1. Medicines
  try {
    const medCount = await MedicineModel.countDocuments();
    if (medCount === 0) {
      logger.info('Seeding MongoDB with initial generic medicines catalog...');
      const medDocs = MEDICINES_DATA.map((m) => ({
        medicineId: m.id,
        ...m
      }));
      await MedicineModel.insertMany(medDocs);
      logger.info(`✓ Seeded ${medDocs.length} medicines into MongoDB.`);
    }
  } catch (err: any) {
    logger.warn(`Notice seeding medicines: ${err.message}`);
  }

  // 2. Pharmacy Offers
  try {
    const offerCount = await PharmacyOfferModel.countDocuments();
    if (offerCount === 0) {
      logger.info('Seeding MongoDB with initial pharmacy offers...');
      const offerDocs: any[] = [];
      MEDICINES_DATA.forEach((med) => {
        PHARMACY_OFFERS.forEach((off) => {
          offerDocs.push({
            offerId: `${off.id}-${med.id}`,
            medicineId: med.id,
            pharmacyName: off.pharmacyName,
            nodeId: off.nodeId,
            subtitle: off.subtitle,
            rating: off.rating,
            auditCount: off.auditCount,
            distanceMiles: off.distanceMiles,
            price: Number((med.lowestPrice * (off.price / 12.80)).toFixed(2)),
            brandBenchmarkPrice: med.brandPrice,
            savingsAmount: Number((med.brandPrice - med.lowestPrice * (off.price / 12.80)).toFixed(2)),
            platformFee: off.platformFee,
            deliveryEstimate: off.deliveryEstimate,
            slaMinutes: off.slaMinutes,
            slaBadge: off.slaBadge,
            inStock: off.inStock,
            stockCountVerified: off.stockCountVerified || 50,
            tagBadge: off.tagBadge,
            badgeType: off.badgeType || 'standard',
            isOutOfStock: off.isOutOfStock || false
          });
        });
      });
      await PharmacyOfferModel.insertMany(offerDocs);
      logger.info(`✓ Seeded ${offerDocs.length} pharmacy offers into MongoDB.`);
    }
  } catch (err: any) {
    logger.warn(`Notice seeding offers: ${err.message}`);
  }

  // 3. Tenants
  try {
    const tenantCount = await TenantModel.countDocuments();
    if (tenantCount === 0) {
      logger.info('Seeding MongoDB with tenant organizations...');
      const tenantDocs = TENANT_ORGS_DATA.map((t) => ({
        tenantId: t.id,
        ...t
      }));
      await TenantModel.insertMany(tenantDocs);
      logger.info(`✓ Seeded ${tenantDocs.length} tenant organizations into MongoDB.`);
    }
  } catch (err: any) {
    logger.warn(`Notice seeding tenants: ${err.message}`);
  }

  // 4. Partner Orders
  try {
    const orderCount = await OrderModel.countDocuments();
    if (orderCount === 0) {
      logger.info('Seeding MongoDB with initial partner orders...');
      const orderDocs = PARTNER_ORDERS_DATA.map((o) => ({
        ...o
      }));
      await OrderModel.insertMany(orderDocs);
      logger.info(`✓ Seeded ${orderDocs.length} partner orders into MongoDB.`);
    }
  } catch (err: any) {
    logger.warn(`Notice seeding partner orders: ${err.message}`);
  }

  // 5. Audit Logs
  try {
    const auditCount = await AuditLogModel.countDocuments();
    if (auditCount === 0) {
      logger.info('Seeding MongoDB with initial SEC-18 compliance audit logs...');
      const auditDocs = AUDIT_LOGS_DATA.map((a) => ({
        logId: a.id,
        ...a
      }));
      await AuditLogModel.insertMany(auditDocs);
      logger.info(`✓ Seeded ${auditDocs.length} audit logs into MongoDB.`);
    }
  } catch (err: any) {
    logger.warn(`Notice seeding audit logs: ${err.message}`);
  }

  // 6. Users
  try {
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      logger.info('Seeding MongoDB with default demo user accounts...');
      const defaultUsers = [
        {
          userId: 'usr_pat_sarah',
          email: 'patient@demo.internal',
          name: 'Sarah Chen (Patient)',
          role: 'patient',
          organizationName: 'Independent Patient Network'
        },
        {
          userId: 'usr_pharm_marcus',
          email: 'pharmacist@demo.internal',
          name: 'Dr. Marcus Vance, PharmD',
          role: 'pharmacist',
          organizationName: 'Apex Care Specialty Pharmacy',
          tenantId: 'org_apex_rx',
          licenseNumber: 'RPH-992140'
        },
        {
          userId: 'usr_admin_elena',
          email: 'superadmin@demo.internal',
          name: 'Elena Rostova (Compliance Dir.)',
          role: 'superadmin',
          organizationName: 'genericMed HQ'
        }
      ];
      await UserModel.insertMany(defaultUsers);
      logger.info(`✓ Seeded ${defaultUsers.length} user accounts into MongoDB.`);
    }
  } catch (err: any) {
    logger.warn(`Notice seeding users: ${err.message}`);
  }
}
