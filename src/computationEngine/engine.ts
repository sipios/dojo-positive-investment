import { EXPECTATION_MULTIPLIER_BASE_IN_PERCENT, fundsArray, NUMBER_OF_YEARS } from './constants';
import {
  Externality,
  UserChoice,
  Fund,
  ExpectationArray,
  CovarianceMatrix,
  Portfolio,
  Response,
  PortfolioContentObject,
} from '../types/types';

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
  const covarianceXY =
    centeredX.reduce(
      (totalSum: number, centeredXValue: number, index: number): number => totalSum + centeredXValue * centeredY[index],
      0,
    ) /
    (centeredX.length - 1);

  return covarianceXY;
};

const computeFundsRateReturnCovarianceMatrix = (rateReturnExpectationArray: ExpectationArray): CovarianceMatrix => {
  const rateReturnHistoryArray: number[][] = fundsArray.map(
    (fund: Fund): ExpectationArray => computeFundRateReturnHistory(fund),
  );
  let covarianceMatrix: number[][] = [];
  for (let i = 0; i < fundsArray.length; i++) {
    covarianceMatrix[i] = new Array(fundsArray.length);
    for (let j = i; j < fundsArray.length; j++) {
      covarianceMatrix[i][j] = computeCovarianceXY(
        rateReturnHistoryArray[i],
        rateReturnHistoryArray[j],
        rateReturnExpectationArray[i],
        rateReturnExpectationArray[j],
      );
    }
    for (let j = 0; j < i; j++) {
      covarianceMatrix[i][j] = covarianceMatrix[j][i];
    }
  }

  return covarianceMatrix;
};

const computeRateReturnExpectationMultiplierArray = (userChoice: UserChoice): ExpectationArray => {
  const getFundAdequationWithUserPreferenceFactor = (fund: Fund): number => {
    return fund.externalities.reduce(
      (totalExternalityValue: number, externality: Externality): number =>
        totalExternalityValue + externality.score * userChoice[externality.name],
      0,
    );
  };

  return fundsArray.map(
    (fund: Fund): number => getFundAdequationWithUserPreferenceFactor(fund) * EXPECTATION_MULTIPLIER_BASE_IN_PERCENT,
  );
};

const computeAdaptedExpectationArray = (
  rateReturnExpectationArray: ExpectationArray,
  rateReturnExpectationMultiplierArray: ExpectationArray,
): ExpectationArray => {
  return rateReturnExpectationArray.map(
    (expectationValue: number, index: number): number =>
      expectationValue + Math.abs(expectationValue) * rateReturnExpectationMultiplierArray[index],
  );
};

const computePortfolioAllocation = (
  expectationArray: ExpectationArray,
  covariance: CovarianceMatrix,
  userChoice: UserChoice,
  maxVolatility: number,
): Portfolio => {
  const expectationMultiplierArray = computeRateReturnExpectationMultiplierArray(userChoice);
  const adaptedExpectationArray = computeAdaptedExpectationArray(expectationArray, expectationMultiplierArray);

  const portfolioAllocation = PortfolioAllocation.meanVarianceOptimizationWeights(adaptedExpectationArray, covariance, {
    optimizationMethod: 'maximumTargetVolatility',
    constraints: { maxVolatility: maxVolatility },
  });

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

  if (1 + response.total.rateReturn > 0) {
    response.graph.meanEvolution = response.graph.years.map(
      (year: number): number => initialAmount * Math.pow(1 + response.total.rateReturn, year),
    );
  } else {
    response.graph.meanEvolution = Array(NUMBER_OF_YEARS).fill(0);
    response.graph.meanEvolution[0] = initialAmount;
  }

  if (1 + response.total.rateReturn + response.total.standardDeviation > 0) {
    response.graph.optimisticEvolution = response.graph.years.map(
      (year: number): number =>
        initialAmount * Math.pow(1 + response.total.rateReturn + response.total.standardDeviation, year),
    );
  } else {
    response.graph.optimisticEvolution = Array(NUMBER_OF_YEARS).fill(0);
    response.graph.optimisticEvolution[0] = initialAmount;
  }

  if (1 - response.total.standardDeviation > 0) {
    response.graph.pessimisticEvolution = response.graph.years.map(
      (year: number): number => initialAmount * Math.pow(1 - response.total.standardDeviation, year),
    );
  } else {
    response.graph.pessimisticEvolution = Array(NUMBER_OF_YEARS).fill(0);
    response.graph.pessimisticEvolution[0] = initialAmount;
  }

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
