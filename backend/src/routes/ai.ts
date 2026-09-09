import { Router, Request, Response } from 'express';
import { geminiService } from '../services/gemini';
import { db } from '../db';
import { createRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Protect AI endpoints with rate limiter (30 requests per minute)
const aiLimiter = createRateLimiter({ maxRequests: 30, windowMs: 60 * 1000 });
router.use(aiLimiter);

// POST /api/ai/drug-check - Drug interaction check with Gemini AI
router.post('/drug-check', async (req: Request, res: Response) => {
  const { medicineName, patientContext } = req.body;

  if (!medicineName || typeof medicineName !== 'string') {
    res.status(400).json({
      error: "Missing required 'medicineName' parameter.",
      code: 'MISSING_MEDICINE_NAME'
    });
    return;
  }

  try {
    const analysis = await geminiService.checkDrugInteractions(medicineName, patientContext);
    res.json({
      success: true,
      data: analysis
    });
  } catch {
    res.status(500).json({
      error: 'Failed to process clinical AI interaction check.',
      code: 'AI_PROCESSING_ERROR'
    });
  }
});

// POST /api/ai/search - Intelligent medical search with Gemini AI
router.post('/search', async (req: Request, res: Response) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    res.status(400).json({
      error: "Missing required 'query' in request body.",
      code: 'MISSING_QUERY'
    });
    return;
  }

  const catalog = db.getMedicines().map((m) => ({
    id: m.id,
    name: m.name,
    genericName: m.genericName,
    category: m.category
  }));

  try {
    const searchResult = await geminiService.searchMedicines(query, catalog);
    const matchedMedicines = searchResult.matchedMedicineIds
      .map((id) => db.getMedicineById(id))
      .filter(Boolean);

    res.json({
      success: true,
      data: {
        ...searchResult,
        medicines: matchedMedicines
      }
    });
  } catch {
    res.status(500).json({
      error: 'Failed to complete AI semantic search.',
      code: 'AI_SEARCH_ERROR'
    });
  }
});

// POST /api/ai/multi-drug-check - Multi-drug interaction matrix check
router.post('/multi-drug-check', (req: Request, res: Response) => {
  const { medicationIds } = req.body;

  if (!medicationIds || !Array.isArray(medicationIds) || medicationIds.length === 0) {
    res.status(400).json({
      error: "Missing or invalid 'medicationIds' array in request body.",
      code: 'MISSING_MEDICATION_IDS'
    });
    return;
  }

  try {
    const analysis = db.checkMultiDrugInteractions(medicationIds);
    res.json({
      success: true,
      data: analysis
    });
  } catch (err: any) {
    res.status(500).json({
      error: err.message || 'Failed to analyze multi-drug interactions.',
      code: 'MULTI_DRUG_CHECK_ERROR'
    });
  }
});

// POST /api/ai/patient-chat - 24/7 Patient Clinical Support Assistant
router.post('/patient-chat', (req: Request, res: Response) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({
      error: "Missing required 'message' string in request body.",
      code: 'MISSING_MESSAGE'
    });
    return;
  }

  try {
    const reply = db.generatePatientChatResponse(message, history || []);
    res.json({
      success: true,
      message: reply
    });
  } catch (err: any) {
    res.status(500).json({
      error: err.message || 'Failed to process clinical chat assistant message.',
      code: 'CHAT_ASSISTANT_ERROR'
    });
  }
});

export default router;
