// types/tokenomics.ts

export interface TokenDistribution {
  category: string;
  percentage: number;
}

export interface VestingSchedule {
  team: string;
  advisors: string;
}

export interface TokenUtility {
  useCase: string;
  description: string;
}

export interface RiskAssessment {
  factor: string;
  level: number;
}

export interface Projection {
  date: string;
  value: number;
}

export interface TokenomicsScenario {
  name: string;
  projectName: string;
  projectConcept: string;
  totalSupply: number;
  tokenDistribution: TokenDistribution[];
  initialTokenPrice: number;
  vestingSchedule: VestingSchedule;
  tokenUtilization: TokenUtility[];
  riskAssessment: RiskAssessment[];
  projections: {
    price: Projection[];
    marketCap: Projection[];
    circulatingSupply: Projection[];
  };
  analysis: string;
}

export interface EnhancedTokenomicsInput {
  projectName: string;
  projectConcept: string;
  totalSupply: number;
  blockchainPlatform: string;
  projectGoals: string[];
  targetAudience: string[];
  projectStage: string;
  competitorAnalysis: string[];
  regulatoryConsiderations: string[];
  tokenDistribution?: TokenDistribution[];
  tokenUtilities?: TokenUtility[];
}

export interface MarketData {
  timestamp: string;
  price: number;
  volume: number;
  marketCap: number;
}

export interface CompetitorData {
  name: string;
  marketCap: number;
  price: number;
  volume: number;
}

export interface CompetitiveAnalysis {
  projectData: CompetitorData;
  competitors: CompetitorData[];
}