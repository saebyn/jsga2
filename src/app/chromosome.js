/* @flow */
import React, {Component} from 'react';

import type {Base} from './types';
import {contrastHue} from './chromosome_abstract';


export class Chromosome extends Component {
  static propTypes = {
    baseColors: React.PropTypes.instanceOf(Map).isRequired,
    chromosome: React.PropTypes.array.isRequired,
  }

  getBaseStyle(thisBase: Base) {
    const hue = this.props.baseColors.get(thisBase);

    return {
      display: 'inline-block',
      height: '2em',
      width: '2em',
      padding: '0.1em',
      margin: '0.1em',
      textAlign: 'center',
      verticalAlign: 'middle',
      fontWeight: 'bold',
      backgroundColor: `hsla(${hue}, 50%, 80%, 1)`,
      color: `hsla(${contrastHue(hue)}, 50%, 30%, 1)`
    };
  }

  render() {
    const chromosome = this.props.chromosome;

    return (
      <ol>
        {chromosome.map(
          (base, index) => <li key={index} style={this.getBaseStyle(base)}>{base}</li>
        )}
      </ol>
    );
  }
}
