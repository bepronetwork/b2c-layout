import React from "react";
import { connect } from "react-redux";
import { Typography } from "components";
import { Row, Col } from 'reactstrap';
import { AddressConcat } from "../../lib/ethereum/lib";
import ExitToAppIcon from "mdi-react/ExitToAppIcon";
import Avatar, { Cache, ConfigProvider } from 'react-avatar';
import './index.css';
import { isUserSet } from "../../lib/helpers";

const defaultState = {
    address : '',
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
        const address = profile.getAddress();
        const avatar = null;

        this.setState({...this.state,
            id,
            username,
            address,
            avatar
        })
    }

    render(){
        const { 
            id, address, username, avatar
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
                <div styleName='address-box'>
                    <Row>
                        <Col sm={3}>
                            <ExitToAppIcon color={'white'} size={20}/>
                        </Col>
                        <Col sm={9}>
                            <Typography variant={'small-body'} color={'white'}>
                                {AddressConcat(address)}
                            </Typography>
                            <Typography variant={'x-small-body'} color={'grey'}>
                                Address
                            </Typography>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        profile : state.profile
    };
}

export default connect(mapStateToProps)(AccountInfoForm);
