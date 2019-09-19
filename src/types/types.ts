export enum ExternalityName {
  ANIMAL = 'animals',
  FOREST = 'forest',
  CLIMATE = 'climate',
  ENERGY = 'energy',
  EDUCATION = 'education',
  EQUALITY = 'equality',
}

export interface Externality {
  name: ExternalityName;
  score: number;
}

export type Externalities = Externality[];

export type UserChoice = {
  [name in ExternalityName]: {
    value: number;
  };
};

export interface Fund {
  isin: number;
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

export interface Response {
  total: {
    rateReturn: number;
    standardDeviation: number;
  };
  graph: {
    months: number[];
    meanEvolution: number[];
    optimisticEvolution: number[];
    pessimisticEvolution: number[];
  };
  portfolioContent: PortfolioContentObject[];
}
