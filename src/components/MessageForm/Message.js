import React, { Component } from "react";
// eslint-disable-next-line import/no-cycle
import PropTypes from "prop-types";
import { Typography, Button, Modal } from "components";
import UserContext from "containers/App/UserContext";
import "./index.css";
import { connect } from "react-redux";
import { setMessageNotification, SET_MESSAGE_INFO } from "../../redux/actions/message";
import { compose } from 'lodash/fp'
import _ from 'lodash';

class Message extends Component {

    static contextType = UserContext;

    static propTypes = {
        user: PropTypes.shape({})
    };

    state = {  };
    
    closeWindow = async () => {
        await this.props.dispatch(setMessageNotification(null));
    }

    render() {
        return (
            !_.isEmpty(this.props.message) ? 
                <Modal>
                    <div styleName="root">
                        <div styleName="title">
                                <Typography variant="h4" color="white">
                                    {this.props.message}
                                </Typography>
                        
                            <div styleName="button">
                                <Button
                                    name="close"
                                    theme="primary"
                                    variant="small-body"
                                    onClick={this.closeWindow}
                                >
                                    <Typography>Close</Typography>
                                </Button>
                            </div>
                        </div> 
                    </div>
                </Modal>
            : null
        );
    }
}



function mapStateToProps(state){
    return {
        profile: state.profile,
        message : state.message
    };
}

Message.propTypes = {
    dispatch: PropTypes.func
};

export default compose(connect(mapStateToProps))(Message);
