import React from "react";
import { connect } from "react-redux";
import { Typography, Button, Toggle, EmailIcon } from "components";
import { set2FA } from "../../redux/actions/set2FA";
import { setModal } from "../../redux/actions/modal";
import { CopyText } from '../../copy';
import store from "../../containers/App/store";
import { setMessageNotification } from "../../redux/actions/message";
import { getIcon, getAppCustomization } from "../../lib/helpers";
import './index.css';

const defaultState = {
    isConfirmationSent : false
}

class SecurityTab extends React.Component{
    constructor(props){
        super(props);
        this.state = defaultState;
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    UNSAFE_componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = (props) => {
        const { profile, set2FA } = props;
        let { isActive } = set2FA;
        let has2FA = profile.user.hasOwnProperty('security') ? profile.user.security.hasOwnProperty('2fa_set') ? profile.user.security['2fa_set'] : false : false;

        this.setState({has2FA : has2FA || isActive})
    }


    handle2FAAuthenticationToggle = async () => {
        const { has2FA } = this.state;

        if (has2FA) {
            await store.dispatch(set2FA({isActive : false}));
        }
        else {
            await store.dispatch(setModal({key : 'Authentication2FAModal', value : true}))
        }

        this.setState({ has2FA : !has2FA });
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
        const { profile, ln } = this.props;
        const { isConfirmationSent, has2FA } = this.state;
        const copy = CopyText.settingsTabIndex[ln];
        const copyConfirmEmail = CopyText.homepage[ln];
        const emailIcon = getIcon(11);
        const { skin } = getAppCustomization();

        return (
            <div styleName='box'>
                <div styleName="field">
                    <div styleName='label'>
                        <Typography variant={'small-body'} color={'white'}>{copy.INDEX.TOGGLE_FORM.TITLE[1]}</Typography>
                    </div>
                    <div styleName='value'>
                        <Toggle id={'2fa-authentication'} checked={has2FA} onChange={() => this.handle2FAAuthenticationToggle()} />
                    </div>
                </div>
                {profile.user.email_confirmed === false ?
                    <div styleName="field">
                        <div styleName='label'>
                            <Typography variant={'small-body'} color={'white'}>{copyConfirmEmail.CONTAINERS.APP.MODAL[2]}</Typography>
                        </div>
                        <div styleName='value'>
                            <Button size={'x-small'} theme={'action'} disabled={isConfirmationSent} onClick={this.handleResendConfirmEmail} icon={emailIcon === null ? <EmailIcon/> : <img src={emailIcon} alt="Email" />}>
                                <Typography variant={'small-body'} color={skin.skin_type == "digital" ? 'secondary' : 'fixedwhite'}>{copyConfirmEmail.CONTAINERS.APP.MODAL[2]}</Typography>
                            </Button>
                        </div>
                    </div>
                    :
                    <div styleName="field">
                        <div styleName='label'>
                            <Typography variant={'small-body'} color={'white'}>{copyConfirmEmail.CONTAINERS.APP.MODAL[2]}</Typography>
                        </div>
                        <div styleName='value'>
                            <Toggle id={'confirm-email'} checked={true} disabled={true} />
                        </div>
                    </div>
                }
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        profile : state.profile,
        set2FA : state.set2FA,
        ln: state.language
    };
}

export default connect(mapStateToProps)(SecurityTab);
