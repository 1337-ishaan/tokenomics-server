import { CompetitiveAnalysis, EnhancedTokenomicsInput, MarketData, TokenomicsScenario } from '../types/tokenomics';
import { anthropic } from '../lib/anthropic';
import { ContentBlock } from '@anthropic-ai/sdk/resources';

// const CLAUDE_AI_ENDPOINT = process.env.CLAUDE_AI_ENDPOINT || 'https://api.anthropic.com/v1/completions';
// const CLAUDE_AI_KEY = process.env.CLAUDE_AI_KEY || 'your_claude_ai_key_here';

function extractTextFromContentBlocks(blocks: ContentBlock[]): string {
  return blocks
    .filter((block): block is Extract<ContentBlock, { type: 'text' }> => block.type === 'text')
    .map(block => block.text)
    .join('\n');
}



export async function generateTokenomicsWithClaudeAI(input: EnhancedTokenomicsInput, experienceLevel: 'beginner' | 'intermediate' | 'advanced'): Promise<TokenomicsScenario> {
  try {
    const prompt = generatePrompt(input, experienceLevel);
    
    console.log('Sending request to Claude AI...');
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 4096,
      messages: [
        { role: "user", content: prompt }
      ]
    });

    console.log('Received response from Claude AI');
    console.log('Stop reason:', response.stop_reason);

    const completionText = extractTextFromContentBlocks(response.content);
    
    console.log('Parsing response...');
    let scenario: TokenomicsScenario;
    try {
      // Try to parse the entire response
      scenario = JSON.parse(completionText);
    } catch (parseError) {
      console.error('Error parsing full JSON:', parseError);
      
      // If full parsing fails, try to extract a JSON object from the text
      const jsonMatch = completionText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          scenario = JSON.parse(jsonMatch[0]);
          console.log('Successfully extracted and parsed JSON object from response');
        } catch (extractError) {
          console.error('Error parsing extracted JSON:', extractError);
          console.log('Extracted text:', jsonMatch[0]);
          throw new Error('Failed to parse extracted JSON object from the response.');
        }
      } else {
        console.log('Full response text:', completionText);
        throw new Error('No valid JSON object found in the response.');
      }
    }

    console.log('Successfully parsed scenario');
    return scenario;
  } catch (error) {
    console.error('Error in generateTokenomicsWithClaudeAI:', error);
    throw new Error(`Failed to generate tokenomics scenario: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function generatePrompt(input: EnhancedTokenomicsInput, experienceLevel: 'beginner' | 'intermediate' | 'advanced'): string {
  let basePrompt = `
Generate a tokenomics scenario for a blockchain project with the following details:

Project Name: ${input.projectName}
Project Concept: ${input.projectConcept}
Project Stage: ${input.projectStage}
`;

  if (experienceLevel === 'intermediate' || experienceLevel === 'advanced') {
    basePrompt += `
Total Token Supply: ${input.totalSupply.toLocaleString()}
Blockchain Platform: ${input.blockchainPlatform}
Target Audience: ${input.targetAudience}
`;
  }

  if (experienceLevel === 'advanced') {
    basePrompt += `
Project Goals: ${input.projectGoals}
Competitor Analysis: ${input.competitorAnalysis}
Regulatory Considerations: ${input.regulatoryConsiderations}
`;
  }

  basePrompt += `
Based on this information, provide a JSON object with the following structure:

{
  "projectName": "Project Name",
  "blockchainPlatform": "Blockchain Platform",

  "name": "Scenario Name",
  "tokenDistribution": [
    { "category": "Category Name", "percentage": number }
  ],
  "initialTokenPrice": number,
  "vestingSchedule": {
    "team": "Description",
    "advisors": "Description"
  },
  "projections": {
    "circulatingSupply": [
      { "date": "YYYY-Q1", "amount": number }
    ],
    "price": [
      { "date": "YYYY-Q1", "price": number }
    ],
    "marketCap": [
      { "date": "YYYY-Q1", "marketCap": number }
    ]
  },
  "tokenUtilization": [
    { "useCase": "Use Case", "description": "Brief description" }
  ],
  "riskAssessment": [
    { "factor": "Risk Factor", "level": number }
  ],
  "analysis": "Brief analysis of the tokenomics scenario"
`;

  if (experienceLevel === 'advanced') {
    basePrompt += `,
  "competitiveAnalysis": {
    "competitors": [
      {
        "name": "Competitor Name",
        "description": "Brief description of the competitor's project",
        "tokenomics": {
          "totalSupply": number,
          "initialPrice": number,
          "distribution": [
            { "category": "Category Name", "percentage": number }
          ]
        },
        "strengths": ["Strength 1", "Strength 2"],
        "weaknesses": ["Weakness 1", "Weakness 2"]
      }
    ],
    "comparisonAnalysis": "Brief analysis comparing the generated tokenomics to competitors"
  }
`;
  }

  basePrompt += `
}

Ensure all numbers are realistic and based on the provided project details. Keep descriptions concise. `;

  if (experienceLevel === 'beginner') {
    basePrompt += 'Provide simple explanations suitable for someone new to tokenomics.';
  } else if (experienceLevel === 'intermediate') {
    basePrompt += 'Include more detailed analysis and considerations in your response.';
  } else {
    basePrompt += 'Provide advanced insights, including detailed competitive analysis and regulatory considerations.';
  }

  basePrompt += ' Provide the response as a valid JSON object without any additional text or explanations outside the JSON structure.';

  return basePrompt;
}


export const getMarketData = async (projectName: string, blockchainPlatform: string): Promise<MarketData> => {
  console.log(projectName, blockchainPlatform, "getMarketData");
  const prompt = `Provide a market sentiment analysis and general market conditions for launching a new crypto project named ${projectName} on the ${blockchainPlatform} platform. Include the following in your response:
  1. Overall crypto market sentiment (bullish, bearish, or neutral)
  2. General market conditions for the ${blockchainPlatform} ecosystem
  3. Average 24h trading volume for new tokens on ${blockchainPlatform} in the last month
  4. Average initial market cap for new tokens on ${blockchainPlatform} in the last month
  5. Estimated fair launch price range for a new token in the current market

  Format the response ONLY as a valid JSON object with the following structure:
  {
    "marketSentiment": "bullish" | "bearish" | "neutral" (current market sentiment for the ${blockchainPlatform} ecosystem),
    "ecosystemCondition": current market conditions for the ${blockchainPlatform} ecosystem,
    "avgNewTokenVolume": number,
    "avgNewTokenMarketCap": number,
    "estimatedPriceRange": {
      "min": number,
      "max": number
    },
    "timestamp": (Date.now() in "YYYY-MM-DDTHH:mm:ssZ" format)
  }
  Ensure all numerical values are realistic. Do not include any explanatory text outside of the JSON object.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    });

    const completionText = extractTextFromContentBlocks(response.content);
    console.log('Raw response from Claude AI:', completionText);

    try {
      const parsedData = JSON.parse(completionText);
      return {
        ...parsedData,
        projectName,
        blockchainPlatform
      };
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      throw new Error('Invalid JSON response from AI');
    }
  } catch (error) {
    console.error('Error in getMarketData:', error);
    throw new Error(`Failed to get market data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getCompetitiveAnalysis = async(projectName: string, competitors: string[]): Promise<CompetitiveAnalysis> => {
  const prompt = `Provide a competitive analysis for the crypto project ${projectName} compared to ${competitors}. Include market cap, price, and volume for each. Format the response as a JSON object with an array of competitor data.`;
  
  const response = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }]
  });

  const completionText = extractTextFromContentBlocks(response.content);
  return JSON.parse(completionText);
}