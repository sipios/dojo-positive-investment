let PortfolioAllocation = require('portfolio-allocation');

import { fundsArray } from './constants';
import { Externality, UserChoice, Fund, Expectation, CovarianceMatrix, Portfolio, Response, PortfolioContentObject } from '../types/types';

const EXPECTATION_MULTIPLIER_BASE_IN_PERCENT = 0.1 / 100;
const NUMBER_OF_YEARS = 15;

const computeFundsExpectationArray = (): Expectation => {
    const expectationArray = fundsArray.map(
        (fund: Fund): number => (
            fund.history.reduce(
                (averageRate: number, currentRate: number, currentIndex: number) => (
                    averageRate * currentIndex / (currentIndex + 1) + currentRate / (currentIndex + 1)
                )
            )
        )
    )


    return expectationArray;
};

  const computeCovarianceXY = (X: Array<number>, Y: Array<number>, expectationX: number, expectationY: number): number => {
    const normalizedX = X.map((value: number): number => (value/expectationX));
    const normalizedY = Y.map((value: number): number => (value/expectationY));
    const covarianceXY = normalizedX.reduce((totalSum: number, normalizedXValue: number, index: number): number =>
        (totalSum + normalizedXValue * normalizedY[index])) / (normalizedX.length - 1);


    return covarianceXY;
  }

  const computeFundsCovarianceArray = (expectation: Expectation): CovarianceMatrix => {
    let covariance: Array<Array<number>> = [];
    for (let i=0; i<fundsArray.length -1; i++) {
      for (let j=i; j<fundsArray.length -1; j++) {
        covariance[i][j] = computeCovarianceXY(fundsArray[i].history, fundsArray[j].history, expectation[i], expectation[j]);
      }
      for (let j=0; j<i; j++) {
        covariance[i][j] = covariance[j][i];
      }
    }


    return covariance;
  };

  const computeExpectationMultiplierArray = (userChoice: UserChoice): Expectation => {


    return fundsArray.map((fund: Fund): number =>
      fund.externalities.reduce((totalExternalityValue: number, externality: Externality): number => 
        totalExternalityValue + externality.score * userChoice[externality.name].value
      , 0) * EXPECTATION_MULTIPLIER_BASE_IN_PERCENT
    );
  };

  const computeAdaptedExpectationArray = (expectationArray: Expectation, expectationMultiplierArray: Expectation): Expectation => {


    return expectationArray.map((expectationValue: number, index: number): number => {
        return expectationValue + Math.abs(expectationValue) * expectationMultiplierArray[index];
      }
    );
  };

  const computePortfolioAllocation = (expectationArray: Expectation, covariance: CovarianceMatrix, userChoice: UserChoice, maxVolatility: number): Portfolio => {
    const expectationMultiplierArray = computeExpectationMultiplierArray(userChoice);
    const adaptedExpectationArray = computeAdaptedExpectationArray(expectationArray, expectationMultiplierArray);

    const portfolioAllocation = PortfolioAllocation.meanVarianceOptimizationWeights(
      adaptedExpectationArray, covariance, { optimizationMethod: 'maximumTargetVolatility', constraints: {maxVolatility: maxVolatility}}
    );


    return portfolioAllocation;
  };

  const computePortfolioEfficiency = (expectationArray: Expectation, portfolioAllocation: Portfolio): number => {


    return expectationArray.reduce((totalEfficiency: number, expectation: number, index: number): number =>
      totalEfficiency + expectation * portfolioAllocation[index]
    );
  };

  const computePortfolioVolatility = (covariance: CovarianceMatrix, portfolioAllocation: Portfolio): number => {
    let volatility = 0;
    for (let i=0; i<covariance.length - 1; i++) {
      volatility += covariance[i][i] * portfolioAllocation[i];
    }


    return volatility;
  }

  const computeChatbotResponse = (expectationArray: Expectation, covariance: CovarianceMatrix, portfolioAllocation: Portfolio, initialAmount: number): Response => {
    const response: Response = {
      total: {
        efficiency: 0,
        volatility: 0,
      },
      graph: {
        years: Array.from(Array(NUMBER_OF_YEARS).keys()),
        meanEvolution: [],
        optimisticEvolution: [],
        pessimisticEvolution: [],
      },
      portfolioContent: [],
    };
    response.total.efficiency = computePortfolioEfficiency(expectationArray, portfolioAllocation);
    response.total.volatility = computePortfolioVolatility(covariance, portfolioAllocation);

    response.graph.meanEvolution = Array.from(response.graph.years,
      (year: number): number => initialAmount * Math.pow(response.total.efficiency, year));
    response.graph.optimisticEvolution = Array.from(response.graph.years,
      (year: number): number => initialAmount * Math.pow(response.total.efficiency + response.total.volatility, year));
    response.graph.pessimisticEvolution = Array.from(response.graph.years,
      (year: number): number => initialAmount * Math.pow(response.total.efficiency - response.total.volatility, year));
    
    response.portfolioContent = Array.from(portfolioAllocation,
      (fundWeight: number, index: number): PortfolioContentObject => { return ({fund: fundsArray[index], weight: fundWeight}) });


    return response;
  };

  const computationEngine = (userChoice: UserChoice, maxVolatility: number, initialAmount: number): Response => {
    const expectationArray = computeFundsExpectationArray();
    const covariance = computeFundsCovarianceArray(expectationArray);
    const portfolioAllocation = computePortfolioAllocation(expectationArray, covariance, userChoice, maxVolatility);
    const response = computeChatbotResponse(expectationArray, covariance, portfolioAllocation, initialAmount);


    return response;
  }

export default computationEngine;
