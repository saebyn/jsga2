import React, {Component} from 'react';

import {ChromosomesChart} from './chromosomes_chart';
import {ChromosomesLegend} from './chromosomes_legend';
import {GA} from './ga';
import {Paginate} from './paginate';
import {PopulationLog} from './population_log';
import {Runner} from './runner';
import {findBaseColors} from './chromosome_abstract';


function jsonPropType(props, propName, componentName) {
    try {
        JSON.parse(props[propName]);
    } catch (exp) {
        return new Error(
            `Invalid prop \`${propName}\` supplied to \`${componentName}\`.
Validation failed.`
        );
    }

    return null;
}


export class Population extends Component {
  constructor(props) {
    super(props);

    const settings = JSON.parse(props.location.query.settings);

    this.state = {
      ga: new GA(settings),
      generation: 0,
      page: 0,
      pageSize: 36,
    };

    // separated out just so I don't have to have create ga first,
    // and give it a name that isn't shadowed by handleStep below.
    this.state.log = new PopulationLog(this.state.ga.spawn());

    this.handleStep = () => {
      const {log, ga} = this.state;

      this.setState({
        log: log.append(ga.step(log.last())),
      });
    };

    this.handleGotoPage = (page) =>
      this.setState({page});

    this.handleGenerationSwitch = (generation) => {
      this.setState({generation});
    };
  }

  static propTypes = {
      location: React.PropTypes.shape({
          query: React.PropTypes.shape({
              settings: jsonPropType,
          }),
      }),
  }

  shouldComponentUpdate(nextProps, nextState) {
      if (nextProps.location.query.settings !== this.props.location.query.settings) {
          return true;
      }

      if (nextState.ga !== this.state.ga) {
          return true;
      }

      if (nextState.log !== this.state.log) {
          return true;
      }

      if (nextState.generation !== this.state.generation) {
          return true;
      }

      if (nextState.page !== this.state.page) {
          return true;
      }

      if (nextState.pageSize !== this.state.pageSize) {
          return true;
      }

      return false;
  }

  render() {
    const {log, ga, generation, page, pageSize} = this.state;
    const bases = ga.getBases();
    const baseColors = findBaseColors(bases);
    const organismsCount = log.view({generation}).length;

    return (
      <div>
        <div className="row">
          <Runner onStep={this.handleStep} />
        </div>
        <div className="row">
          <ChromosomesLegend
            generation={generation}
            log={log}
            page={page}
            pageSize={pageSize}
            onSwitchGeneration={this.handleGenerationSwitch}
            baseColors={baseColors}
            bases={bases}
            />
        </div>
        <div className="row">
          <ChromosomesChart
            generation={generation}
            log={log}
            page={page}
            pageSize={pageSize}
            baseColors={baseColors}
            />
        </div>
        <div className="row pagination-container">
          <Paginate
            onGotoPage={this.handleGotoPage}
            currentPage={page}
            pages={Math.ceil(organismsCount / pageSize)}
            />
        </div>
      </div>
    );
  }
}

Population.contextTypes = {
  router: React.PropTypes.object.isRequired
};
