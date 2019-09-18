export type externalityName = 'animals'|'forest'|'climate'|'energy'|'education'|'equality';

export interface externality {
    name: externalityName,
    score: number
};

export type externalities = Array<externality>;

export type userChoice = {
    [name in externalityName]: {
        value: number;
    };
};;

export interface fund {
    isin: number,
    name: string,
    history: Array<number>,
    externalities: externalities,
    description: string
}

export type funds = Array<fund>;

export type expectation = Array<number>;

export type covarianceMatrix = Array<Array<number>>;

export type portfolio = Array<number>;

export interface portfolioContentObject {
    fund: fund,
    weight: number
}

export interface response {
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
    portfolioContent: Array<portfolioContentObject>,
  };
