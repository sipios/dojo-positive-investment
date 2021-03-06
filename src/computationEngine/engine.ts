import {
  CovarianceMatrix,
  ExpectationArray,
  Fund,
  Portfolio,
  PortfolioContentObject,
  Response,
  UserChoice,
} from '../types/types';
import { EXPECTATION_MULTIPLIER_BASE_IN_PERCENT, fundsArray, NUMBER_OF_YEARS } from './constants';

let PortfolioAllocation = require('portfolio-allocation');

const computeFundRateReturnHistory = (fund: Fund): number[] => {
  const rateReturnArray = fund.history.slice(1).map((currentValue, index) => {
    const previousValue = fund.history[index];
    return (currentValue - previousValue) / previousValue;
  });

  return rateReturnArray;
};

const computeSingleFundRateReturnExpectation = (fundRateReturnHistory: number[]): number => {
  return fundRateReturnHistory.reduce((expectation, rate) => expectation + rate, 0) / fundRateReturnHistory.length;
};

const computeFundsRateReturnExpectationArray = (): ExpectationArray => {
  const rateReturnHistoryArray: number[][] = fundsArray.map(
    (fund: Fund): ExpectationArray => computeFundRateReturnHistory(fund),
  );
  const rateReturnExpectationArray = rateReturnHistoryArray.map((rateReturnHistory: number[]): number =>
    computeSingleFundRateReturnExpectation(rateReturnHistory),
  );

  return rateReturnExpectationArray;
};

const computeCovarianceXY = (X: number[], Y: number[], expectationX: number, expectationY: number): number => {
  const startIndex: number = Math.max(X.length, Y.length) - Math.min(X.length, Y.length);
  let centeredX: number[] = [];
  let centeredY: number[] = [];
  if (X.length < Y.length) {
    centeredX = X.map((value: number): number => value - expectationX);
    centeredY = Y.slice(startIndex).map((value: number): number => value - expectationY);
  } else if (Y.length < X.length) {
    centeredX = X.slice(startIndex).map((value: number): number => value - expectationX);
    centeredY = Y.map((value: number): number => value - expectationY);
  } else {
    centeredX = X.map((value: number): number => value - expectationX);
    centeredY = Y.map((value: number): number => value - expectationY);
  }

  // TODO : Calculer la covariance entre deux tableaux
  const covarianceXY = 0;

  return covarianceXY;
};

const computeFundsRateReturnCovarianceMatrix = (rateReturnExpectationArray: ExpectationArray): CovarianceMatrix => {
  const rateReturnHistoryArray: number[][] = fundsArray.map(
    (fund: Fund): ExpectationArray => computeFundRateReturnHistory(fund),
  );

  // TODO : Calculer la matrice de covariance en appelant `computeCovarianceXY`
  let covarianceMatrix: number[][] = [];

  return covarianceMatrix;
};

const computeRateReturnExpectationMultiplierArray = (userChoice: UserChoice): ExpectationArray => {
  const getFundAdequationWithUserPreferenceFactor = (fund: Fund): number => {
    // TODO : Calculer le facteur de préférence de l'utilisateur associé à un fonds
    return 0;
  };

  return fundsArray.map(
    (fund: Fund): number => getFundAdequationWithUserPreferenceFactor(fund) * EXPECTATION_MULTIPLIER_BASE_IN_PERCENT,
  );
};

const computeAdaptedExpectationArray = (
  rateReturnExpectationArray: ExpectationArray,
  rateReturnExpectationMultiplierArray: ExpectationArray,
): ExpectationArray => {
  // TODO : Calculer l'espérance modifiée : EAdaptée = EBase + FacteurAjustement * EBase
  return [];
};

const computePortfolioAllocation = (
  expectationArray: ExpectationArray,
  covariance: CovarianceMatrix,
  userChoice: UserChoice,
  maxVolatility: number,
): Portfolio => {
  const expectationMultiplierArray = computeRateReturnExpectationMultiplierArray(userChoice);
  const adaptedExpectationArray = computeAdaptedExpectationArray(expectationArray, expectationMultiplierArray);

  /**
   * TODO : Calculer la composition du portefeuille en appelant la méthode `meanVarianceOptimizationWeights` du module 'portfolio-application'
   * en passant en option : {
   *  optimizationMethod: 'maximumTargetVolatility',
   *  constraints: { maxVolatility: maxVolatility },
   * }
   */
  const portfolioAllocation = [0];

  return portfolioAllocation;
};

const computePortfolioMonthlyRateReturn = (
  expectationArray: ExpectationArray,
  portfolioAllocation: Portfolio,
): number => {
  return expectationArray.reduce(
    (totalRateReturn: number, expectation: number, index: number): number =>
      totalRateReturn + expectation * portfolioAllocation[index],
    0,
  );
};

const computePortfolioAnnualRateReturn = (rateReturn: number): number => {
  return Math.pow(1 + rateReturn, 12) - 1;
};

const computeFundAnnualRateReturnHistory = (fund: Fund): number[] => {
  const filteredAnnualHistory = fund.history.filter((_value, index) => index % 12 === 4);
  return filteredAnnualHistory.slice(1).map((currentValue, index) => {
    const previousValue = filteredAnnualHistory[index];
    return (currentValue - previousValue) / previousValue;
  });
};

