import React, { Component } from "react";
// eslint-disable-next-line import/no-cycle
import { Typography, Button, InputNumber } from "components";
import UserContext from "containers/App/UserContext";
import Loader from "./Loader";
import { updateUserBalance } from 'lib/api/users';
import "./index.css";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import { Numbers } from "../../lib/ethereum/lib";
import { CopyText } from "../../copy";
import store from "../../containers/App/store";
import { setDepositOrWithdrawResult } from "../../redux/actions/depositOrWithdraw";

const defaultProps = {
    amount : 10,
    ticker : 'DAI',
    isAddressValid : true
}

class Deposit extends Component {
    static contextType = UserContext;

    state = { ...defaultProps };

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }
    
    projectData = async (props) => {
        let user = props.profile;
        let decentralizedTokenAmount = await user.getTokenAmount();
        const isAddressValid = await user.isValidAddress();

        this.setState({...this.state, 
            tokenAmount : decentralizedTokenAmount,
            ticker : 'DAI',    
            isAddressValid
        })
    }

    depositTokens = async () => {
        try{
            const { user, setUser } = this.context;
            this.setState({...this.state, onDeposit : 'processing'});
            /* Create Deposit Framework */
            let res = await user.createDeposit({amount : Numbers.toFloat(this.state.amount)});
            let { message } = res.data;
            console.log(message);
            await store.dispatch(setDepositOrWithdrawResult(message));
            /* Update user Data */
            await updateUserBalance(user, setUser);
            this.setState({...this.state, onDeposit : 'completed'});
        }catch(err){
            console.log(err)
            this.setState({...this.state, onDeposit : 'failure'});
        }
    }

    render() {
        const { amount, onDeposit, isAddressValid } = this.state;
        const { ln } = this.props;
        const copy = CopyText.Deposit;

        return (
            <div styleName="deposit">
                <div styleName="title">
              
                   { (this.state.tokenAmount > 0) ? 
                        <div>
                            <Typography variant="body" color="white">
                                {copy[ln].TITLE} <strong style={{color : 'green'}}>{Numbers.toFloat(this.state.tokenAmount)} {this.state.ticker}</strong> 
                            </Typography>
                            <div style={{marginTop : 20}}>
                                <Typography variant="small-body" color="casper" >
                                    {copy[ln].SUB_TITLE.FIRST}
                                </Typography>
                            </div>
                        </div>
                    : 
                        <a
                            href="https://uniswap.exchange/swap"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Typography variant="body" color="white">
                                {copy[ln].SUB_TITLE.SECOND} <strong style={{color : 'green'}}>{this.state.ticker}</strong>
                            </Typography>
                            <div style={{marginTop : 20}}>
                                <Typography variant="small-body" color="casper">
                                    {copy[ln].SUB_TITLE.THIRD.FIRST}  {this.state.ticker}  {copy[ln].SUB_TITLE.THIRD.SECOND} 
                                </Typography>
                            </div>
                        </a>
                    }
                </div>
                <div styleName="button">
                    {!onDeposit ? (
                        <div>
                            <div style={{marginBottom : 20}}>
                                <InputNumber
                                    name="amount"
                                    min={0.01}
                                    max={1000}
                                    precision={2}
                                    title="Deposit Amount"
                                    onChange={(amount) => this.setState({...this.state, amount : amount})}
                                    icon="cross"
                                    value={this.state.amount}
                                />
                            </div>
                            <Button
                                disabled={amount <= 0 || onDeposit || !isAddressValid}
                                name="deposit"
                                theme="primary"
                                variant="small-body"
                                onClick={this.depositTokens}
                            >
                            
                                <Typography> {copy[ln].BUTTON_ONE} </Typography>
                            </Button>
                        </div>
                    ) : null}
                    {onDeposit === ("processing") ? 
                        <div>
                            <Typography color="white" variant="body">
                               {copy[ln].INFO.FIRST}<br></br>
                               {copy[ln].INFO.SECOND} <br></br> 
                               {copy[ln].INFO.THIRD} <br></br>
                               {copy[ln].INFO.FORTH}
                            </Typography>
                            <div style={{marginTop : 30}}>
                                <Loader />
                            </div>
                        </div>
                   : null}
                    {onDeposit === "completed" ? (
                        <Typography color="green" variant="body">
                            {copy[ln].INFO.FIFTH}
                        </Typography>
                    ) : null}
                </div>
            </div>
        );
    }
}



function mapStateToProps(state){
    return {
        profile : state.profile,
        ln : state.language
    };
}

export default compose(connect(mapStateToProps))(Deposit);
