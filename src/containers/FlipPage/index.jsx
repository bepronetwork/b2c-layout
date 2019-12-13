import React, { Component } from "react";
import propTypes from "prop-types";
import { FlipGameCard, FlipGameOptions } from "components";
import GamePage from "containers/GamePage";
import UserContext from "containers/App/UserContext";
import coinFlipBet from "lib/api/coinFlip";
import Cache from "../../lib/cache/cache";
import { find } from "lodash";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import { setWonPopupMessageDispatcher } from "../../lib/redux";

const defaultState = {
    edge : 0,
    flipResult: null,
    hasWon: null,
    game_name : 'CoinFlip',
    isCoinSpinning : false,
    game : {
        edge : 0
    }
}


class FlipPage extends Component {
    static contextType = UserContext;

    static propTypes = {
        onHandleLoginOrRegister: propTypes.func.isRequired
    };

    constructor(props){
        super(props);
        this.state = defaultState;
    }

    componentDidMount(){
        this.getGame()
    }

    handleAnimationEnd = () => {
        this.setState({ isCoinSpinning: false }, () => {
            this.handleUpdateBalance();
        });
    };

    handleAnimationStart = () => {
        this.setState({ isCoinSpinning: true });
    };

    handleUpdateBalance = async () => {
        const { profile } = this.props;
        const { result, hasWon, winAmount } = this.state.betObjectResult;
        setWonPopupMessageDispatcher(winAmount);
        await profile.getBalanceData();
        this.addToHistory({result : `${result} `, won : hasWon})
    };

    handleEnableControls = () => {
        this.setState({ disableControls: false, flipResult: null });
    };

    addToHistory = ({result, won}) => {
        let history = Cache.getFromCache("flipHistory");
        history = history ? history : [];
        history.unshift({ value: result, win : won });
        Cache.setToCache("flipHistory", history);
    }

    onBet = async form => {
        this.setState({onBet : true})
        let res = await this.handleBet(form);
        this.setState({onBet : false});
        return res;
    }

    handleBet = async ({amount, side}) => {
        try{
            const { user } = this.context;
            const { onHandleLoginOrRegister } = this.props;

            if (!user) return onHandleLoginOrRegister("register");

            const res = await coinFlipBet({
                betAmount : amount,
                side,
                user
            });

            const { result, hasWon } = res;

            this.setState({
                flipResult : result,
                betObjectResult  :res,
                hasWon,
                isCoinSpinning : true,
                disableControls: false
            });

            

            return res;
        }catch(err){
            return this.setState({
                flipResult : 0,
                hasWon : false,
                disableControls: false
            });
        }
    };

    getOptions = () => {
        const { disableControls } = this.state;
        const { profile } = this.props;

        return (
            <FlipGameOptions
                onBet={this.onBet}
                profile={profile}
                game={this.state.game}
                onBetTrigger={this.state.onBet}
                isCoinSpinning={this.state.isCoinSpinning}
                disableControls={disableControls}
            />
        );
    };

    getGameCard = () => {
        const { flipResult, hasWon } = this.state;
        const { profile } = this.props;

        return (
            <FlipGameCard
                updateBalance={this.handleUpdateBalance}
                flipResult={flipResult}
                profile={profile}
                onBetTrigger={this.state.onBet}
                handleAnimationEnd={this.handleAnimationEnd}
                handleAnimationStart={this.handleAnimationStart}
                isCoinSpinning={this.state.isCoinSpinning}
                game={this.state.game}
                hasWon={hasWon}
                onResult={this.handleEnableControls}
            />
        );
    };

    getGame = () => {
        const appInfo = Cache.getFromCache("appInfo");
        if(appInfo){
            let game = find(appInfo.games, { name: this.state.game_name });
            this.setState({...this.state, game});
        }
    };


    render() {
        return (
            <GamePage
                options={this.getOptions()}
                game={this.getGameCard()}
                history="flipHistory"
                gameMetaName={this.state.game.metaName}
            />
        );
    }
}


function mapStateToProps(state){
    return {
        profile: state.profile,
        ln : state.language
    };
}

export default compose(connect(mapStateToProps))(FlipPage);

