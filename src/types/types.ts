export enum ExternalityName {
  ANIMAL = 'animals',
  FOREST = 'forest',
  CLIMATE = 'climate',
  ENERGY = 'energy',
  EDUCATION = 'education',
  DEVELOPMENT = 'development',
}

export interface Externality {
  name: ExternalityName;
  score: number;
}

export type Externalities = Externality[];

export type UserChoice = {
  [name in ExternalityName]: number;
};

export interface Fund {
  isin: string;
  name: string;
  history: number[];
  externalities: Externalities;
  description: string;
}

export type Funds = Fund[];

export type ExpectationArray = number[];

export type CovarianceMatrix = number[][];

export type Portfolio = number[];

export interface PortfolioContentObject {
  fund: Fund;
  weight: number;
}

export interface Graph {
  years: number[];
  meanEvolution: number[];
  optimisticEvolution: number[];
  pessimisticEvolution: number[];
}

export interface Response {
  total: {
    rateReturn: number;
    standardDeviation: number;
  };
  graph: Graph;
  portfolioContent: PortfolioContentObject[];
}
