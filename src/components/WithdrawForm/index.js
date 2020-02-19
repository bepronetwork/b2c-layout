import React, { Component } from 'react';
import './index.css';
import store from 'containers/App/store';
import { connect } from "react-redux";
import approval from 'assets/approval.png';
import { ActionBox } from 'components';
import { setWithdrawInfo } from "../../redux/actions/withdraw";
import { setMessageNotification } from '../../redux/actions/message';
import { CopyText } from '../../copy';

const THIRTY_SECONDS = 60;

class WithdrawForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wasRegistered : false,
            onLoading : {
                wasRegistered : false,
            },
            updated : false,
        };
        
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    setWithdrawInfoInRedux = async ({id}) => {
        await store.dispatch(setWithdrawInfo({key : 'id', value : id}));
    }
    
    projectData = async (props) => {
        const { profile, withdraw } = props;
        this.setState({...this.state, 
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
            const { isAffiliate, currency } = withdraw;
            var res;
            if(isAffiliate){
                /* Create Withdraw Framework */
                res = await profile.askForWithdrawAffiliate({amount : parseFloat(withdraw.amount), currency, address : withdraw.toAddress});
            }else{
                /* Create Withdraw Framework */
                res = await profile.askForWithdraw({amount : parseFloat(withdraw.amount), currency, address : withdraw.toAddress});
            }

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

    render() {
        const { onLoading, updated, wasRegistered } = this.state;
        const {ln} = this.props;
const copy = CopyText.withdrawFormIndex[ln];
        return (
            <div>
                <ActionBox 
                    onClick={this.askForWithdraw}
                    onLoading={onLoading.wasRegistered}
                    disabled={!updated || wasRegistered}
                    loadingMessage={'Withdraw'}
                    completed={wasRegistered} id={'allowance'} image={approval} title={copy.INDEX.ACTION_BOX.TITLE[0]} description={copy.INDEX.ACTION_BOX.DESCRIPTION[0]}
                />
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
