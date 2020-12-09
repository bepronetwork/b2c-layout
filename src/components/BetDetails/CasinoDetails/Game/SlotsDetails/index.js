import React, { Component } from "react";
import { connect } from "react-redux";
import SlotsBox from "../../../../SlotsBox";
import "./index.css";

class SlotsDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      game: null
    };
  }

  componentDidMount() {
    this.projectData();
  }

  componentWillReceiveProps() {
    this.projectData();
  }

  projectData = async () => {
    const { bet } = this.props;
    const result = bet.outcomeResultSpace;
    const game = bet.game;
    const winAmount = bet.winAmount.toFixed(8);
    const multiplier = (bet.winAmount / bet.betAmount).toFixed(2);

    this.setState({
      game,
      result,
      winAmount,
      multiplier
    });
  };

  render() {
    const { result, game, winAmount, multiplier } = this.state;

    if (game === null) {
      return null;
    }

    return (
      <SlotsBox result={result} multiplier={multiplier} winAmount={winAmount} />
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language
  };
}

export default connect(mapStateToProps)(SlotsDetails);
