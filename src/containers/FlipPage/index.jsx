import React, { Component } from "react";
import propTypes from "prop-types";
import { FlipGameCard, FlipGameOptions } from "components";
import GamePage from "containers/GamePage";
import UserContext from "containers/App/UserContext";
import coinFlipBet from "lib/api/coinFlip";
import { updateUserBalance } from "lib/api/users";

export default class FlipPage extends Component {
    static contextType = UserContext;

    static propTypes = {
        onHandleLoginOrRegister: propTypes.func.isRequired
    };

    state = {
        flipResult: null,
        hasWon: null
    };

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
            hasWon={hasWon}
            onResult={this.handleEnableControls}
        />
        );
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
