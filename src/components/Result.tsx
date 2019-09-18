import './Result.css';

import React from 'react';

import { Fund } from '../types/funds';
import { DoughnutChart } from './DoughnutChart';
import { LineChart } from './LineChart';

export type ResultData = {
  total: {
    efficiency: number;
    volatility: number;
  },
  graph: {
    years: number[];
    meanEvolution: number[];
    optimisticEvolution: number[];
    pessimisticEvolution: number[];
  },
  portfolio: PortfolioFund[];
}

export type PortfolioFund = {
  fund: Fund,
  weight: number
}

export class Result extends React.Component<ResultData> {
  render() {
    return (
      <div className="result">
        <div className="report">
          <div>Votre portefeuille :</div>
          <div className="efficiency">Rendement : {this.props.total.efficiency}%</div>
          <div className="volatility">Volatilité : {this.props.total.volatility}</div>
        </div>
        <DoughnutChart portfolio={this.props.portfolio} />
        <LineChart graph={this.props.graph} />
      </div>
    );
  }
}
