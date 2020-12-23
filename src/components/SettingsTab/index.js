import React, { Component } from "react";
import { Typography, Toggle } from 'components';
import { connect } from "react-redux";
import Cache from "../../lib/cache/cache";
import { CopyText } from '../../copy';
import "./index.css";

class SettingsTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            backgroundMusic: null
        }
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    UNSAFE_componentWillReceiveProps(props){
        this.projectData(props);
    }

   
    projectData = async () => {
        let cacheCustomization = Cache.getFromCache('customization');

        this.setState({...cacheCustomization})
    }

    handleBackgroundMusicToggle = async () => {
        const { profile } = this.props;
        Cache.handleCustomizationToggleBinary({objectName : 'customization', key : 'backgroundMusic'});
        await profile.updateUserState();
        this.projectData(this.props);
    }

    render(){
        const { ln } = this.props;
        const { backgroundMusic } = this.state;
        const copy = CopyText.settingsTabIndex[ln];

        return (
            <div styleName='box'>
                <div styleName="field">
                    <div styleName='label'>
                        <Typography variant={'small-body'} color={'white'}>{copy.INDEX.TOGGLE_FORM.TITLE[0]}</Typography>
                    </div>
                    <div styleName='value'>
                        <Toggle id={'background-music'} checked={backgroundMusic} onChange={() => this.handleBackgroundMusicToggle()} />
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile,
        ln: state.language
    };
}

export default connect(mapStateToProps)(SettingsTab);
