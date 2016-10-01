import React, {Component} from 'react';


export class Runner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      steps: 300,
      timeoutId: null
    };

    this.handleSteps = ({target: {value}}) => {
      this.setState({steps: parseInt(value, 10)});
    };

    this.handleStep = () => {
      this.props.onStep();
    };

    this.handleRun = () => {
      let {steps} = this.state;

      if (steps > 0) {
        this.props.onStep();
        this.setState(
          {steps: steps - 1},
          () => {
            this.setState({timeoutId: setTimeout(this.handleRun)});
          }
        );
      } else {
        this.setState({timeoutId: null});
      }
    };

    this.handleStop = () => {
      let {timeoutId} = this.state;

      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        this.setState({timeoutId: null});
      }
    };
  }

  static propTypes = {
      onStep: React.PropTypes.func,
  }

  render() {
    let {steps, timeoutId} = this.state;

    return (
      <div className="form-group">
        <button
          className="btn btn-primary col-xs-2 col-sm-1"
          disabled={timeoutId !== null}
          onClick={this.handleStep}>Step</button>
        <button
          className="btn col-sm-2 col-xs-3"
          disabled={timeoutId !== null}
          onClick={this.handleRun}>Run for ...</button>
        <div className="col-sm-2 col-xs-3">
          <input
            type="number"
            className="form-control"
            min="0" step="1"
            onChange={this.handleSteps}
            value={steps}
            />
          <label>Steps</label>
        </div>
        <button
          className="btn btn-danger offset-xs-2 col-sm-1 col-xs-2"
          disabled={timeoutId === null}
          onClick={this.handleStop}
          >
          Stop
          </button>
      </div>
    );
  }
}
