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

const defaultProps = {
    amount : 10,
    ticker : 'DAI'
}

const const_text = {
    'processing'    : "",
    'completed'     : 'Deposit Completed with Success'
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
        this.setState({...this.state, 
            tokenAmount : decentralizedTokenAmount,
            ticker : 'DAI',    
        })
    }

    depositTokens = async () => {
        try{
            const { user, setUser } = this.context;
            this.setState({...this.state, onDeposit : 'processing'});
            /* Create Deposit Framework */
            await user.createDeposit({amount : Numbers.toFloat(this.state.amount)});
            /* Update user Data */
            
            await updateUserBalance(user, setUser);
            this.setState({...this.state, onDeposit : 'completed'});
        }catch(err){
            console.log(err)
            this.setState({...this.state, onDeposit : 'failure'});
        }
    }

    render() {
        const { amount, onDeposit } = this.state;
        return (
            <div styleName="deposit">
                <div styleName="title">
              
                   { (this.state.tokenAmount > 0) ? 
                        <div>
                            <Typography variant="body" color="white">
                                You have <strong style={{color : 'green'}}>{Numbers.toFloat(this.state.tokenAmount)} {this.state.ticker}</strong> 
                            </Typography>
                            <div style={{marginTop : 20}}>
                                <Typography variant="small-body" color="casper" >
                                    Tokens in Your Decentralized Wallet Available to Deposit
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
                                Click to Trade your ETH or Tokens to <strong style={{color : 'green'}}>{this.state.ticker}</strong>
                            </Typography>
                            <div style={{marginTop : 20}}>
                                <Typography variant="small-body" color="casper">
                                    You have currently 0  {this.state.ticker} Tokens
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
                            disabled={amount <= 0 || onDeposit}
                            name="deposit"
                            theme="primary"
                            variant="small-body"
                            onClick={this.depositTokens}
                            >
                            
                                <Typography>Deposit</Typography>
                            </Button>
                        </div>
                    ) : null}
                    {onDeposit === ("processing") ? 
                        <div>
                            <Typography color="white" variant="body">
                               Don´t close the Window!<br></br>There are 2 Actions Taking Place <br></br> 1 - Allowing Deposit <br></br>2- Creating Deposit
                            </Typography>
                            <div style={{marginTop : 30}}>
                                <Loader />
                            </div>
                        </div>
                   : null}
                    {onDeposit === "completed" ? (
                        <Typography color="green" variant="body">
                            {const_text[this.state.onDeposit]}
                        </Typography>
                    ) : null}
                </div>
            </div>
        );
    }
}



function mapStateToProps(state){
    return {
        profile: state.profile,
    };
}

export default compose(connect(mapStateToProps))(Deposit);
