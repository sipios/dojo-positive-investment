import React from 'react';

import { DoughnutChart } from './DoughnutChart';
import { LineChart } from './LineChart';

import { ChatService } from '../services/chatService';

export const PortfolioSummaryComponent = () => {
  const { rateReturn, standardDeviation } = ChatService.getInstance().getTotal();
  return (
    <div className="global-result">
      Avec celui-ci, votre perspective de gain s'élève à <span className="bold">{(100 * rateReturn).toFixed(2)}%</span>{' '}
      avec une volatilité de <span className="bold">{(100 * standardDeviation).toFixed(2)}%</span>
    </div>
  );
};

export const DoughnutChartCustomComponent = () => {
  const portfolioContent = ChatService.getInstance().getPortfolioContent();
  return (
    <div className="chart-wrapper">
      <DoughnutChart portfolio={portfolioContent} />
    </div>
  );
};

export const LineChartCustomComponent = () => {
  const graph = ChatService.getInstance().getGraph();
  return (
    <div className="chart-wrapper">
      <LineChart graph={graph} />
    </div>
  );
};

export const OrderBookCustomComponent = () => {
  const initialInvestment = ChatService.getInstance().getInitialInvestment();
  const portfolioContent = ChatService.getInstance().getPortfolioContent();
  return (
    <table className="order-book">
      <tbody>
        <tr>
          <th>Isin</th>
          <th>Fond</th>
          <th>Prix</th>
        </tr>
        {portfolioContent.map(({ fund, weight }, index: number) => (
          <tr key={index}>
            <td>{fund.isin}</td>
            <td>{fund.name}</td>
            <td>{(weight * initialInvestment).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
