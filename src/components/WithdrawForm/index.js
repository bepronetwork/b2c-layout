import React, { Component } from 'react';
import './index.css';
import { Numbers } from 'lib/ethereum/lib';
import store from 'containers/App/store';
import { connect } from "react-redux";
import approval from 'assets/approval.png';
import withdraw from 'assets/withdraw.png';
import { ActionBox } from 'components';
import { setWithdrawInfo } from "../../redux/actions/withdraw";
import { fromSmartContractTimeToMinutes } from '../../lib/helpers';

const THIRTY_SECONDS = 60;

class WithdrawForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasAllowed : false,
            hasWithdrawed : false,
            onLoading : {
                hasAllowed : false,
                hasWithdrawed : false
            },
            updated : false,
            timeForWithdraw : 0
        };
        
    }

    componentDidMount(){
        setInterval(() => {
            // Get Info on Withdraw
            this.projectData(this.props);
        }, 1*1000);
        this.projectData(this.props)
    }


    setWithdrawInfoInRedux = async ({id}) => {
        await store.dispatch(setWithdrawInfo({key : 'id', value : id}));
    }

    projectData = async (props) => {
        const { profile, withdraw } = props;
        let allowedAmount = await profile.getApprovedWithdrawAsync();
        let openWithdraw = await profile.getOneNotConfirmedWithdrawForAmountAsync({amount : withdraw.amount});
        if(openWithdraw && !withdraw.id && openWithdraw._id){
            this.setWithdrawInfoInRedux({id : openWithdraw._id})
        };
        let timeForWithdraw = (await profile.getTimeForWithdrawalAsync())+THIRTY_SECONDS;
        let hasAllowed = (Numbers.toFloat(allowedAmount) >= Numbers.toFloat(withdraw.amount));
        let hasWithdrawed = (withdraw.tx != '' && withdraw.tx != null);
       
        this.setState({...this.state, 
            hasAllowed,
            hasWithdrawed,
            timeForWithdraw,
            updated : true
        })
    }

    onLoading = (key, on=true) => {
        /* Set Loading */
        this.setState({...this.state,  onLoading : {...this.state.onLoading, [key] : on}});
    }

    askForWithdraw = async () => {
        try{
            this.onLoading('hasAllowed');
            const { withdraw, profile } = this.props;
            /* Create Withdraw Framework */
            let res = await profile.askForWithdraw({amount : Numbers.toFloat(withdraw.amount)});
            await this.setWithdrawInfoInRedux({id : res.withdraw._id});
            if(!res){throw new Error("Error on Transaction")};
        }catch(err){
            this.onLoading('hasAllowed', false);
        }
    }

    withdrawTokens = async () => {
        try{
            this.onLoading('hasWithdrawed');
            const { withdraw, profile } = this.props;
            /* Create Withdraw Framework */
            let res = await profile.createWithdraw({amount : Numbers.toFloat(withdraw.amount)});
            if(!res){throw new Error("Error on Transaction")};
            /* Set Transaction */
            await store.dispatch(setWithdrawInfo({key : 'tx', value : res.transactionHash}));
            this.setState({...this.state, hasWithdrawed : true})
            this.onLoading('hasWithdrawed', false);
        }catch(err){
            console.log(err)
            this.onLoading('hasWithdrawed', false);
        }
    }

    render() {
        const { hasAllowed, hasWithdrawed, onLoading, updated, timeForWithdraw } = this.state;

        const canWithdraw = (!updated || !hasAllowed || (timeForWithdraw >= 0));
        
        return (
            <div>
                <ActionBox 
                    onClick={this.askForWithdraw}
                    onLoading={onLoading.hasAllowed && !hasAllowed && !hasWithdrawed}
                    disabled={!updated || hasAllowed}
                    loadingMessage={'A Croupier is giving you allowance, just wait'}
                    completed={hasAllowed || hasWithdrawed} id={'allowance'} image={approval} title={'Ask for Withdraw'} description={'A croupier is giving you approval, should take a less than a minute'}
                />
                <ActionBox 
                    alertMessage={`Waiting Time For Withdraw ${fromSmartContractTimeToMinutes(timeForWithdraw)} m`} 
                    alertCondition={updated && (timeForWithdraw >= 0)}
                    onClick={this.withdrawTokens}
                    onLoading={onLoading.hasWithdrawed}
                    disabled={canWithdraw}
                    loadingMessage={'Metamask should prompt, click on it and Approve the Transfer'}
                    completed={hasWithdrawed} id={'withdraw'} image={withdraw} title={'Withdraw'} description={'After the timing is completed, click to withdraw'}
                />
                {/* <ProgressBar/> */}
            </div>
        );
    }
}


function mapStateToProps(state){
    return {
        withdraw : state.withdraw,
        profile : state.profile,
        ln : state.language
    };
}

export default connect(mapStateToProps)(WithdrawForm);
