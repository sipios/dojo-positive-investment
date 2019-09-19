import { ChartData, ChartDataSets } from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';

import { Result } from '../types/types';

interface Props {
  graph: Result['graph']
};

const DATA_SET_SAMPLE: ChartDataSets = {
  fill: false,
  lineTension: 0.1,
  borderCapStyle: 'butt',
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: 'miter',
  pointBackgroundColor: '#fff',
  pointBorderWidth: 1,
  pointHoverRadius: 5,
  data: []
}

export class LineChart extends React.Component<Props, ChartData> {
  constructor(props: Props) {
    super(props);

    this.state = {
      labels: [],
      datasets: []
    };
  }

  componentDidMount() {
    const newDatasets = [
      {
        ...DATA_SET_SAMPLE,
        label: 'Evolution moyenne',
        data: this.props.graph.meanEvolution,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
      },
      {
        ...DATA_SET_SAMPLE,
        label: 'Evolution optimiste',
        data: this.props.graph.optimisticEvolution,
        backgroundColor: 'rgba(233, 62, 145, 0.4)',
        borderColor: 'rgba(233, 62, 145, 1)',
        pointBorderColor: 'rgba(233, 62, 145, 1)',
        pointHoverBackgroundColor: 'rgba(233, 62, 145, 1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
      },
      {
        ...DATA_SET_SAMPLE,
        label: 'Evolution pessimiste',
        data: this.props.graph.pessimisticEvolution,
        backgroundColor: 'rgba(0,204,102,0.4)',
        borderColor: 'rgba(0,204,102,1)',
        pointBorderColor: 'rgba(0,204,102,1)',
        pointHoverBackgroundColor: 'rgba(0,204,102,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
      }
    ];

    this.setState({
      labels: this.props.graph.years.map(year => year + ''),
      datasets: newDatasets,
    })
  }

  render() {
    return <Line width={800} height={500} data={this.state} />;
  }
}
