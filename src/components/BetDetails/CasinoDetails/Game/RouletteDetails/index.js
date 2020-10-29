import React, { Component } from "react";
import { connect } from "react-redux";
import RouletteBoard from "components/RouletteBoard";
import { Typography } from "components";
import redColors from "../../../../RouletteGameCard/redColors";
import classNames from "classnames";
import _ from "lodash";
import "./index.css";

class RouletteDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      betHistory: [],
      number: null
    };
  }

  componentDidMount() {
    this.projectData(this.props);
  }

  componentWillReceiveProps(props) {
    this.projectData(props);
  }

  projectData = async props => {
    const { bet } = this.props;

    const number = bet.outcomeResultSpace.index;
    const result = bet.result;
    const betHistory = result.map(el => {
      return { cell: el._id.place, chip: el._id.value.toFixed(3) };
    });

    this.setState({
      betHistory,
      number
    });
  };

  render() {
    const { betHistory, number } = this.state;
    const resultStyles = classNames("result", {
      green: number == 0,
      red: redColors.includes(number)
    });

    return (
      <div styleName="container">
        <div styleName={resultStyles}>
          <Typography variant="body" color="white">
            {number}
          </Typography>
        </div>
        <RouletteBoard
          betHistory={betHistory}
          rotating={false}
          isAddChipDisabled={true}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language
  };
}

export default connect(mapStateToProps)(RouletteDetails);
