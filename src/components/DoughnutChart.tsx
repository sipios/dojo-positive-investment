import { ChartData } from 'chart.js';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';

// TODO : Définir les Props du composant
interface Props {
}

const ALL_COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#8AE399', '#198C3D', '#F43996', '#AD1A58', '#782325', '#DCF8E1', '#716BB9', '#D38F73', '#77E589', '#5C9BF2', '#14CCD5'];

export class DoughnutChart extends React.Component<Props, ChartData> {
  constructor(props: Props) {
    super(props);

    this.state = {
      labels: [],
      datasets: [],
    };
  }

  componentDidMount() {
    // TODO : Modifier fundsCount avec les props
    const fundsCount = 3;
    const colors = ALL_COLORS.slice(0, fundsCount);

    this.setState({
      labels: [],
      datasets: [
        {
          // TODO : Remplir data avec les props
          data: [],
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
