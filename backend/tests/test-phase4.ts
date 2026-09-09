import express from 'express';
import cors from 'cors';
import marketplaceRouter from '../src/routes/marketplace';
import regionsRouter from '../src/routes/regions';
import fraudRouter from '../src/routes/fraud';
import aiRouter from '../src/routes/ai';
import { db } from '../src/db';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/marketplace', marketplaceRouter);
app.use('/api/regions', regionsRouter);
app.use('/api/fraud', fraudRouter);
app.use('/api/ai', aiRouter);

const PORT = 5003;

async function runPhase4Tests() {
  console.log('--- Starting genericMed Phase 4: Enterprise & Marketplace Verification Suite ---');
  const server = app.listen(PORT);

  try {
    const baseUrl = `http://localhost:${PORT}/api`;

    // 1. Test PMS Marketplace Adapters
    const adaptersRes = await fetch(`${baseUrl}/marketplace/adapters`);
    const adaptersJson = (await adaptersRes.json()) as any;
    if (!adaptersJson.success || adaptersJson.adapters.length < 3) {
      throw new Error(`Expected at least 3 PMS adapters, got ${adaptersJson.adapters?.length}`);
    }
    console.log(`✓ Test 1: PMS Marketplace Adapters fetched (${adaptersJson.adapters.length} connectors: ${adaptersJson.adapters.map((a: any) => a.vendor).join(', ')})`);

    // 2. Test On-Demand PMS Inventory Sync
    const syncRes = await fetch(`${baseUrl}/marketplace/adapters/pms-qs1-connect/sync`, { method: 'POST' });
    const syncJson = (await syncRes.json()) as any;
    if (!syncJson.success || !syncJson.syncedItems) {
      throw new Error('Failed to sync PMS adapter inventory');
    }
    console.log(`✓ Test 2: On-demand PMS inventory sync executed (+${syncJson.syncedItems} NDCs updated via ${syncJson.adapter.name})`);

    // 3. Test Multi-Drug Clinical Interaction Matrix
    const interactionRes = await fetch(`${baseUrl}/ai/multi-drug-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medicationIds: ['atorvastatin-calcium', 'amoxicillin-trihydrate'] })
    });
    const interactionJson = (await interactionRes.json()) as any;
    if (!interactionJson.success || !interactionJson.data.interactions) {
      throw new Error('Multi-drug check failed');
    }
    console.log(`✓ Test 3: Multi-drug interaction matrix evaluated: ${interactionJson.data.interactions.length} finding(s) | Risk level: ${interactionJson.data.overallRiskLevel}`);

    // 4. Test 24/7 Patient Clinical AI Assistant Chat
    const chatRes = await fetch(`${baseUrl}/ai/patient-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Can I take generic Lipitor with grapefruit juice?' })
    });
    const chatJson = (await chatRes.json()) as any;
    if (!chatJson.success || !chatJson.message.text) {
      throw new Error('AI Patient clinical assistant chat failed');
    }
    console.log(`✓ Test 4: 24/7 Patient Clinical AI Assistant responded with ${chatJson.message.suggestedActions?.length} suggested action(s)`);

    // 5. Test Multi-Region Replication & Failover
    const regionStatusRes = await fetch(`${baseUrl}/regions/status`);
    const regionStatusJson = (await regionStatusRes.json()) as any;
    if (!regionStatusJson.success || regionStatusJson.nodes.length < 3) {
      throw new Error('Multi-region status failed');
    }
    console.log(`✓ Test 5: Multi-Region topology verified (${regionStatusJson.nodes.length} cluster regions | Primary: ${regionStatusJson.globalTopology.primaryRegion})`);

    const failoverRes = await fetch(`${baseUrl}/regions/simulate-failover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetRegionId: 'us-west-2' })
    });
    const failoverJson = (await failoverRes.json()) as any;
    if (!failoverJson.success || failoverJson.newLeader !== 'us-west-2') {
      throw new Error('Disaster recovery failover simulation failed');
    }
    console.log(`✓ Test 6: Zero-downtime disaster recovery failover executed (Promoted: ${failoverJson.newLeader} in ${failoverJson.failoverDurationMs}ms)`);

    // 6. Test Fraud Detection & DEA Velocity Evaluator
    const fraudEvalRes = await fetch(`${baseUrl}/fraud/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: 'usr_849201',
        orderItems: [
          { medicineId: 'med-1', quantity: 12 }
        ],
        prescriberNpi: '9991827364'
      })
    });
    const fraudEvalJson = (await fraudEvalRes.json()) as any;
    if (typeof fraudEvalJson.riskScore !== 'number') {
      throw new Error('Fraud evaluation failed');
    }
    console.log(`✓ Test 7: Real-time fraud velocity engine evaluated: Risk Score ${fraudEvalJson.riskScore}/100 (${fraudEvalJson.riskLevel}) | Flags: ${fraudEvalJson.flags.length}`);

    console.log('\n🎉 ALL 7 PHASE 4 END-TO-END TESTS PASSED PERFECTLY (7/7)!');
  } finally {
    server.close();
  }
}

runPhase4Tests().catch((err) => {
  console.error('❌ Phase 4 Verification Failed:', err);
  process.exit(1);
});
