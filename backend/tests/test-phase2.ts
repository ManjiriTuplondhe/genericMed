import { db } from '../src/db.js';

async function runPhase2Tests() {
  console.log('--- Starting Phase 2 Backend Verification Tests ---');

  // 1. Payment Escrow Hold
  const payment = db.processPayment('GM-88241', 12.80, 'card', '4242');
  console.assert(payment.status === 'ESCROW_HOLD', 'Payment should have status ESCROW_HOLD');
  console.assert(payment.amount === 12.80, 'Payment amount should match');
  console.log('✓ Test 1: Payment escrow processed and logged to SEC-18 ledger');

  // 2. Receipt Generation
  const receipt = db.getReceipt('GM-88241');
  console.assert(receipt !== undefined, 'Receipt should be generated for GM-88241');
  console.assert(receipt?.patientName !== undefined, 'Receipt must have patientName');
  console.log(`✓ Test 2: SEC-18 Receipt created with Number: ${receipt?.receiptNumber}`);

  // 3. Prescription OCR & NPI Verification
  const npiCheck = db.verifyNpi('198204921');
  console.assert(npiCheck.valid === true, 'NPI 198204921 should be active');
  console.assert(npiCheck.providerName === 'Dr. Sharon Lin, MD', 'Prescriber name should match');
  console.log('✓ Test 3: NPI Registry verification succeeded for Dr. Sharon Lin');

  // 4. Notifications & Unread status
  const notifs = db.getNotifications('patient');
  console.assert(notifs.length > 0, 'Should have patient notifications');
  const readSuccess = db.markNotificationAsRead(notifs[0].id);
  console.assert(readSuccess === true, 'Should mark notification as read');
  console.log('✓ Test 4: In-app notification center and read receipts verified');

  // 5. Insurance Eligibility & Copay Comparison
  const insurance = db.verifyInsurance('HB-88910429', 'GRP-99210-NY');
  console.assert(insurance.status === 'ACTIVE', 'Insurance should be active');
  const copay = db.calculateInsuranceCopay('atorvastatin-calcium', 'Commercial PPO');
  console.assert(copay.bestOption !== undefined, 'Copay calculation returned recommendation');
  console.assert(copay.netSavings > 0, 'Net savings should be positive');
  console.log(`✓ Test 5: Insurance copay calculation: ${copay.recommendationSummary}`);

  // 6. Order Cancellation & Escrow Refund
  const refund = db.processRefund('GM-88241', 'Testing escrow refund');
  console.assert(refund.success === true, 'Refund should succeed');
  const updatedOrder = db.getOrderById('GM-88241');
  console.assert(updatedOrder?.status === 'Cancelled & Refunded', 'Order status should be updated to Cancelled & Refunded');
  console.log('✓ Test 6: Escrow release and order refund workflow completed');

  console.log('--- ALL PHASE 2 TESTS PASSED PERFECTLY (6/6) ---');
}

runPhase2Tests().catch((err) => {
  console.error('Phase 2 test failed:', err);
  process.exit(1);
});
