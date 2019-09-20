import React from 'react';
import BackgroundMusic from './BackgroundMusic';
import './index.css';
import Cache from '../../lib/cache/cache';
import { connect } from "react-redux";


class Widgets extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {}
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData(props){
        const { profile } = props;
        let cacheCustomization = Cache.getFromCache('customization');
        if(!cacheCustomization){
            cacheCustomization = {}
        };
        this.setState({...this.state, ...cacheCustomization});
    }

    
    // This sound file may not work due to cross-origin setting
    render () {
        const { backgroundMusic } = this.state;
        return (
            <div>
                <BackgroundMusic mute={!backgroundMusic}/>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile
    };
}

export default connect(mapStateToProps)(Widgets);
