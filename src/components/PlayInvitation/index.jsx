import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Typography } from "components";
import { map } from "lodash";
import { connect } from "react-redux";
import _ from "lodash";
import "./index.css";
import { Row, Col } from "reactstrap";
import { CopyText } from "../../copy";

class PlayInvitation extends Component {
  static propTypes = {
    onLoginRegister: PropTypes.func.isRequired,
  };

  handleClick = () => {
    const { onLoginRegister, profile } = this.props;
    if (!_.isEmpty(profile)) {
      this.props.history.push("/roulette");
    } else if (onLoginRegister) onLoginRegister("register");
  };

  renderLabels = (labels) => {
    return (
      <ul styleName="labels">
        {map(labels, (label) => {
          return (
            <li key={label}>
              <Typography weight="regular" color="casper">
                {label}
              </Typography>
            </li>
          );
        })}
      </ul>
    );
  };

  render() {
    const { ln } = this.props;
    const copy = CopyText.homepage[ln];

    return (
      <div styleName="root">
        <Row>
          <Col md={6}>
            <div styleName="invitation">
              {/* <InvitationCards /> */}
              <div styleName="play-button">
                <Button onClick={this.handleClick} theme="primary">
                  {_.isEmpty(this.props.profile) ? (
                    <Typography weight="semi-bold" color="white">
                      {copy.BUTTON_HOME.FIRST}
                    </Typography>
                  ) : (
                    <Typography weight="semi-bold" color="white">
                      {copy.BUTTON_HOME.SECOND}
                    </Typography>
                  )}
                </Button>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div styleName="labels-container">
              <div styleName="inner-text-container">
                <Typography weight="semi-bold" color="white" variant="h4">
                  {copy.TITLE}
                </Typography>
                {this.renderLabels(copy.LABELS)}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language,
  };
}

export default connect(mapStateToProps)(PlayInvitation);
