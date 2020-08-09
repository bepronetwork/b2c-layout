import React, { Component } from "react";
import { PlinkoGameCard, PlinkoGameOptions } from "components";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";
import GamePage from "containers/GamePage";
import plinkoBet from "lib/api/plinko";
import Cache from "../../lib/cache/cache";
import { setWonPopupMessageDispatcher } from "../../lib/redux";
import { find } from "lodash";
import { connect } from "react-redux";
import _ from "lodash";

class PlinkoPage extends Component {
    static contextType = UserContext;

    static propTypes = {
        onHandleLoginOrRegister: PropTypes.func.isRequired
    };

    state = {
        result: null,
        disableControls: false,
        bet : {},
        game_name : 'plinko_variation_1',
        animating : false,
        game : {
            edge : 0
        },
        amount: 0
    };
    
    triggerChildGameCard(result){
        this.refs.childGameCard._createParticle(result);
    }

    componentDidMount(){
        this.getGame();
    }

    getGame = () => {
        const appInfo = Cache.getFromCache("appInfo");
        if(appInfo){
            let game = find(appInfo.games, { metaName: this.state.game_name });
            this.setState({...this.state, game});
        }
    };

    handleBet = async ({ amount }) => {
        try{
            const { user } = this.context;
            const { onHandleLoginOrRegister } = this.props;
            this.setState({ disableControls: true });
            if (!user || _.isEmpty(user)) return onHandleLoginOrRegister("register");
 
            const res = await plinkoBet({
                betAmount: amount,
                user
            });
            this.triggerChildGameCard(res.result);
            this.setState({ 
                result : res.result, 
                disableControls : true, 
                isWon : res.isWon,
                bet : res,
                animating : true,
                betObjectResult : res,
                amount
            });
            
            return res;
        }catch(err){
            return this.setState({ result : 0, disableControls : false });

        }
    };

    addToHistory = () => {
        try {
            var { result, isWon, game } = this.state;
            let history = localStorage.getItem("plinko_variation_1History");
            const { resultSpace } = game;
            history = history ? JSON.parse(history) : [];
            let value = resultSpace.find( r => r.formType == result);
            history.unshift({ value : `${value.multiplier}x`, win : value.multiplier >= 1  });
            localStorage.setItem("plinko_variation_1History", JSON.stringify(history));
            this.setState({ result : value });
        } catch (error) {
            console.log(error);
        }
    }

    handleAnimation = async () => {
        const { profile } = this.props;
        const { amount } = this.state;
        const { winAmount, userDelta } = this.state.betObjectResult;
        setWonPopupMessageDispatcher(winAmount);
        this.addToHistory();
        await profile.updateBalance({ userDelta, amount });
        return this.setState({ result : 0, disableControls : false });
    };

    getOptions = () => {
        const { disableControls } = this.state;
        const { profile } = this.props;

        return (
            <PlinkoGameOptions
                disableControls={disableControls}
                profile={profile}
                onBet={this.handleBet}
                game={this.state.game}
            />
        );
    };

    getGameCard = () => {
        const { result, disableControls, bet, animating, isWon } = this.state;
        const { profile } = this.props;
        return (
            <PlinkoGameCard
                profile={profile}
                onResultAnimation={this.handleAnimation}
                disableControls={disableControls}
                result={result}
                animating={animating}
                bet={bet}
                isWon={isWon}
                game={this.state.game}
                ref="childGameCard"
            />
        );
    };

    render() {
        const { onTableDetails } = this.props;
        return (
            <GamePage
                game={this.getGameCard()}
                options={this.getOptions()}
                history="plinko_variation_1History"
                gameMetaName={this.state.game.metaName}
                onTableDetails={onTableDetails}
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

export default connect(mapStateToProps)(PlinkoPage);
