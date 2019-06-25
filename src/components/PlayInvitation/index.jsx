import React, { Component } from "react";
import PropTypes from "prop-types";
import InvitationCards from "components/Icons/InvitationCards";
import { Button, Typography } from "components";
import config from "config";
import { map } from "lodash";
import { connect } from "react-redux";
import _ from 'lodash';
import "./index.css";
import invitation from 'assets/invitation.png';

class PlayInvitation extends Component {
  static propTypes = {
    onLoginRegister: PropTypes.func.isRequired
  };

  handleClick = () => {
    const { onLoginRegister, profile } = this.props;
    if (!_.isEmpty(profile)) {this.props.history.push('/roulette')}
    else if (onLoginRegister) onLoginRegister("register");
  };

  renderLabels = () => {
    return (
        <ul styleName="labels">
            {map(config.labels, label => {
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
        return (
                
            <div styleName="root">
                <div styleName="container">
                    <div styleName="invitation">
                        <img src={invitation} styleName='invitation-cards'/>
                        {/* <InvitationCards /> */}
                        <div styleName="play-button">
                            <Button onClick={this.handleClick} theme="primary">
                                {_.isEmpty(this.props.profile) ?
                                (
                                    <Typography weight="semi-bold" color="background-table-1-outer">
                                        Play Now
                                    </Typography>
                                ) :   
                                    <Typography weight="semi-bold" color="pickled-bluewood">
                                        Go!
                                    </Typography>
                                }
                            </Button>
                        </div>
                    </div>
                    <div styleName="labels-container">
                        <Typography weight="semi-bold" color="white" variant="h4">
                            {config.title}
                        </Typography>
                        {this.renderLabels()}
                    </div>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state){
    return {
        profile: state.profile,
    };
}

export default connect(mapStateToProps)(PlayInvitation);
