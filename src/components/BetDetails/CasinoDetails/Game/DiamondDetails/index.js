import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import DiamondBox from "../../../../DiamondBox";
import "./index.css";

class SlotsDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      result: 0,
      game: null,
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
    const result = bet.outcomeResultSpace.index;
    const game = bet.game;
    const resultSpace = bet.game.resultSpace;
    const winAmount = bet.winAmount.toFixed(8);

    this.setState({
      winAmount,
      resultSpace,
      result,
      game,
    });
  };

  render() {
    const { game, winAmount, result, resultSpace } = this.state;

    if (game === null) {
      return null;
    }

    return (
      <DiamondBox
        resultSpace={resultSpace}
        profitAmount={winAmount}
        resultBack={result}
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

export default connect(mapStateToProps)(SlotsDetails);
