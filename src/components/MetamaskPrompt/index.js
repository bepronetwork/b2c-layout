import React, { Component } from "react";
// eslint-disable-next-line import/no-cycle
import "./index.css";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import { promptMetamask } from 'lib/metamask';
import metamask from 'assets/metamask.png';
import { Typography } from 'components';
import { getMetamaskAccount } from "../../lib/metamask";


class MetamaskForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            hasMetamask : true
        }
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }
    
    async projectData(props){
        try{
            await promptMetamask();
            let account = await getMetamaskAccount()
            let hasMetamask = account ? true : false;
            this.setState({...this.state, hasMetamask})
        }catch(err){
            this.setState({...this.state, hasMetamask : false})
            // Metamask is Closed or not Installed
        }
    }

    render() {
        const { hasMetamask } = this.state;
        if(hasMetamask){return null}
        return (
            <div styleName='metamask-modal-layer'>
                <img src={metamask} styleName='metamask-logo'/>
                <div styleName='metamask-text'>
                    <Typography variant={'body'} color={'white'}>
                        Please Open or Install Metamask for your Browser
                    </Typography>
                </div> 
            </div>
        );
    }
}



function mapStateToProps(state){
    return {
        deposit : state.deposit,
        profile : state.profile,
        ln : state.language
    };
}

export default compose(connect(mapStateToProps))(MetamaskForm);
