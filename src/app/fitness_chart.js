import React, {Component} from 'react';

import {PopulationLog} from './population_log';


const WIDTH = 500;
const HEIGHT = 100;


function scaleX(xval, xmax) {
  return xval / Math.max(xmax, 1) * WIDTH;
}

function scaleY(yval, ymax) {
  if (ymax === 0) {
    return 0;
  } else {
    return (yval / ymax * HEIGHT);
  }
}


export class FitnessChart extends Component {
  static propTypes = {
      log: React.PropTypes.instanceOf(PopulationLog),
  }

  render() {
    const {log: {populations}} = this.props;

    const points = populations
      .map(({stats}, index) => [index, stats.mean]);

    const xmax = populations.length;
    const ymax = 1;

    const pointsString = points
      .map(([xval, yval]) => ([scaleX(xval, xmax), scaleY(yval, ymax)]))
      .map((point) => point.join(','))
      .join(' ');

    const viewBox = [0, 0, WIDTH, HEIGHT].join(' ');

    return (
      <svg viewBox={viewBox}>
        <polyline
          fill="none"
          stroke="#0074d9"
          strokeWidth="1"
          points={pointsString}
          />
      </svg>
    );
  }
}
