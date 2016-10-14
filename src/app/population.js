/* @flow */
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


type PopulationState = {
  ga: GA,
  generation: number,
  log: PopulationLog,
  page: number,
  pageSize: number,
};


export class Population extends Component {
  static propTypes = {
      location: React.PropTypes.shape({
          query: React.PropTypes.shape({
              settings: jsonPropType,
          }),
      }),
  }

  state: PopulationState

  constructor(props: Object) {
    super(props);

    const settings = JSON.parse(props.location.query.settings);

    const firstGA = new GA(settings);

    this.state = {
      ga: firstGA,
      generation: 0,
      log: new PopulationLog(firstGA.spawn()),
      page: 0,
      pageSize: 36,
    };

    (this:any).handleStep = this.handleStep.bind(this);
    (this:any).handleGotoPage = this.handleGotoPage.bind(this);
    (this:any).handleGenerationSwitch = this.handleGenerationSwitch.bind(this);
  }

  shouldComponentUpdate(nextProps: Object, nextState: PopulationState) {
      if (nextProps.location.query.settings !== this.props.location.query.settings) {
          return true;
      }

      const fields = ['ga', 'log', 'generation', 'page', 'pageSize'];

      for (let field of fields) {
        if (nextState[field] !== this.state[field]) {
            return true;
        }
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

  handleStep() {
    const {log, ga} = this.state;

    this.setState({
      log: log.append(ga.step(log.last())),
    });
  }

  handleGotoPage(page: number) {
    this.setState({page});
  }

  handleGenerationSwitch(generation: number) {
    this.setState({generation});
  }
}

Population.contextTypes = {
  router: React.PropTypes.object.isRequired
};
