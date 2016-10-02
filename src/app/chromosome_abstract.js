import React, {Component} from 'react';

export const HUE_RANGE = 360.0;
export const HALF_HUE_RANGE = 180.0;


export function contrastHue(hue) {
  return (hue + HALF_HUE_RANGE) % HUE_RANGE;
}


export function findBaseColors(bases) {
  return new Map(
    bases.map(
      (base, index) => [base, HUE_RANGE / bases.length * index]
    ).map(
      ([base, hue]) =>
        [base, {hue, inverse: contrastHue(hue)}]
    )
  );
}


export class ChromosomeAbstract extends Component {
  static propTypes = {
    baseColors: React.PropTypes.instanceOf(Map).isRequired,
    chromosome: React.PropTypes.array.isRequired,
  }

  getBaseColor(thisBase) {
    const hue = this.props.baseColors.get(thisBase).hue;

    return `hsla(${hue}, 50%, 80%, 1)`;
  }

  shouldComponentUpdate(nextProps) {
      if (nextProps.baseColors !== this.props.baseColors) {
          return true;
      }

      if (nextProps.chromosome !== this.props.chromosome) {
          return true;
      }

      return false;
  }

  render() {
    const chromosome = this.props.chromosome;
    const sideLength = Math.ceil(Math.sqrt(chromosome.length));
    const viewBox = [0, 0, sideLength, sideLength].join(' ');

    return (
      <svg viewBox={viewBox}>
        {chromosome.map(
          (base, index) =>
            <rect
              key={index}
              fill={this.getBaseColor(base)}
              width="1"
              height="1"
              x={index % sideLength}
              y={Math.floor(index / sideLength)}
              />
        )}
      </svg>
    );
  }
}
