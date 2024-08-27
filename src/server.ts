import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateTokenomicsWithClaudeAI, getCompetitiveAnalysis, getMarketData } from './services/claudeAIService';


dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

console.log(process.env.ANTHROPIC_API_KEY)
app.post('/api/tokenomics/generate', async (req, res) => {
  try {
    const {input, experienceLevel}= req.body;
    const scenarios = await generateTokenomicsWithClaudeAI(input,experienceLevel);
    res.json(scenarios);
  } catch (error) {
    console.error('Error generating tokenomics scenarios:', error);
    res.status(500).json({ error: 'Failed to generate tokenomics scenarios' });
  }
});

app.get('/api/market-data/:projectName', async (req, res) => {
  try {
    const { projectName } = req.params;
    const { blockchainPlatform } = req.query;

    if (!blockchainPlatform || typeof blockchainPlatform !== 'string') {
      return res.status(400).json({ error: 'Blockchain platform is required as a query parameter' });
    }
    console.log(projectName,blockchainPlatform);
    const marketData = await getMarketData(projectName, blockchainPlatform);
    res.json(marketData);
  } catch (error) {
    console.error('Error fetching market data:', error);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

app.post('/api/competitive-analysis', async (req, res) => {
  try {
    const { projectName, competitors } = req.body;
    const analysis = await getCompetitiveAnalysis(projectName, competitors);
    res.json(analysis);
  } catch (error) {
    console.error('Error fetching competitive analysis:', error);
    res.status(500).json({ error: 'Failed to fetch competitive analysis' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});