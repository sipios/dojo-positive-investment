import { ChartData } from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';

import { ResultData } from './Result';

interface Props {
  graph: ResultData['graph']
};

export class LineChart extends React.Component<Props, ChartData> {
  constructor(props: Props) {
    super(props);

    this.state = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Evolution moyenne',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          data: [65, 59, 80, 81, 56, 55, 40]
        }
      ]
    };
  }

  componentDidMount() {
    this.setState({
      labels: this.props.graph.years.map(year => year + ''),
      // datasets: [
      //   {
      //     ...this.state.datasets[0],
      //     data: this.props.graph.meanEvolution,
      //   }
      // ]
    })
  }

  render() {
    return <Line data={this.state} />;
  }
}
