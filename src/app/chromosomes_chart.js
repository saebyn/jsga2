import {ChromosomeAbstract, findBaseColors} from './chromosome_abstract';

import React, {Component} from 'react';


export class ChromosomesChart extends Component {
  static propTypes = {
    ga: React.PropTypes.object.isRequired,
    generation: React.PropTypes.number.isRequired,
    page: React.PropTypes.number.isRequired,
    pageSize: React.PropTypes.number.isRequired,
  }

  render() {
    const {ga, generation, page, pageSize} = this.props;
    const baseColors = findBaseColors(ga.getBases());
    const viewStart = page * pageSize;
    const viewEnd = (page + 1) * pageSize;
    const chromosomes = ga.view(viewStart, viewEnd, generation);
    const style = {
      width: '10%',
      display: 'inline-block',
      margin: '5px',
    };

    return (
      <div>
        {chromosomes.map(
          (chromosome, index) =>
            <div key={index} style={style}>
              <ChromosomeAbstract baseColors={baseColors} chromosome={chromosome} />
            </div>
        )}
      </div>
    );
  }
}
