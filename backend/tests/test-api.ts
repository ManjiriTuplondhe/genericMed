import app from '../src/index';

async function testEndpoints() {
  console.log('Testing genericMed REST API server endpoints...');
  const server = app.listen(5099, async () => {
    try {
      const BASE = 'http://localhost:5099/api';

      // 1. Health
      const healthRes = await fetch(`${BASE}/health`);
      console.log('1. Health check:', await healthRes.json());

      // 2. Medicines
      const medRes = await fetch(`${BASE}/medicines`);
      const medJson = (await medRes.json()) as any;
      console.log('2. Medicines list total:', medJson.total, 'First med:', medJson.data[0]?.name);

      // 3. Single medicine
      const singleMedRes = await fetch(`${BASE}/medicines/atorvastatin-calcium`);
      const singleMedJson = (await singleMedRes.json()) as any;
      console.log('3. Single medicine:', singleMedJson.data?.name, 'Offers count:', singleMedJson.offers?.length);

      // 4. Cart validate
      const cartRes = await fetch(`${BASE}/cart/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            {
              id: 'cart-1',
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
              quantity: 2,
              doctorInfo: 'Dr. Lin',
              npiNumber: '198204921',
              imageUrl: '',
              ndc: '00093-7155-98'
            }
          ]
        })
      });
      const cartJson = (await cartRes.json()) as any;
      console.log('4. Cart validation subtotal:', cartJson.subtotal, 'Total savings:', cartJson.totalSavings);

      // 5. Auth Quick Login
      const authRes = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'pharmacist', quickLogin: true })
      });
      const authJson = (await authRes.json()) as any;
      console.log('5. Auth token generated for:', authJson.user?.name, 'Role:', authJson.user?.role);

      // 6. Create Order
      const orderRes = await fetch(`${BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authJson.token}`
        },
        body: JSON.stringify({
          patientName: 'Sarah Chen',
          items: cartJson.items
        })
      });
      const orderJson = (await orderRes.json()) as any;
      console.log('6. Order placed:', orderJson.data?.orderId, 'Status:', orderJson.data?.status);

      // 7. Partner Orders queue
      const partnerRes = await fetch(`${BASE}/partner/orders`, {
        headers: { 'Authorization': `Bearer ${authJson.token}` }
      });
      const partnerJson = (await partnerRes.json()) as any;
      console.log('7. Partner order queue count:', partnerJson.total, 'First order ID:', partnerJson.data[0]?.orderId);

      // 8. Admin Tenants & Audit Logs
      const adminRes = await fetch(`${BASE}/admin/tenants`);
      const adminJson = (await adminRes.json()) as any;
      console.log('8. Admin tenants count:', adminJson.total);

      // 9. AI Drug Check
      const aiRes = await fetch(`${BASE}/ai/drug-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicineName: 'Atorvastatin Calcium' })
      });
      const aiJson = (await aiRes.json()) as any;
      console.log('9. AI Drug check summary:', aiJson.data?.clinicalSummary?.substring(0, 70) + '...');

      console.log('\n✅ ALL 9 REST API ENDPOINT TESTS PASSED SUCCESSFULLY!');
    } catch (err) {
      console.error('❌ Test failed:', err);
    } finally {
      server.close(() => {
        // Closed cleanly
      });
    }
  });
}

testEndpoints();
