import React from 'react';

import { PortfolioContentObject, Graph } from '../types/types';

import { DoughnutChart } from './DoughnutChart';
import { LineChart } from './LineChart';

type PortfolioSummaryComponentProps = { rateReturn: number; standardDeviation: number };

export const PortfolioSummaryComponent = (props: PortfolioSummaryComponentProps) => (
  <div className="global-result">
    Avec celui-ci, votre perspective de gain s'élève à <span className="bold">{props.rateReturn}%</span> avec une
    volatilité de <span className="bold">{props.standardDeviation}%</span>
  </div>
);

type DoughnutChartCustomComponentProps = { portfolioContent: PortfolioContentObject[] };

export const DoughnutChartCustomComponent = (props: DoughnutChartCustomComponentProps) => (
  <div className="chart-wrapper">
    <DoughnutChart portfolio={props.portfolioContent} />
  </div>
);

type LineChartCustomComponentProps = { graph: Graph };

export const LineChartCustomComponent = (props: LineChartCustomComponentProps) => (
  <div className="chart-wrapper">
    <LineChart graph={props.graph} />
  </div>
);

type OrderBookCustomComponentProps = { portfolioContent: PortfolioContentObject[]; initialInvestment: number };

export const OrderBookCustomComponent = (props: OrderBookCustomComponentProps) => (
  <table className="order-book">
    <tbody>
      <tr>
        <th>Isin</th>
        <th>Fond</th>
        <th>Prix</th>
      </tr>
      {props.portfolioContent.map(({ fund, weight }, index: number) => (
        <tr key={index}>
          <td>{fund.isin}</td>
          <td>{fund.name}</td>
          <td>{weight * props.initialInvestment}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
