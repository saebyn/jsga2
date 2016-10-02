/* global ace */
import React, {Component} from 'react';

const CENT = 100.0;
const PERCENT_PRECISION = 2;


// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
function round(number, precision) {
  const base = 10;
  const factor = Math.pow(base, precision);
  const tempNumber = number * factor;
  const roundedTempNumber = Math.round(tempNumber);

  return roundedTempNumber / factor;
}


function formatPercent(number) {
  return `${round(number * CENT, PERCENT_PRECISION)}%`;
}


function getDefaults() {
  return {

    /* eslint-disable no-magic-numbers */
    bases: [1, 2, 3, 4],

    /* eslint-enable no-magic-numbers */

    startingPopulation: 100,
    fitnessFunctionSource: `return chromosome.reduce(
  function (accum, num) {
    return accum + num;
  },
  0
) / chromosome.length;`,
    chromosomeLength: 200,
    selectionMechanism: 'tournament',
    tournamentSize: 10,
    elitism: false,
    selectionElitism: 0.01,
    crossoverChance: 0.70,
    mutationChance: 0.001
  };
}


export class PopulationSettings extends Component {
  constructor(props) {
    super(props);
    this.state = getDefaults();

    this.handleInt = (key, {target: {value}}) =>
      this.setState({[key]: parseInt(value, 10)});

    this.handlePercent = (key, {target: {value}}) => {
      this.setState({[key]: round(parseFloat(value), PERCENT_PRECISION) / CENT});
    };

    this.handleFitnessFunction = ({target: {value}}) =>
      this.setState({fitnessFunctionSource: value});

    this.handleElitism = ({target: {checked}}) =>
      this.setState({elitism: checked});

    this.handleSelectFitnessProportionate = () =>
      this.setState({selectionMechanism: 'fitness-proportionate'});

    this.handleSelectTournament = () =>
      this.setState({selectionMechanism: 'tournament'});

    this.handleCreate = () => {
      this.context.router.push({
        pathname: '/simulation',
        query: {settings: JSON.stringify(this.state)},
      });
    };

    this.handleReset = () => {
      this.setState(getDefaults());
    };
  }

  componentDidMount() {
    let editor = ace.edit(this.refs.editor);

    editor.getSession().setMode('ace/mode/javascript');
    setTimeout(() => editor.resize());
  }

  render() {
    let {startingPopulation, fitnessFunctionSource, chromosomeLength, selectionMechanism, tournamentSize, elitism, selectionElitism, crossoverChance, mutationChance} = this.state;

    return (
      <div>
        <fieldset>
          <div className="form-group">
            <label>
              Starting population
            </label>
            <input
              type="number"
              className="form-control"
              min="1"
              value={startingPopulation}
              onChange={this.handleInt.bind(this, 'startingPopulation')}
              />
            <small className="form-text text-muted">How many organisms should be seeded into the first generation?</small>
          </div>
          <div className="form-group">
            <label>
              Chromosome length
            </label>
            <input
              type="number"
              className="form-control"
              min="1" max="1000"
              value={chromosomeLength}
              onChange={this.handleInt.bind(this, 'chromosomeLength')}
              />
            <small className="form-text text-muted">How many bases should each chromosome have?</small>
          </div>
          <div className="form-group">
            <label>
              Fitness function
            </label>
            <textarea ref="editor" className="form-control ace" rows="5" cols="80" onChange={this.handleFitnessFunction} value={fitnessFunctionSource}></textarea>
            <small className="form-text text-muted">This should be <em>Javascript</em> that returns the calculated fitness for a given <code>chromosome</code>.</small>
          </div>
          <div className="form-group">
            <legend className="col-form-legend">
              Selection mechanism
            </legend>
            <label className="custom-control custom-radio">
              <input
                type="radio"
                className="custom-control-input"
                name="selection-mechanism"
                checked={selectionMechanism === 'fitness-proportionate'}
                onChange={this.handleSelectFitnessProportionate}
                />
              <span className="custom-control-indicator"></span>
              <span className="custom-control-description">Fitness Proportionate</span>
            </label>
            <label className="custom-control custom-radio">
              <input
                type="radio"
                className="custom-control-input"
                name="selection-mechanism"
                checked={selectionMechanism === 'tournament'}
                onChange={this.handleSelectTournament}
                />
              <span className="custom-control-indicator"></span>
              <span className="custom-control-description">Tournament</span>
            </label>
            <small className="form-text text-muted">What mechanism should be used to select chromosomes to reproduce?</small>
          </div>
            {
              selectionMechanism === 'tournament'
              ? <div className="form-group">
                  <label>
                    Tournament size
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    step="1"
                    value={tournamentSize}
                    onChange={this.handleInt.bind(this, 'tournamentSize')}
                    />
                  <small className="form-text text-muted">What number of chromosomes should be randomly chosen for each tournament?</small>
                </div> : null
            }
          <div className="form-group">
            <label>
              Selection elitism
            </label>
            <div className="input-group">
              <div className="input-group-addon">
                <label className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    checked={elitism}
                    onChange={this.handleElitism}
                    />
                  <span className="custom-control-indicator"></span>
                </label>
              </div>
              <input
                type="number"
                className="form-control"
                disabled={!elitism}
                min="1" max="100"
                step="any"
                value={selectionElitism * CENT}
                onChange={this.handlePercent.bind(this, 'selectionElitism')}
                />
              <div className="input-group-addon">%</div>
            </div>
            <small className="form-text text-muted">The percentage of the most fit chromosomes in each generation should be directly cloned into the next generation is {formatPercent(selectionElitism)}</small>
          </div>
          <div className="form-group">
            <label>
              Crossover chance
            </label>
            <input
              type="range"
              className="form-control"
              min="0" max="100"
              step="0.1"
              value={crossoverChance * CENT}
              onChange={this.handlePercent.bind(this, 'crossoverChance')}
              />
            <small className="form-text text-muted">For each pair of chromosomes selected to reproduce, the probability that a crossover will occur is {formatPercent(crossoverChance)}</small>
          </div>
          <div className="form-group">
            <label>
              Mutation chance
            </label>
            <input
              type="range"
              className="form-control"
              min="0" max="100"
              step="0.1"
              value={mutationChance * CENT}
              onChange={this.handlePercent.bind(this, 'mutationChance')}
              />
            <small className="form-text text-muted">For each base in a new chromosome, the probability that a mutation to a different base will occur is {formatPercent(mutationChance)}</small>
          </div>

          <div className="form-group row">
            <div className="col-xs-2">
              <button className="btn btn-danger" onClick={this.handleReset} type="button">Reset</button>
            </div>
            <div className="offset-xs-4 col-xs-2">
              <button className="btn btn-primary" onClick={this.handleCreate} type="button">Populate</button>
            </div>
          </div>
        </fieldset>
      </div>
    );
  }
}

PopulationSettings.contextTypes = {
  router: React.PropTypes.object.isRequired
};
