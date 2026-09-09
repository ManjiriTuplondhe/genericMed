import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectMongoDB, isMongoConnected } from '../src/config/mongo';
import {
  MedicineModel,
  OrderModel,
  TenantModel,
  UserModel,
  AuditLogModel
} from '../src/models';

dotenv.config();

async function testMongoDBConnection() {
  console.log('--- Testing MongoDB Atlas Connection & Mongoose Models ---');
  console.log('Target URI:', process.env.MONGODB_URI?.replace(/:([^@]+)@/, ':****@'));

  const connected = await connectMongoDB();
  if (!connected) {
    throw new Error('Could not establish connection to MongoDB Atlas');
  }

  console.log('✓ MongoDB Connection Established');
  console.log('  State:', mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED');
  console.log('  Database Name:', mongoose.connection.name);
  console.log('  Host:', mongoose.connection.host);

  // 1. Verify Medicines Collection
  const medicines = await MedicineModel.find().limit(5);
  console.log(`✓ Medicines Collection: ${medicines.length} document(s) found`);
  medicines.forEach((m) => {
    console.log(`  - [${m.ndc}] ${m.name} (${m.dosage}) - $${m.lowestPrice} (Generic for ${m.brandName})`);
  });

  // 2. Verify Tenant Organizations
  const tenants = await TenantModel.find();
  console.log(`✓ Tenants Collection: ${tenants.length} tenant organization(s) found`);
  tenants.forEach((t) => {
    console.log(`  - Tenant: ${t.name} (${t.tier}) - Shard: ${t.shard}`);
  });

  // 3. Verify Users
  const users = await UserModel.find();
  console.log(`✓ Users Collection: ${users.length} user account(s) found`);

  // 4. Test Write / Query Lifecycle
  const testOrderId = `TEST-ORDER-${Date.now()}`;
  const testOrder = await OrderModel.create({
    orderId: testOrderId,
    patientName: 'MongoDB Atlas Integration Test User',
    patientDemographics: 'Age 38 • Male',
    urgency: 'new-received',
    status: 'Just Received',
    elapsedTime: 'Just now',
    slaTarget: '45 mins remaining',
    tenantId: 'org_apex_rx',
    items: [
      {
        sku: 'SKU-00093-7155-98',
        dosage: '20mg',
        ndc: '00093-7155-98',
        lot: 'LOT-9921',
        exp: '11/2027',
        quantityText: '30 Tablets',
        binLocation: 'Aisle 2 - Shelf B4',
        scanned: false,
        rxRating: 'AB'
      }
    ],
    prescriber: {
      name: 'Dr. Sarah Lin, MD',
      npi: '198204921',
      specialty: 'Cardiology',
      hospital: 'Metro General',
      teleRxVerified: true
    },
    financials: {
      patientTotal: 12.80,
      platformFee: 1.50,
      netPayout: 11.30
    }
  });

  console.log(`✓ Order Write Test: Created order ${testOrder.orderId} in MongoDB`);

  const fetchedOrder = await OrderModel.findOne({ orderId: testOrderId });
  if (!fetchedOrder) {
    throw new Error(`Order ${testOrderId} could not be retrieved from MongoDB`);
  }
  console.log(`✓ Order Read Test: Retrieved order ${fetchedOrder.orderId} with status "${fetchedOrder.status}"`);

  // Clean up test order
  await OrderModel.deleteOne({ orderId: testOrderId });
  console.log(`✓ Order Cleanup Test: Removed temporary test order`);

  console.log('\n🎉 ALL MONGODB ATLAS TESTS COMPLETED SUCCESSFULLY (100% OPERATIONAL)!');

  await mongoose.disconnect();
  console.log('✓ Disconnected cleanly from MongoDB Atlas.');
}

testMongoDBConnection().catch((err) => {
  console.error('❌ MongoDB Test Failed:', err);
  process.exit(1);
});
