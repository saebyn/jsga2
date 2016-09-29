/* eslint react/prop-types: 0 */
import React, {Component} from 'react';

const CENT = 100.0;


function getDefaults() {
  return {
    bases: [1, 2, 3, 4],
    startingPopulation: 100,
    fitnessFunction: 'chromosome.reduce(function (accum, num) { return accum + num }, 0) / chromosome.length',
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

    this.handleStartingPopulation = ({target: {value}}) => {
      this.setState({startingPopulation: parseInt(value, 10)});
    };
    this.handleFitnessFunction = ({target: {value}}) => {
      this.setState({fitnessFunction: value});
    };
    this.handleChromosomeLength = ({target: {value}}) => {
      this.setState({chromosomeLength: parseInt(value, 10)});
    };
    this.handleElitism = ({target: {checked}}) => {
      this.setState({elitism: checked});
    };
    this.handleSelectionElitism = ({target: {value}}) => {
      this.setState({selectionElitism: value / CENT});
    };
    this.handleTournamentSize = ({target: {value}}) => {
      this.setState({tournamentSize: parseInt(value, 10)});
    };
    this.handleSelectFitnessProportionate = () => {
      this.setState({selectionMechanism: 'fitness-proportionate'});
    };
    this.handleSelectTournament = () => {
      this.setState({selectionMechanism: 'tournament'});
    };
    this.handleMutationChance = ({target: {value}}) => {
      this.setState({mutationChance: value / CENT});
    };
    this.handleCrossoverChance = ({target: {value}}) => {
      this.setState({crossoverChance: value / CENT});
    };

    this.handleCreate = () => {
      this.props.onCreate(this.state);
    };

    this.handleReset = () => {
      this.setState(getDefaults());
      this.props.onReset();
    };
  }

  render() {
    let {startingPopulation, fitnessFunction, chromosomeLength, selectionMechanism, tournamentSize, elitism, selectionElitism, crossoverChance, mutationChance} = this.state;

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
              onChange={this.handleStartingPopulation}
              />
            <small className="form-text text-muted">How many organisms should be seeded into the first generation?</small>
          </div>
          <div className="form-group">
            <label>
              Fitness function
            </label>
            <textarea className="form-control" rows="5" onChange={this.handleFitnessFunction} value={fitnessFunction}></textarea>
            <small className="form-text text-muted">This should be a <em>Javascript expression</em> that evaluates to the calculated fitness for a given <code>chromosome</code>.</small>
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
              onChange={this.handleChromosomeLength}
              />
            <small className="form-text text-muted">How many bases should each chromosome have?</small>
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
                    onChange={this.handleTournamentSize}
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
                value={selectionElitism * 100}
                onChange={this.handleSelectionElitism}
                />
              <div className="input-group-addon">%</div>
            </div>
            <small className="form-text text-muted">What percentage of the most fit chromosomes in each generation should be directly cloned into the next generation?</small>
          </div>
          <div className="form-group">
            <label>
              Crossover chance
            </label>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                min="0" max="100"
                step="any"
                value={crossoverChance * 100}
                onChange={this.handleCrossoverChance}
                />
              <div className="input-group-addon">%</div>
            </div>
            <small className="form-text text-muted">For each pair of chromosomes selected to reproduce, what is the probability that a crossover will occur?</small>
          </div>
          <div className="form-group">
            <label>
              Mutation chance
            </label>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                min="0" max="100"
                step="any"
                value={mutationChance * 100}
                onChange={this.handleMutationChance}
                />
              <div className="input-group-addon">%</div>
            </div>
            <small className="form-text text-muted">For each base in a new chromosome, what is the probability that a mutation to a different base will occur?</small>
          </div>

          <div className="form-group row">
            <div className="col-sm-2">
              <button className="btn btn-danger" onClick={this.handleReset} type="button">Reset</button>
            </div>
            <div className="offset-sm-4 col-sm-2">
              <button className="btn btn-primary" onClick={this.handleCreate} type="button">Populate</button>
            </div>
          </div>
        </fieldset>
      </div>
    );
  }
}
