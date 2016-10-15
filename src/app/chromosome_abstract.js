import React, {Component} from 'react';
import Canvas from 'react-canvas-component';


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

  constructor(props) {
    super(props);
    this.drawCanvas = this.drawCanvas.bind(this);
  }

  drawCanvas({ctx}) {
    const {width, height} = ctx.canvas;
    const {baseColors, chromosome} = this.props;
    const sideLength = Math.ceil(Math.sqrt(chromosome.length));
    const cellSize = Math.min(width, height) / sideLength;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // iterate more times over chromosome, but
    // only change fill style minimally.
    for (let base of baseColors.keys()) {
      ctx.fillStyle = this.getBaseColor(base);

      for (let baseIndex = 0; baseIndex < chromosome.length; baseIndex++) {
        if (chromosome[baseIndex] === base) {
          ctx.fillRect(
            baseIndex % sideLength * cellSize,
            Math.floor(baseIndex / sideLength) * cellSize,
            cellSize,
            cellSize
          );
        }
      }
    }


    ctx.restore();
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
    const style = {
      width: '100%',
      height: '100%',
    };

    return (
      <Canvas
        draw={this.drawCanvas}
        realtime={true}
        style={style}
      />
    );
  }
}
