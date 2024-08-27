// src/routes/tokenomics.ts

import express from 'express';
import { generateTokenomicsWithClaudeAI } from '../services/claudeAIService';
import { EnhancedTokenomicsInput } from '../types/tokenomics';

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const input: EnhancedTokenomicsInput = req.body;
    const scenarios = await generateTokenomicsWithClaudeAI(input);
    res.json(scenarios);
  } catch (error) {
    console.error('Error generating tokenomics scenarios:', error);
    res.status(500).json({ error: 'Failed to generate tokenomics scenarios' });
  }
});

export default router;