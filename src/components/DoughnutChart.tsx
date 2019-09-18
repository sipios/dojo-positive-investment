import { ChartData } from 'chart.js';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';

import { PortfolioFund } from './Result';

interface Props {
  portfolio: PortfolioFund[]
}

const allColors = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#8ae399'
];


export class DoughnutChart extends React.Component<Props, ChartData> {
  constructor(props: Props) {
    super(props);

    this.state = {
      labels: [],
      datasets: []
    };
  }

  componentDidMount() {
    const fundsNumber = this.props.portfolio.length;
    const colors = allColors.slice(0, fundsNumber);

    this.setState({
      labels: this.props.portfolio.map(fund => fund.fund.name),
      datasets: [{
        data: this.props.portfolio.map(fund => fund.weight),
        backgroundColor: colors,
        hoverBackgroundColor: colors
      }]
    })
  }

  render() {
    return <Doughnut data={this.state} />;
  }
}
