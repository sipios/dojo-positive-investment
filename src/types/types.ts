export type ExternalityName = 'animals'|'forest'|'climate'|'energy'|'education'|'equality';

export interface Externality {
    name: ExternalityName,
    score: number
};

export type Externalities = Externality[];

export type UserChoice = {
    [name in ExternalityName]: {
        value: number;
    };
};;

export interface Fund {
    isin: number,
    name: string,
    history: number[],
    externalities: Externalities,
    description: string
}

export type Funds = Fund[];

export type ExpectationArray = number[];

export type CovarianceMatrix = number[][];

export type Portfolio = number[];

export interface PortfolioContentObject {
    fund: Fund,
    weight: number
}

export interface Response {
    total: {
      efficiency: number,
      volatility: number,
    },
    graph: {
      years: number[],
      meanEvolution: number[],
      optimisticEvolution: number[],
      pessimisticEvolution: number[],
    },
    portfolioContent: PortfolioContentObject[],
  };
