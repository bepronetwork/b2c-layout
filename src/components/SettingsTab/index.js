import React, { Component } from "react";
import { Typography, ActionBox, Checkbox, ToggleForm } from 'components';
import { connect } from "react-redux";
import _ from 'lodash';
import "./index.css";
import Cache from "../../lib/cache/cache";

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
        let cacheCustomization = Cache.getFromCache('customization');
        this.setState({...this.state, ...cacheCustomization})
    }

    handleBackgroundMusicToggle = async () => {
        const { profile } = this.props;
        Cache.handleCustomizationToggleBinary({objectName : 'customization', key : 'backgroundMusic'});
        await profile.updateUserState();
        this.projectData(this.props);
    }
    

    render() {
        const { backgroundMusic } = this.state;
        return (
            <div>
                <ToggleForm onClick={this.handleBackgroundMusicToggle} title={'Background Music'} isSet={backgroundMusic} id={'background-music'}/>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile
    };
}

export default connect(mapStateToProps)(SettingsTab);
