import React, { Component } from "react";
import PropTypes from "prop-types";
import ArrowLeft from "components/Icons/ArrowLeft";
import ArrowRight from "components/Icons/ArrowRight";
import { Typography, BitcoinIcon, Dollar } from "components";
import UserContext from "containers/App/UserContext";
import { connect } from "react-redux";
import { Numbers } from "../../lib/ethereum/lib";
import Coin from "./CoinButton";
import "./index.css";
import { CopyText } from "../../copy";
import _ from 'lodash';

class ChipValue extends Component {
    static contextType = UserContext;

    static propTypes = {
        onChangeChip: PropTypes.func.isRequired,
        totalBet: PropTypes.number
    };

    static defaultProps = {
        totalBet: 0
    };

    state = {
        coin: 0.001,
        coinsPosition: 0,
        balance : 0
    };


    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }
    
    projectData = async (props) => {
        let user = props.profile;
        
        if(!user || _.isEmpty(user)){return null}

        let balance = parseFloat(user.getBalance());

        this.setState({...this.state, 
            balance : balance,
        })
    }

    handlerCoinRef = element => {
        this.coins = element;
    };

    handlerContainerRef = element => {
        this.container = element;
    };

    getDisabled = value => {
        const { user } = this.context;
        const { totalBet } = this.props;
        const balance = this.state.balance;
        return balance ? totalBet + value > balance : true;
    };

    handleArrow = side => {
        const { coinsPosition } = this.state;
        const width = this.coins.clientWidth;
        const maxWidth = this.container.clientWidth;
        const position =
        side === "right" ? coinsPosition - width : coinsPosition + width;

        let newP = position;

        if (side === "left") {
        newP = position <= 0 ? position : 0;
        } else {
        newP = position > -(maxWidth - 160) ? position : -(maxWidth - width);
        }

        this.setState({
        coinsPosition: newP
        });
    };

    handleCoin = value => {
        const { onChangeChip } = this.props;

        this.setState({ coin: value });

        onChangeChip(value);
    };

    render() {
        const { coin, coinsPosition } = this.state;
        const { ln } = this.props;
        const copy = CopyText.shared[ln];

        return (
        <div styleName="root">
            <div styleName="title">
            <Typography weight="semi-bold" variant="small-body" color="casper">
                {`${copy.CHIP_INFO}`}
            </Typography>
            </div>
            <div styleName="container">
            <button
                onClick={() => this.handleArrow("left")}
                type="button"
                styleName="arrow-container"
                name="left"
            >
                <ArrowLeft />
            </button>
            <div styleName="coins" ref={this.handlerCoinRef}>
                <div
                styleName="coins-container"
                style={{
                    marginLeft: `${coinsPosition}px`
                }}
                ref={this.handlerContainerRef}
                >
                <Coin
                    onSelect={this.handleCoin}
                    disabled={this.getDisabled(0.001)}
                    selected={coin === 0.001}
                    value={0.001}
                    label="0001"
                />
                <Coin
                    onSelect={this.handleCoin}
                    disabled={this.getDisabled(0.01)}
                    selected={coin === 0.01}
                    value={0.01}
                    label="001"
                />
                <Coin
                    onSelect={this.handleCoin}
                    disabled={this.getDisabled(0.1)}
                    selected={coin === 0.1}
                    value={0.1}
                    label="01"
                />
                <Coin
                    onSelect={this.handleCoin}
                    disabled={this.getDisabled(1)}
                    selected={coin === 1}
                    value={1}
                    label="1"
                />
                <Coin
                    onSelect={this.handleCoin}
                    disabled={this.getDisabled(10)}
                    selected={coin === 10}
                    value={10}
                    label="10"
                />
                <Coin
                    onSelect={this.handleCoin}
                    disabled={this.getDisabled(100)}
                    selected={coin === 100}
                    value={100}
                    label="100"
                />
                <Coin
                    onSelect={this.handleCoin}
                    disabled={this.getDisabled(1000)}
                    selected={coin === 1000}
                    value={1000}
                    label="1K"
                />
                <Coin
                    onSelect={this.handleCoin}
                    disabled={this.getDisabled(10000)}
                    selected={coin === 10000}
                    value={10000}
                    label="10K"
                />
                </div>
            </div>
            <button
                onClick={() => this.handleArrow("right")}
                type="button"
                styleName="arrow-container"
                name="right"
            >
                <ArrowRight />
            </button>
            </div>
        </div>
        );
    }
}


function mapStateToProps(state){
    return {
        ln : state.language,
        profile : state.profile,
        currency : state.currency
    };
}

export default connect(mapStateToProps)(ChipValue);
