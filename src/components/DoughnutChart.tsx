import { ChartData } from 'chart.js';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';

import { Response } from '../types/types';

interface Props {
  portfolio: Response['portfolioContent'];
}

const ALL_COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#8AE399', '#F43996', '#AD1A58', '#DCF8E1', '#716BB9', '#D38F73', '#77E589'];

export class DoughnutChart extends React.Component<Props, ChartData> {
  constructor(props: Props) {
    super(props);

    this.state = {
      labels: [],
      datasets: [],
    };
  }

  componentDidMount() {
    const fundsCount = this.props.portfolio.length;
    const colors = ALL_COLORS.slice(0, fundsCount);

    this.setState({
      labels: this.props.portfolio.map(fund => fund.fund.name),
      datasets: [
        {
          data: this.props.portfolio.map(fund => Number(fund.weight.toFixed(2))),
          backgroundColor: colors,
          hoverBackgroundColor: colors,
        },
      ],
    });
  }

  render() {
    return <Doughnut legend={{ display: false }} width={800} height={500} data={this.state} />;
  }
}
