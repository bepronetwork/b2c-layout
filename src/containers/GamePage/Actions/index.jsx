import React, { Component } from "react";
import { Tabs, Typography } from "components";
import { escapedNewLineToLineBreakTag } from "../../../utils/br";
import { connect } from "react-redux";
import { CopyText } from "../../../copy";
import _ from "lodash";
import "./index.css";

class Actions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: "rules",
    };
  }

  handleTabChange = (name) => {
    this.setState({ tab: name });
  };

  render() {
    const { game, currency, profile } = this.props;
    const { tab } = this.state;
    const { ln } = this.props;
    const copy = CopyText.homepagegame[ln];
    const rulesLabel = copy.RULES;
    const limitsLabel = copy.LIMITS;

    let tableLimit;
    if (profile && !_.isEmpty(profile)) {
      const gameWallet = game.wallets.find(
        (w) =>
          String(w.currency).toString() === String(currency._id).toString(),
      );
      tableLimit = gameWallet ? gameWallet.tableLimit : null;
    }

    return (
      <div styleName="root" style={{ overflowY: "auto", overflowX: "hidden" }}>
        <div>
          <Tabs
            selected={tab}
            onSelect={this.handleTabChange}
            options={[
              {
                value: "rules",
                label: rulesLabel,
              },
              {
                value: "limits",
                label: limitsLabel,
              },
            ]}
          />
        </div>
        {tab === "rules" ? (
          <div styleName="rule">
            <h1 styleName="rule-h1">
              <img styleName="image-icon" src={game.image_url} alt="Game" />
              <Typography variant="x-small-body" color={"grey"}>
                {" "}
                {game.name}{" "}
              </Typography>
            </h1>
            <div styleName="content">
              <Typography color={"grey"} variant={"small-body"}>
                {escapedNewLineToLineBreakTag(game.rules)}
              </Typography>
            </div>
          </div>
        ) : (
          <div styleName="rule">
            <h1 styleName="rule-h1">
              <Typography variant="body" color={"grey"}>
                {" "}
                {currency.ticker}{" "}
              </Typography>
            </h1>
            <div styleName="content">
              <span>
                <Typography color={"grey"} variant={"small-body"}>
                  Minimum : 0.01
                </Typography>
              </span>
              <span>
                <Typography color={"grey"} variant={"small-body"}>
                  Maximum : {tableLimit}
                </Typography>
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language,
    currency: state.currency,
  };
}

export default connect(mapStateToProps)(Actions);
