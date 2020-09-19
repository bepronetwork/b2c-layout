import React from "react";
import { connect } from "react-redux";
import { Typography, Button } from "components";
import { Cache } from 'react-avatar';
import { isUserSet, getAppCustomization } from "../../lib/helpers";
import { CopyText } from '../../copy';
import './index.css';

const defaultState = {
    username : '',
    email : ''
}
const cache = new Cache({
    // Keep cached source failures for up to 7 days
    sourceTTL: 7 * 24 * 3600 * 1000,
    // Keep a maximum of 20 entries in the source cache
    sourceSize: 20
});

class AccountTab extends React.Component{
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
        const email = profile.user.email ? profile.user.email : profile.user.user.email;
        const avatar = null;

        this.setState({...this.state,
            id,
            username,
            avatar,
            email
        })
    }

    render(){
        const { ln, onLogout } = this.props;
        const { username, email, id } = this.state;
        const copy = CopyText.registerFormIndex[ln];
        const copyLogout = CopyText.userMenuIndex[ln];
        const skin = getAppCustomization().skin.skin_type;

        return (
            <div styleName='box'>
                <div styleName="field">
                    <div styleName='label'>
                        <Typography variant={'small-body'} color={'white'}>{copy.INDEX.INPUT_TEXT.LABEL[4]}</Typography>
                    </div>
                    <div styleName='value'>
                        <Typography variant={'small-body'} color={'white'}>
                            {id}
                        </Typography>
                    </div>
                </div>
                <div styleName="field">
                    <div styleName='label'>
                        <Typography variant={'small-body'} color={'white'}>{copy.INDEX.INPUT_TEXT.LABEL[0]}</Typography>
                    </div>
                    <div styleName='value'>
                        <Typography variant={'small-body'} color={'white'}>
                            @{username}
                        </Typography>
                    </div>
                </div>
                <div styleName="field">
                    <div styleName='label'>
                        <Typography variant={'small-body'} color={'white'}>{copy.INDEX.INPUT_TEXT.LABEL[3]}</Typography>
                    </div>
                    <div styleName='value'>
                        <Typography variant={'small-body'} color={'white'}>
                            {email}
                        </Typography>
                    </div>
                </div>

                <div styleName='button' onClick={onLogout}>
                    <Button size={'x-small'} theme="primary">
                        <Typography color={skin == "digital" ? "secondary" : "fixedwhite"} variant={'small-body'}>{copyLogout.INDEX.TYPOGRAPHY.TEXT[2]}</Typography>
                    </Button>
                </div>
                <div styleName='button'>
                    <mati-button
                    clientid="5f5a66d8c067b5001b3bb617"
                    flowId="5f5a66d8c067b5001b3bb616"
                    metadata={{id: "5f663f67eff5fc001697da98"}}
                    />
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

export default connect(mapStateToProps)(AccountTab);
