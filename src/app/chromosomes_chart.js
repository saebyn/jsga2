import React, {Component} from 'react';

import {ChromosomeAbstract} from './chromosome_abstract';


export class ChromosomesChart extends Component {
  static propTypes = {
    baseColors: React.PropTypes.instanceOf(Map).isRequired,
    log: React.PropTypes.object.isRequired,
    generation: React.PropTypes.number.isRequired,
    page: React.PropTypes.number.isRequired,
    pageSize: React.PropTypes.number.isRequired,
  }

  render() {
    const {baseColors, log, generation, page, pageSize} = this.props;
    const organisms = log.view({page, pageSize, generation});
    const style = {
      width: '15%',
      minWidth: '5em',
      display: 'inline-block',
      margin: '5px',
    };

    return (
      <div>
        {organisms.map(
          (organism, index) =>
            <div key={index} style={style}>
              <ChromosomeAbstract baseColors={baseColors} chromosome={organism.chromosome} />
            </div>
        )}
      </div>
    );
  }
}
