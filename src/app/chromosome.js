import React, {Component} from 'react';


export class Chromosome extends Component {
  getBaseStyle(thisBase) {
    const hue = this.props.baseColors.get(thisBase);
    const contrastHue = (hue + 180) % 360;

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
      color: `hsla(${contrastHue}, 50%, 30%, 1)`
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
