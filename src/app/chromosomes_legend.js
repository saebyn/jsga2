import React, {Component} from 'react';

/*
 * Skipping flow for this file for now, since it doesn't understand
 * [...Array(generations).keys()]
 */


export class ChromosomesLegend extends Component {
  static propTypes = {
    baseColors: React.PropTypes.instanceOf(Map).isRequired,
    bases: React.PropTypes.array.isRequired,
    log: React.PropTypes.object.isRequired,
    generation: React.PropTypes.number.isRequired,
    page: React.PropTypes.number.isRequired,
    pageSize: React.PropTypes.number.isRequired,
    onSwitchGeneration: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.handleGenerationSwitch = ({target: {value}}) =>
      props.onSwitchGeneration(parseInt(value, 10));
  }

  render() {
    const {baseColors, bases, generation, log, page, pageSize} = this.props;
    const chromosomes = log.view({page, pageSize, generation});
    const generations = log.length;
    const totalChromosomes = log.view({generation}).length;

    function getSampleStyle(base) {
      const {hue, inverse} = baseColors.get(base);

      return {
        display: 'inline-block',
        padding: '0 0.5em',
        margin: '0.5em',
        textAlign: 'center',
        fontWeight: 'bold',
        backgroundColor: `hsla(${hue}, 50%, 80%, 1)`,
        color: `hsla(${inverse}, 50%, 30%, 1)`,
      };
    }

    return (
      <div className="card">
        <dl className="card-block">
          <dt>Generation</dt>
          <dd>
            <select value={generation} onChange={this.handleGenerationSwitch}>
              {
                [...Array(generations).keys()].map(
                  (generationIndex) =>
                    <option key={generationIndex} value={generationIndex}>{generations - generationIndex}</option>
                )
              }
            </select> of <strong>{generations}</strong>
          </dd>

          <dt>Chromosomes</dt>
          <dd>
            Viewing <strong>{chromosomes.length}</strong> of <strong>{totalChromosomes}</strong> chromosomes in this generation.
          </dd>

          <dt>Chromosome bases</dt>
          <dd>
            <ul>
              {bases.map(
                (base, index) =>
                  <li key={index} style={getSampleStyle(base)}>{base}</li>
              )}
            </ul>
          </dd>
        </dl>
      </div>
    );
  }
}
