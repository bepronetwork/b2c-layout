import React, { Component } from "react";
import { Typography, ActionBox, Checkbox, ToggleForm } from 'components';
import { connect } from "react-redux";
import store from "../../containers/App/store";
import { setModal } from "../../redux/actions/modal";
import { set2FA } from "../../redux/actions/set2FA";
import _ from 'lodash';
import "./index.css";
import Cache from "../../lib/cache/cache";
import { CopyText } from '../../copy';

class SettingsTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
           
        };
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

   
    projectData = async (props) => {
        const { profile, set2FA } = props;
        let { isActive } = set2FA;
        let cacheCustomization = Cache.getFromCache('customization');
        let has2FA = profile.user.hasOwnProperty('security') ? profile.user.security.hasOwnProperty('2fa_set') ? profile.user.security['2fa_set'] : false : false;

        this.setState({...this.state, ...cacheCustomization, has2FA : has2FA || isActive})
    }

    handleBackgroundMusicToggle = async () => {
        const { profile } = this.props;
        Cache.handleCustomizationToggleBinary({objectName : 'customization', key : 'backgroundMusic'});
        await profile.updateUserState();
        this.projectData(this.props);
    }

    handle2FAAuthenticationToggle = async () => {
        const { has2FA } = this.state;

        if (has2FA) {
            this.setState({ has2FA : false });
            await store.dispatch(set2FA({isActive : false}));
        }
        else {
            await store.dispatch(setModal({key : 'Authentication2FAModal', value : true}))
        }
    }

    render() {
        const { backgroundMusic, has2FA } = this.state;
        const {ln} = this.props;
        const copy = CopyText.settingsTabIndex[ln];
        return (
            <div>
                <ToggleForm onClick={this.handleBackgroundMusicToggle} title={copy.INDEX.TOGGLE_FORM.TITLE[0]} isSet={backgroundMusic} id={'background-music'}/>
                <ToggleForm onClick={this.handle2FAAuthenticationToggle} title={copy.INDEX.TOGGLE_FORM.TITLE[1]} isSet={has2FA} id={'2fa-authentication'}/>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile,
        set2FA : state.set2FA,
        ln: state.language
    };
}

export default connect(mapStateToProps)(SettingsTab);
