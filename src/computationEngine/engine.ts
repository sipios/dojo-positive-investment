import { EXPECTATION_MULTIPLIER_BASE_IN_PERCENT, fundsArray, NUMBER_OF_MONTHS } from './constants';
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

const computeFundRateReturnHistory = (fund: Fund): Array<number> => {
  const rateReturnArray = fund.history.slice(1).map((currentValue, index) => {
    const previousValue = fund.history[index];
    return (currentValue - previousValue) / previousValue;
  });

  return rateReturnArray;
};

const computeFundsRateReturnExpectationArray = (): ExpectationArray => {
  const computeSingleFundRateReturnExpectation = (fundRateReturnHistory: Array<number>): number => {
    return fundRateReturnHistory.reduce((expectation, rate) => expectation + rate, 0) / fundRateReturnHistory.length;
  };
  const rateReturnHistoryArray: Array<Array<number>> = fundsArray.map(
    (fund: Fund): ExpectationArray => computeFundRateReturnHistory(fund),
  );
  const rateReturnExpectationArray = rateReturnHistoryArray.map((rateReturnHistory: Array<number>): number =>
    computeSingleFundRateReturnExpectation(rateReturnHistory),
  );
  console.log(rateReturnExpectationArray);
  return rateReturnExpectationArray;
};

const computeCovarianceXY = (
  X: Array<number>,
  Y: Array<number>,
  expectationX: number,
  expectationY: number,
): number => {
  const startIndex: number = Math.max(X.length, Y.length) - Math.min(X.length, Y.length);
  let centeredX: Array<number> = [];
  let centeredY: Array<number> = [];
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
  const rateReturnHistoryArray: Array<Array<number>> = fundsArray.map(
    (fund: Fund): ExpectationArray => computeFundRateReturnHistory(fund),
  );
  let covarianceMatrix: Array<Array<number>> = [[]];
  for (let i = 0; i < fundsArray.length; i++) {
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

const computePortfolioRateReturn = (expectationArray: ExpectationArray, portfolioAllocation: Portfolio): number => {
  return expectationArray.reduce(
    (totalRateReturn: number, expectation: number, index: number): number =>
      totalRateReturn + expectation * portfolioAllocation[index],
    0,
  );
};

const computePortfolioStandardDeviation = (
  covarianceMatrix: CovarianceMatrix,
  portfolioAllocation: Portfolio,
): number => {
  let variance = 0;
  for (let i = 0; i < covarianceMatrix.length; i++) {
    for (let j = 0; j < covarianceMatrix.length; j++) {
      variance += covarianceMatrix[i][j] * portfolioAllocation[i] * portfolioAllocation[j];
    }
  }

  return Math.sqrt(variance);
};

const computeChatbotResponse = (
  expectationArray: ExpectationArray,
  covariance: CovarianceMatrix,
  portfolioAllocation: Portfolio,
  initialAmount: number,
): Response => {
  const response: Response = {
    total: {
      rateReturn: 0,
      standardDeviation: 0,
    },
    graph: {
      months: Array.from(Array(NUMBER_OF_MONTHS).keys()),
      meanEvolution: [],
      optimisticEvolution: [],
      pessimisticEvolution: [],
    },
    portfolioContent: [],
  };
  response.total.rateReturn = computePortfolioRateReturn(expectationArray, portfolioAllocation);
  response.total.standardDeviation = computePortfolioStandardDeviation(covariance, portfolioAllocation);

  if (1 + response.total.rateReturn) {
    response.graph.meanEvolution = response.graph.months.map(
      (year: number): number => initialAmount * Math.pow(1 + response.total.rateReturn, year),
    );
  } else {
    response.graph.meanEvolution = Array(NUMBER_OF_MONTHS).fill(0);
    response.graph.meanEvolution[0] = initialAmount;
  }

  if (1 + response.total.rateReturn + response.total.standardDeviation) {
    response.graph.optimisticEvolution = response.graph.months.map(
      (year: number): number =>
        initialAmount * Math.pow(1 + response.total.rateReturn + response.total.standardDeviation, year),
    );
  } else {
    response.graph.optimisticEvolution = Array(NUMBER_OF_MONTHS).fill(0);
    response.graph.optimisticEvolution[0] = initialAmount;
  }

  if (1 + response.total.rateReturn - response.total.standardDeviation) {
    response.graph.pessimisticEvolution = response.graph.months.map(
      (year: number): number =>
        initialAmount * Math.pow(1 + response.total.rateReturn - response.total.standardDeviation, year),
    );
  } else {
    response.graph.pessimisticEvolution = Array(NUMBER_OF_MONTHS).fill(0);
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
  const expectationArray = computeFundsRateReturnExpectationArray();
  const covariance = computeFundsRateReturnCovarianceMatrix(expectationArray);
  const portfolioAllocation = computePortfolioAllocation(expectationArray, covariance, userChoice, maxVolatility);
  const response = computeChatbotResponse(expectationArray, covariance, portfolioAllocation, initialAmount);

  return response;
};

export default computationEngine;
