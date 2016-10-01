import React, {Component} from 'react';


export function findBaseColors(bases) {
  return new Map(
    bases.map(
      (base, index) => [base, 360.0 / bases.length * index]
    ).map(
      ([base, color]) =>
        [base, {color, inverse: (color + 180) % 360}]
    )
  );
}


export class ChromosomeAbstract extends Component {
  getBaseColor(thisBase) {
    const hue = this.props.baseColors.get(thisBase).color;

    return `hsla(${hue}, 50%, 80%, 1)`;
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
