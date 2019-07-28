import React, { Component } from "react";
import PropTypes from "prop-types";
import { RouletteGameOptions, RouletteGameCard } from "components";
import GamePage from "containers/GamePage";
import { reduce } from "lodash";
import UserContext from "containers/App/UserContext";
import rouletteBet from "lib/api/roulette";
import Cache from "../../lib/cache/cache";
import { updateUserBalance } from "lib/api/users";
import { find } from "lodash";
import store from "../App/store";
import { setBetResult } from "../../redux/actions/bet";
import { Numbers } from "lib/ethereum/lib";

export default class RoulettePage extends Component {
    static contextType = UserContext;

    static propTypes = {
        onHandleLoginOrRegister: PropTypes.func.isRequired
    };

    state = {
        result: null,
        selectedChip: 0.01,
        betHistory: [],
        game_name : 'Roulette',
        game : {
            edge : 0
        },
        betObjectResult : {},
        bet: false
    };

    componentDidMount(){
        this.getGame();
    }

    getGame = () => {
        const appInfo = Cache.getFromCache("appInfo");
        if(appInfo){
            let game = find(appInfo.games, { name: this.state.game_name });
            this.setState({...this.state, game});
        }
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

    addToHistory = ({result, won}) => {
        let history = Cache.getFromCache("rouletteHistory");
        history = history ? history : [];
        history.unshift({ value: result, win : won });
        Cache.setToCache("rouletteHistory", history);
    }

    addBetToRedux = async () => {
        await store.dispatch(setBetResult(this.state.betObjectResult));
    }


    handleBet = async () => {
        try{
            var { user } = this.context;
            var { onHandleLoginOrRegister } = this.props;
            var { betHistory } = this.state;
            
            if (!user) return onHandleLoginOrRegister("register");
            
            this.setState({ bet: true });
            const res = await rouletteBet({
                betHistory,
                betAmount: this.getTotalBet(),
                user
            });
            const { isWon, result } = res;

            this.setState({ 
                result,
                hasWon : isWon,
                disableControls: false,
                betObjectResult : res
            });
            return res;
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
        /* Update Info User View */
        this.addBetToRedux();
        const { isWon, result} = this.state.betObjectResult;
        this.addToHistory({result, won : isWon});
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

    doubleDownBet = () => {
        const { betHistory } = this.state;

        this.setState({...this.state,
            betHistory : betHistory.map( (item) => {
                return {
                    cell : item.cell,
                    chip : Numbers.toFloat(parseFloat(item.chip)*2)
                }
            })
        })
    }

    renderGameOptions = () => {
        const { bet } = this.state;

        return (
            <RouletteGameOptions
                onBet={this.handleBet}
                onChangeChip={this.handleChangeChip}
                totalBet={this.getTotalBet()}
                game={this.state.game}
                doubleDownBet={this.doubleDownBet}
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
                game={this.state.game}
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