const computeFundProportionalAnnualRateReturnHistory = (
  fundAnnualRateReturnHistoryArray: number[],
  fundAllocation: number,
): number[] => {
  return fundAnnualRateReturnHistoryArray.map((annualRateReturn: number): number => annualRateReturn * fundAllocation);
};

const computeProportionalAnnualRateReturnHistory = (
  annualRateReturnHistoryArray: number[][],
  portfolioAllocation: Portfolio,
): number[][] => {
  return annualRateReturnHistoryArray.map((fundAnnualRateReturn: number[], index: number): number[] =>
    computeFundProportionalAnnualRateReturnHistory(fundAnnualRateReturn, portfolioAllocation[index]),
  );
};

const computeSumTwoArrays = (A: number[], B: number[]): number[] => {
  const sizeDifference = B.length - A.length;
  if (sizeDifference > 0) {
    return B.slice(sizeDifference).map((valueOfB: number, index: number): number => A[index] + valueOfB);
  } else if (sizeDifference < 0) {
    return A.slice(Math.abs(sizeDifference)).map((valueOfA: number, index: number): number => valueOfA + B[index]);
  }
  return A.map(index => A[index] + B[index]);
};

const computePortfolioAnnualRateReturnHistory = (portfolioAllocation: Portfolio): number[] => {
  const annualRateReturnHistoryArray: number[][] = fundsArray.map(
    (fund: Fund): ExpectationArray => computeFundAnnualRateReturnHistory(fund),
  );
  const proportionalAnnualRateReturnHistoryArray: number[][] = computeProportionalAnnualRateReturnHistory(
    annualRateReturnHistoryArray,
    portfolioAllocation,
  );
  const portfolioAnnualRateReturnHistory: number[] = proportionalAnnualRateReturnHistoryArray.reduce(
    (portfolioAnnualRateReturn: number[], fundProportionalAnnualRateReturn: number[]): number[] =>
      computeSumTwoArrays(portfolioAnnualRateReturn, fundProportionalAnnualRateReturn),
  );

  return portfolioAnnualRateReturnHistory;
};

const computePortfolioAnnualStandardDeviation = (portfolioAllocation: Portfolio): number => {
  const portfolioAnnualRateReturnHistory: number[] = computePortfolioAnnualRateReturnHistory(portfolioAllocation);
  const portfolioExpectation: number = computeSingleFundRateReturnExpectation(portfolioAnnualRateReturnHistory);
  const portfolioVariance: number =
    portfolioAnnualRateReturnHistory.reduce(
      (variance: number, rateReturn: number): number => variance + Math.pow(rateReturn - portfolioExpectation, 2),
      0,
    ) /
    (portfolioAnnualRateReturnHistory.length - 1);

  return Math.sqrt(portfolioVariance);
};

const computeChatbotResponse = (
  expectationArray: ExpectationArray,
  portfolioAllocation: Portfolio,
  initialAmount: number,
): Response => {
  const response: Response = {
    total: {
      rateReturn: 0,
      standardDeviation: 0,
    },
    graph: {
      years: Array.from(Array(NUMBER_OF_YEARS).keys()),
      meanEvolution: [],
      optimisticEvolution: [],
      pessimisticEvolution: [],
    },
    portfolioContent: [],
  };
  const monthlyRateReturn = computePortfolioMonthlyRateReturn(expectationArray, portfolioAllocation);
  response.total.rateReturn = computePortfolioAnnualRateReturn(monthlyRateReturn);
  response.total.standardDeviation = computePortfolioAnnualStandardDeviation(portfolioAllocation);

  const initializeGraphs = (increaseValue: number): number[] => {
    if (increaseValue > 0) {
      return response.graph.years.map((year: number): number => initialAmount * Math.pow(increaseValue, year));
    } else {
      let evolution = Array(NUMBER_OF_YEARS).fill(0);
      evolution[0] = initialAmount;
      return evolution;
    }
  };

  response.graph.meanEvolution = initializeGraphs(1 + response.total.rateReturn);
  response.graph.optimisticEvolution = initializeGraphs(
    1 + response.total.rateReturn + response.total.standardDeviation,
  );
  response.graph.pessimisticEvolution = initializeGraphs(
    1 + response.total.rateReturn - response.total.standardDeviation,
  );

  response.portfolioContent = Array.from(
    portfolioAllocation,
    (fundWeight: number, index: number): PortfolioContentObject => {
      return { fund: fundsArray[index], weight: fundWeight };
    },
  );

  return response;
};

const computationEngine = (userChoice: UserChoice, maxVolatility: number, initialAmount: number): Response => {
  const expectationArray: ExpectationArray = computeFundsRateReturnExpectationArray();
  const covariance: CovarianceMatrix = computeFundsRateReturnCovarianceMatrix(expectationArray);
  const portfolioAllocation: Portfolio = computePortfolioAllocation(
    expectationArray,
    covariance,
    userChoice,
    maxVolatility,
  );
  const response: Response = computeChatbotResponse(expectationArray, portfolioAllocation, initialAmount);

  return response;
};

export default computationEngine;
