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
import { setModal } from '../../redux/actions/modal';
import { setMessageNotification } from '../../redux/actions/message';
import { generatePseudoRandom256BitNumber } from '@0x/utils';

const THIRTY_SECONDS = 60;

class WithdrawForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //hasAllowed : false,
            //hasWithdrawed : false,
            wasRegistered : false,
            onLoading : {
                wasRegistered : false,
                //hasAllowed : false,
                //hasWithdrawed : false
            },
            updated : false,
            //timeForWithdraw : 0
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
        //let allowedAmount = await profile.getApprovedWithdrawAsync();
        //let openWithdraw = await profile.getOneNotConfirmedWithdrawForAmountAsync({amount : withdraw.amount});
        //if(openWithdraw && !withdraw.id && openWithdraw._id){
        //    this.setWithdrawInfoInRedux({id : openWithdraw._id})
        //};
        //let timeForWithdraw = (await profile.getTimeForWithdrawalAsync())+THIRTY_SECONDS;
        //let hasAllowed = (Numbers.toFloat(allowedAmount) >= Numbers.toFloat(withdraw.amount));
        //let hasWithdrawed = (withdraw.tx != '' && withdraw.tx != null);
       
        this.setState({...this.state, 
            //hasAllowed,
            //hasWithdrawed,
            //timeForWithdraw,
            updated : true
        })
    }

    onLoading = (key, on=true) => {
        /* Set Loading */
        this.setState({...this.state,  onLoading : {...this.state.onLoading, [key] : on}});
    }

    askForWithdraw = async () => {
        try{
            this.onLoading('wasRegistered');
            const { withdraw, profile, closeStepper } = this.props;
            const { isAffiliate } = withdraw;
            var res;
            if(isAffiliate){
                /* Create Withdraw Framework */
                res = await profile.askForWithdrawAffiliate({amount : Numbers.toFloat(withdraw.amount)});
            }else{
                /* Create Withdraw Framework */
                res = await profile.askForWithdraw({amount : Numbers.toFloat(withdraw.amount)});
            }

            console.log(res);
            await store.dispatch( setMessageNotification(
                'Withdraw was Queued, you can see it in the Withdraws Tab',                
            ));
           
            this.setState({...this.state, wasRegistered : true})
            await this.setWithdrawInfoInRedux({id : res.withdraw._id});
            closeStepper();
        }catch(err){
            console.log(err);
            this.onLoading('wasRegistered', false);
        }
    }
 
    /* withdrawTokens = async () => {
        try{
            this.onLoading('hasWithdrawed');
            const { withdraw, profile } = this.props;
            const { isAffiliate } = withdraw;
            let res = await profile.createWithdraw({amount : Numbers.toFloat(withdraw.amount)});
            if(!res){throw new Error("Error on Transaction")};
            await store.dispatch(setWithdrawInfo({key : 'tx', value : res.transactionHash}));
            if(isAffiliate){
                await store.dispatch(setModal({key : 'AffiliateWithdrawForm', value : false}));
            }
            await profile.getAllData();
            this.setState({...this.state, hasWithdrawed : true});
            setTimeout( () => {
                this.onLoading('hasWithdrawed', false);
            }, 1*1000)
        }catch(err){
            console.log(err)
            this.onLoading('hasWithdrawed', false);
        }
    }*/

    render() {
        const { /* hasAllowed, */ onLoading, updated, wasRegistered } = this.state;
        //const canWithdraw = (!updated || !hasAllowed || (timeForWithdraw >= 0));
        
        return (
            <div>
                <ActionBox 
                    onClick={this.askForWithdraw}
                    onLoading={onLoading.wasRegistered}
                    disabled={!updated || wasRegistered}
                    loadingMessage={'Withdraw to Your Registered Address'}
                    completed={wasRegistered} id={'allowance'} image={approval} title={'Ask for Withdraw'} description={'Your Withdraw shall be completed in a few hours'}
                />
                {/*
                    <ActionBox 
                        alertMessage={`Waiting Time For Withdraw ${fromSmartContractTimeToMinutes(timeForWithdraw)} m`} 
                        alertCondition={updated && (timeForWithdraw >= 0)}
                        onClick={this.withdrawTokens}
                        onLoading={onLoading.hasWithdrawed}
                        disabled={canWithdraw}
                        loadingMessage={'Metamask should prompt, click on it and Approve the Transfer'}
                        completed={hasWithdrawed} id={'withdraw'} image={withdraw} title={'Withdraw'} description={'After the timing is completed, click to withdraw'}
                    />
                */}
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
