import React from "react";
import { connect } from "react-redux";
import { Typography } from "components";
import Avatar, { Cache } from 'react-avatar';
import { isUserSet } from "../../lib/helpers";
import './index.css';

const defaultState = {
    username : ''
}
const cache = new Cache({
    // Keep cached source failures for up to 7 days
    sourceTTL: 7 * 24 * 3600 * 1000,
    // Keep a maximum of 20 entries in the source cache
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

    render(){
        const { 
            username, avatar
        } = this.state;

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
