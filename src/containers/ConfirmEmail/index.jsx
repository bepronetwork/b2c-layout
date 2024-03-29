import React, { Component } from "react";
import { connect } from "react-redux";
import { Typography, EmailIcon } from "components";
import { CopyText } from '../../copy';
import { confirmEmail } from "../../lib/api/users";
import { getIcon } from "../../lib/helpers";
import "./index.css";
import _ from "lodash";

class ConfirmEmail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            confirmed : false,
            confirmedMessage : false
        }
    }

    componentDidMount = () => {
        const { params } = this.props;

        if(params) {
            this.confirmEmail();
        }
    };

    confirmEmail = async () => {
        const { params, ln } = this.props;
        const copy = CopyText.homepage[ln];

        try{
            let res = await confirmEmail(params.app, params.token);
            let { message, status } = res;

            if(status != 200){
                this.setState({ confirmed : false, confirmedMessage : message });
                throw message
            };
                 
            this.setState({ confirmed : true, confirmedMessage : copy.CONTAINERS.APP.NOTIFICATION[1] });

        } catch(err){
            console.log(err);
        }

    };


    render() {
        const { confirmedMessage } = this.state;
        const { params } = this.props;

        if(!params) return null;

        const emailIcon = getIcon(11);

        return (
            <div styleName="root">
                <div styleName="container">
                    <div styleName='container-small'>                       
                        <div className='row' style={{margin : 0}}>
                            <div styleName="box">
                                <div styleName="confirm-title">
                                    <div styleName="confirm-left">
                                        {emailIcon === null ? <EmailIcon/> : <img src={emailIcon} />}
                                    </div>
                                    <div styleName="confirm-right">
                                        <Typography color="white" variant="small-body">
                                            {confirmedMessage}
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile,
        ln : state.language
    };
}

export default connect(mapStateToProps)(ConfirmEmail);
