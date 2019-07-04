import React, { Component } from "react";
import propTypes from "prop-types";
import { FlipGameCard, FlipGameOptions } from "components";
import GamePage from "containers/GamePage";
import UserContext from "containers/App/UserContext";
import coinFlipBet from "lib/api/coinFlip";
import { updateUserBalance } from "lib/api/users";
import Cache from "../../lib/cache/cache";
import { find } from "lodash";


const defaultState = {
    edge : 0,
    flipResult: null,
    hasWon: null,
    game_name : 'CoinFlip',
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

    handleUpdateBalance = async () => {
        const { user, setUser } = this.context;
        await updateUserBalance(user, setUser);
    };

    handleEnableControls = () => {
        this.setState({ disableControls: false, flipResult: null });
    };

    handleBet = async form => {
        try{
            const { user } = this.context;
            const { onHandleLoginOrRegister } = this.props;

            if (!user) return onHandleLoginOrRegister("register");

            const { flipResult, hasWon } = await coinFlipBet({
                ...form,
                user
            });

            return this.setState({
                flipResult,
                hasWon,
                disableControls: false
            });
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

        return (
            <FlipGameOptions
                onBet={this.handleBet}
                game={this.state.game}
                disableControls={disableControls}
            />
        );
    };

    getGameCard = () => {
        const { flipResult, hasWon } = this.state;

        return (
            <FlipGameCard
                updateBalance={this.handleUpdateBalance}
                flipResult={flipResult}
                game={this.state.game}
                hasWon={hasWon}
                onResult={this.handleEnableControls}
            />
        );
    };

    getGame = () => {
        const appInfo = Cache.getFromCache("appInfo");
        if(appInfo){
            console.log(appInfo.games)
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
            />
        );
    }
}

export default FlipPage;
