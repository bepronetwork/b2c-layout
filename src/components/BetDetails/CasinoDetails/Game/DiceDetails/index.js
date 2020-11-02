import React, { Component } from "react";
import { connect } from "react-redux";
import { Slider } from "components";
import _ from "lodash";
import "./index.css";

class DiceDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      result: null,
    };
  }

  componentDidMount() {
    this.projectData(this.props);
  }

  componentWillReceiveProps(props) {
    this.projectData(props);
  }

  projectData = async (props) => {
    const { bet } = this.props;

    const value = bet.result.length;
    const result = bet.outcomeResultSpace.key;

    this.setState({
      value,
    });

    setTimeout(() => {
      this.setState({
        result,
      });
    }, 300);
  };

  render() {
    const { value, result } = this.state;
    return (
      <Slider
        roll={"under"}
        value={value}
        result={result}
        disableControls={true}
        animating={true}
        isBetDetails={true}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language,
  };
}

export default connect(mapStateToProps)(DiceDetails);
