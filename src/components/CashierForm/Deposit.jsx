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
import DepositsTable from "./Deposit/DepositsTable";
import { Col, Row } from 'reactstrap';
import InformationIcon from 'mdi-react/InformationIcon';
import InformationContainer from "../Information/InformationIcon";
import { setMessageNotification } from "../../redux/actions/message";

const defaultProps = {
    amount : 10,
    ticker : 'DAI',
    isAddressValid : true,
    deposits : []
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
            ticker : user.getAppCurrencyTicker(),    
            isAddressValid
        })
    }

    depositTokens = async () => {
        /*Check if max deposit is exceeded */
        const { ln } = this.props;
        const copy = CopyText.Deposit;
        let max = await this.context.user.getMaxDeposit();
        if(this.state.amount >= max) {
            return await store.dispatch(setMessageNotification(`${copy[ln].ERROR.FIRST} ${Math.round(max)} ${this.state.ticker}`))
        }

        try{
            const user = this.props.profile;
            this.setState({...this.state, onDeposit : 'processing'});
            /* Create Deposit Framework */
            let res = await user.createDeposit({amount : Numbers.toFloat(this.state.amount)});
            let { message, status } = res.data;
            if(status != 200){throw message};
            /* Update user Data */
            await user.getAllData();
            this.setState({...this.state, onDeposit : 'completed'});
        }catch(err){
            console.log(err)
            this.setState({...this.state, onDeposit : 'failure'});
        }

    }

    confirmDeposit = async (deposit) => {
        try{
            const user = this.props.profile;
            /* Create Deposit Framework */
            this.setState({...this.state, onDeposit : 'processing'});
            let res = await user.confirmDeposit(deposit);
            let { message, status } = res.data;
            if(status != 200){throw message};
            /* Update user Data */
            /* Update user Data */
            await user.getAllData();            
            this.setState({...this.state, onDeposit : 'completed'});
        }catch(err){
            this.setState({...this.state, onDeposit : 'failure'});
            console.log(err)
        }
    }

    render() {
        const { amount, onDeposit, isAddressValid } = this.state;
        const { ln } = this.props;
        const copy = CopyText.Deposit;
        return (
            <div>
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
                                <Row>
                                    <Col md={4}>
                                        <div style={{marginBottom : 20}}>
                                            <Typography color="white" variant="small-body"> {`You don´t have ${this.state.ticker} Tokens?`} </Typography>
                                            <div style={{marginTop : 20}}>

                                                <a
                                                    href="https://uniswap.exchange/swap"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Button
                                                        name="deposit"
                                                        theme="default"
                                                        variant="small-body"
                                                    >
                                                
                                                        <Typography color="white" variant="small-body"> {`Exchange Here`} </Typography>
                                                    </Button>
                                                </a>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={8}>
                                        <div style={{marginBottom : 20}}>
                                            <Row>
                                                <Col md={10}>
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
                                                    <div style={{marginTop : 20}}>
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
                                                </Col>
                                                <Col md={2}>
                                                    <div style={{marginTop : 20}}>
                                                        <InformationContainer title={'If the Button is disabled either the address on Metamask is not the used in your register or you don´t have enough tokens to deposit'} 
                                                            icon={<InformationIcon styleName={'icon-white'}  size={20}/>}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                              
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
                
                <Col md={12}>  
                    <div styleName="deposit">
                        <div styleName='withdraws-table'>
                            <DepositsTable
                                user={this.props.profile}
                                ln={this.props.ln}
                                confirmDeposit={this.confirmDeposit} 
                                currency={this.props.profile.getAppCurrencyTicker()} data={this.state.deposits}
                            />
                        </div>
                    </div>
                </Col>
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
