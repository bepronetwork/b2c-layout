import React, { Component } from "react";
import PropTypes from "prop-types";
import { RouletteGameOptions, RouletteGameCard } from "components";
import GamePage from "containers/GamePage";
import { reduce } from "lodash";
import UserContext from "containers/App/UserContext";
import rouletteBet from "lib/api/roulette";
import { updateUserBalance } from "lib/api/users";

export default class RoulettePage extends Component {
    static contextType = UserContext;

    static propTypes = {
        onHandleLoginOrRegister: PropTypes.func.isRequired
    };

    state = {
        result: null,
        selectedChip: 0.01,
        betHistory: [],
        bet: false
    };

    isAddChipDisabled = () => {
        const { selectedChip } = this.state;
        const { user } = this.context;

        if (!user) return true;

        return this.getTotalBet() + selectedChip > user.balance;
    };

    handleAddChipToBoard = cell => {
        const { selectedChip, betHistory } = this.state;

        if (this.isAddChipDisabled()) return null;

        return this.setState({
            betHistory: [...betHistory, { cell, chip: selectedChip }]
        });
    };

    handleUndo = () => {
        const { betHistory } = this.state;

        betHistory.splice(-1, 1);

        this.setState({ betHistory });
    };

    handleClear = () => {
        this.setState({ betHistory: [] });
    };

    handleChangeChip = chip => {
        this.setState({ selectedChip: chip });
    };

    handleBet = async () => {
        try{

            var { user } = this.context;
            var { onHandleLoginOrRegister } = this.props;
            var { betHistory } = this.state;

            if (!user) return onHandleLoginOrRegister("register");

            this.setState({ bet: true });
        
            const result = await rouletteBet({
                betHistory,
                betAmount: this.getTotalBet(),
                user
            });
            return this.setState({ result });
        }catch(err){
            return this.setState({
                bet : false,
                flipResult : 0,
                hasWon : false,
                disableControls: false
            });        
        }
    };

    handleAnimation = async () => {
        this.setState({ bet: false });

        const { user, setUser } = this.context;
        await updateUserBalance(user, setUser);
    };

    getTotalBet = () => {
        const { betHistory } = this.state;

        return reduce(
            betHistory,
            (sum, { chip }) => {
                return sum + chip;
        },0);
    };

    renderGameOptions = () => {
        const { bet } = this.state;

        return (
            <RouletteGameOptions
                onBet={this.handleBet}
                onChangeChip={this.handleChangeChip}
                totalBet={this.getTotalBet()}
                disableControls={bet}
            />
        );
    };

    renderGameCard = () => {
        const { result, betHistory, bet } = this.state;

        return (
            <RouletteGameCard
                result={result}
                onAddChip={this.handleAddChipToBoard}
                betHistory={betHistory}
                onClear={this.handleClear}
                onUndo={this.handleUndo}
                bet={bet}
                onResultAnimation={this.handleAnimation}
                isAddChipDisabled={this.isAddChipDisabled()}
            />
        );
    };

    render() {
        return (
            <GamePage
                options={this.renderGameOptions()}
                game={this.renderGameCard()}
                history="rouletteHistory"
            />
        );
    }
}
