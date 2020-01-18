import React, { Component } from 'react';
import './index.css';
import { Numbers } from '../../lib/ethereum/lib';
import store from '../../containers/App/store';
import { connect } from "react-redux";
import { setDepositInfo } from '../../redux/actions/deposit';
import allow from 'assets/allow.png';
import deposit from 'assets/deposit.png';
import { ActionBox } from 'components';

class DepositForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasAllowed : false,
            hasDeposited : false,
            onLoading : {
                hasAllowed : false,
                hasDeposited : false
            },
            updated : false
        };
        
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    projectData = async (props) => {
        const { profile, deposit } = props;
        let hasDeposited = false;
        this.setState({...this.state, 
            hasDeposited ,
            updated : true
        })
    }

    onLoading = (key, on=true) => {
        /* Set Loading */
        this.setState({...this.state,  onLoading : {...this.state.onLoading, [key] : on}});
    }

    depositTokens = async () => {
        try{
            this.onLoading('hasDeposited');
            const { deposit, profile } = this.props;
            /* Create Deposit Framework */
            let res = await profile.sendTokens({amount : parseFloat(deposit.amount), currency : deposit.currency});
            if(!res){throw new Error("Error on Transaction")};
            await store.dispatch(setDepositInfo({key : 'tx', value : res.transactionHash}));
            this.setState({...this.state, isDeposited : true})
            this.onLoading('hasDeposited', false);
        }catch(err){
            this.onLoading('hasDeposited', false);
        }
    }

    render() {
        const { onLoading, isDeposited } = this.state;
        return (
            <div>
                <ActionBox 
                    onClick={this.depositTokens}
                    onLoading={onLoading.hasDeposited}
                    disabled={onLoading.hasDeposited}
                    loadingMessage={'Metamask should prompt, click on it and Approve the Transfer'}
                    completed={isDeposited} id={'deposit'} image={deposit} description={'Deposit your Currency'} title={'Deposit'}
                />
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

export default connect(mapStateToProps)(DepositForm);
