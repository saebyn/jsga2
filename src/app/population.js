import React, {Component} from 'react';

import {ChromosomesChart} from './chromosomes_chart';
import {ChromosomesLegend} from './chromosomes_legend';
import {GA} from './ga';
import {Paginate} from './paginate';
import {Runner} from './runner';


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
      ga: GA.fromSettings(settings),
      generation: 0,
      page: 0,
      pageSize: 36,
    };

    this.handleStep = () => {
      this.setState({ga: this.state.ga.step()});
    };

    this.handleGotoPage = (page) => {
      this.setState({page});
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
    const {ga, generation, page, pageSize} = this.state;

    const chromosomesCount = ga ? ga.count() : 0;

    return (
      <div>
        <div className="row">
          <Runner onStep={this.handleStep} ga={ga} />
        </div>
        <div className="row">
          <ChromosomesLegend
            generation={generation}
            page={page}
            pageSize={pageSize}
            ga={ga}
            />
        </div>
        <div className="row">
          <ChromosomesChart
            generation={generation}
            page={page}
            pageSize={pageSize}
            ga={ga}
            />
        </div>
        <div className="row pagination-container">
          <Paginate
            onGotoPage={this.handleGotoPage}
            currentPage={page}
            pages={Math.ceil(chromosomesCount / pageSize)}
            />
        </div>
      </div>
    );
  }
}

Population.contextTypes = {
  router: React.PropTypes.object.isRequired
};
