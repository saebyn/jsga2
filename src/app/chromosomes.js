import React, {Component} from 'react';

import {ChromosomeAbstract} from './chromosome_abstract';


export class Chromosomes extends Component {
  findBaseColors(bases) {
    return new Map(
      bases.map(
        (base, index) => [base, 360.0 / bases.length * index]
      ).map(
        ([base, color]) =>
          [base, {color, inverse: (color + 180) % 360}]
      )
    );
  }

  render() {
    const {ga, generation, page, pageSize} = this.props;
    const baseColors = this.findBaseColors(ga.getBases());
    const viewStart = page * pageSize;
    const viewEnd = (page + 1) * pageSize;
    const chromosomes = ga.view(viewStart, viewEnd, generation);
    const generations = ga.countGenerations();
    const totalChromosomes = ga.count();
    const style = {
      width: '10%',
      display: 'inline-block',
      margin: '5px',
    };

    function getSampleStyle(base) {
      const {color, inverse} = baseColors.get(base);

      return {
        display: 'inline-block',
        padding: '0 0.5em',
        margin: '0.5em',
        textAlign: 'center',
        fontWeight: 'bold',
        backgroundColor: `hsla(${color}, 50%, 80%, 1)`,
        color: `hsla(${inverse}, 50%, 30%, 1)`,
      };
    }

    return (
      <div>
        <dl>
          <dt>Generation</dt>
          <dd><strong>{generations - generation}</strong> of <strong>{generations}</strong></dd>

          <dt>Chromosomes</dt>
          <dd>Viewing <strong>{chromosomes.length}</strong> of <strong>{totalChromosomes}</strong> chromosomes in this generation.</dd>

          <dt>Chromosome bases</dt>
          <dd>
            <ul>
              {ga.getBases().map(
                (base, index) =>
                  <li key={index} style={getSampleStyle(base)}>{base}</li>
              )}
            </ul>
          </dd>
        </dl>
        <div>
          {chromosomes.map(
            (chromosome, index) =>
              <div key={index} style={style}>
                <ChromosomeAbstract baseColors={baseColors} chromosome={chromosome} />
              </div>
          )}
        </div>
      </div>
    );
  }
}
