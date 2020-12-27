import React, { Component } from "react";
import { connect } from "react-redux";
import { BetSlip } from "components/Esports";
import { Typography } from "components";
import { BetsIcon } from "components";
import classNames from "classnames";
import "./index.css";

class BetSlipFloat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
    };
  }

  expandClick() {
    const { expand } = this.state;

    this.setState({
      expand: !expand,
    });
  }

  render() {
    const { betSlip, onHandleLoginOrRegister } = this.props;
    const { expand } = this.state;

    const styles = classNames("wrapper", {
      betExpandDisplay: expand,
      betCollapseDisplay: !expand,
    });

    return (
      <div styleName="bet-slip">
        <div styleName={styles}>
          <div styleName="top">
            <div styleName="header" onClick={() => this.expandClick()}>
              <div styleName="total">
                <div>
                  <Typography variant={"x-small-body"} color={"fixedwhite"}>
                    {betSlip !== null && betSlip.length > 0
                      ? betSlip.length
                      : 0}
                  </Typography>
                </div>
              </div>
              <div styleName="icon">
                <BetsIcon />
              </div>
            </div>
          </div>
          <div styleName="bets">
            <BetSlip onHandleLoginOrRegister={onHandleLoginOrRegister} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language,
    betSlip: state.betSlip,
  };
}

export default connect(mapStateToProps)(BetSlipFloat);
