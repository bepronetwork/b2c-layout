import React from "react";
import { connect } from "react-redux";
import { Typography, Button } from "components";
import Avatar, { Cache } from 'react-avatar';
import { isUserSet } from "../../lib/helpers";
import { CopyText } from '../../copy';
import store from "../../containers/App/store";
import { setMessageNotification } from "../../redux/actions/message";
import './index.css';

const defaultState = {
    username : '',
    isConfirmationSent : false
}
const cache = new Cache({
    sourceTTL: 7 * 24 * 3600 * 1000,
    sourceSize: 20
});

class AccountInfoForm extends React.Component{
    constructor(props){
        super(props);
        this.state = defaultState;
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = (props) => {
        const { profile } = props;
        
        if(!isUserSet(profile)){return null}
        const id = profile.getID();
        const username = profile.getUsername();
        const avatar = null;

        this.setState({...this.state,
            id,
            username,
            avatar
        })
    }

    handleResendConfirmEmail = async () => {
        const { profile, ln } = this.props;
        const copy = CopyText.homepage[ln];

        try{
            this.setState({ isConfirmationSent : true });
            let res = await profile.resendConfirmEmail();
            let { message, status } = res.data;        

            if(status != 200){
                store.dispatch(setMessageNotification(message));
                throw message
            };

            store.dispatch(setMessageNotification(copy.CONTAINERS.APP.NOTIFICATION[2]));
            this.setState({ isConfirmationSent : false });

        } catch(err){
            console.log(err);
        }

    };

    render(){
        const { profile } = this.props;
        const { username, isConfirmationSent } = this.state;

        return (
            <div styleName='box-account'>
                <div styleName='avatar-user'>
                    <Avatar name={username} cache={cache} size="90"/>
                </div>
                <div styleName='username-box'>
                    <Typography variant={'body'} color={'white'}>
                        @{username}
                    </Typography>
                </div>
                {!profile.user.email_confirmed ?
                    <div styleName='confirm-email' onClick={this.handleResendConfirmEmail}>
                        <Button size={'x-small'} theme={'action'} disabled={isConfirmationSent}>
                            <Typography color={'white'} variant={'small-body'}>Confirm E-mail</Typography>
                        </Button>
                    </div>
                : 
                    null
                }
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        profile : state.profile,
        ln: state.language
    };
}

export default connect(mapStateToProps)(AccountInfoForm);
