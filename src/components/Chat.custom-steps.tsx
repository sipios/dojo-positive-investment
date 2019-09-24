import React from 'react';

import { DoughnutChart } from './DoughnutChart';
import { LineChart } from './LineChart';

export const PortfolioSummaryComponent = () => {
  // TODO : Récupérer les données de rendement et d'écart type du service et les afficher

  return <div className="global-result"></div>
};

export const DoughnutChartCustomComponent = () => {
  // TODO : Récupérer les données sur la répartition des fonds et les passer en props au composant DoughnutChart

  return (
    <div className="chart-wrapper">
      <DoughnutChart />
    </div>
  );
};

export const LineChartCustomComponent = () => {
  // TODO : Récupérer les données sur l'évolution de l'investissement de l'utilisateur et les passer en props au composant LineChart

  return (
    <div className="chart-wrapper">
      <LineChart />
    </div>
  );
};

export const OrderBookCustomComponent = () => {
  // TODO : Récupérer les données sur les fonds du portefeuille et construire un carnet d'ordres !

  return (
    <table className="order-book">
      <tbody>
      </tbody>
    </table>
  );
};
