import { EnhancedTokenomicsInput, TokenomicsScenario } from '../types/tokenomics';

export async function generateTokenomicsScenarios(input: EnhancedTokenomicsInput): Promise<TokenomicsScenario[]> {
  // For now, we'll return mock data that matches the structure expected by the frontend
  const mockScenarios: any = [
    {
      name: 'Balanced Growth',
      // projectName: input.projectName,
      // totalSupply: input.totalSupply,
      tokenDistribution: input.tokenDistribution || [
        { category: 'Public Sale', percentage: 40 },
        { category: 'Team', percentage: 20 },
        { category: 'Ecosystem Fund', percentage: 25 },
        { category: 'Advisors', percentage: 5 },
        { category: 'Treasury', percentage: 10 },
      ],
      initialTokenPrice: 0.1,
      targetMarketCap: input.totalSupply * 0.1,
      blockchainPlatform: input.blockchainPlatform,
      tokenUtilities: input.tokenUtilities || [],
      vestingSchedule: {
        team: '4 year vesting with 1 year cliff',
        advisors: '2 year vesting with 6 month cliff',
      },
      projectedMarketCap: input.totalSupply * 0.1,
      circulatingSupplyProjection: [
        { date: '2023-08', amount: input.totalSupply * 0.1 },
        { date: '2023-12', amount: input.totalSupply * 0.2 },
        { date: '2024-04', amount: input.totalSupply * 0.35 },
        { date: '2024-08', amount: input.totalSupply * 0.5 },
      ],
      priceProjection: [
        { date: '2023-08', price: 0.1 },
        { date: '2023-12', price: 0.15 },
        { date: '2024-04', price: 0.22 },
        { date: '2024-08', price: 0.3 },
      ],
      marketCapProjection: [
        { date: '2023-08', marketCap: input.totalSupply * 0.1 * 0.1 },
        { date: '2023-12', marketCap: input.totalSupply * 0.2 * 0.15 },
        { date: '2024-04', marketCap: input.totalSupply * 0.35 * 0.22 },
        { date: '2024-08', marketCap: input.totalSupply * 0.5 * 0.3 },
      ],
      volumeProjection: [
        { date: '2023-08', volume: input.totalSupply * 0.01 },
        { date: '2023-12', volume: input.totalSupply * 0.015 },
        { date: '2024-04', volume: input.totalSupply * 0.022 },
        { date: '2024-08', volume: input.totalSupply * 0.03 },
      ],
      stakingRewardsProjection: [
        { date: '2023-08', rewards: input.totalSupply * 0.001 },
        { date: '2023-12', rewards: input.totalSupply * 0.0015 },
        { date: '2024-04', rewards: input.totalSupply * 0.002 },
        { date: '2024-08', rewards: input.totalSupply * 0.0025 },
      ],
      tokenVelocity: [
        { date: '2023-08', velocity: 0.5 },
        { date: '2023-12', velocity: 0.75 },
        { date: '2024-04', velocity: 1.1 },
        { date: '2024-08', velocity: 1.5 },
      ],
      tokenUtilizationMetrics: [
        { useCase: 'Governance', utilization: 30 },
        { useCase: 'Staking', utilization: 40 },
        { useCase: 'Transactions', utilization: 20 },
        { useCase: 'DeFi', utilization: 10 },
      ],
      comparativeAnalysis: [
        { project: 'Project A', marketCap: input.totalSupply * 0.05, price: 0.05, volume: input.totalSupply * 0.005 },
        { project: 'Project B', marketCap: input.totalSupply * 0.15, price: 0.2, volume: input.totalSupply * 0.01 },
        { project: 'Project C', marketCap: input.totalSupply * 0.08, price: 0.1, volume: input.totalSupply * 0.008 },
      ],
      riskAssessment: [
        { factor: 'Market Volatility', level: 7 },
        { factor: 'Regulatory Changes', level: 5 },
        { factor: 'Competition', level: 6 },
        { factor: 'Technology Risk', level: 4 },
      ],
      tokenomicsScorecard: {
        distribution: 8,
        utility: 7,
        vesting: 9,
        marketPotential: 8,
        overallScore: 8,
      },
      analysis: 'This balanced approach aims to provide ample tokens for public participation while ensuring long-term alignment of the team and sustained ecosystem growth.',
    },
    // You can add more scenarios here if needed
  ];

  return mockScenarios;
}