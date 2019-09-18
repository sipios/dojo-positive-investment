export type ExternalityName = 'animals'|'forest'|'climate'|'energy'|'education'|'equality';

export interface Externality {
    name: ExternalityName,
    score: number
};

export type Externalities = Array<Externality>;

export type UserChoice = {
    [name in ExternalityName]: {
        value: number;
    };
};;

export interface Fund {
    isin: number,
    name: string,
    history: Array<number>,
    externalities: Externalities,
    description: string
}

export type Funds = Array<Fund>;

export type Expectation = Array<number>;

export type CovarianceMatrix = Array<Array<number>>;

export type Portfolio = Array<number>;

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
      years: Array<number>,
      meanEvolution: Array<number>,
      optimisticEvolution: Array<number>,
      pessimisticEvolution: Array<number>,
    },
    portfolioContent: Array<PortfolioContentObject>,
  };
