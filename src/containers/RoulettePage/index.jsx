import React, { Component } from "react";
import PropTypes from "prop-types";
import { RouletteGameOptions, RouletteGameCard } from "components";
import GamePage from "containers/GamePage";
import { reduce } from "lodash";
import UserContext from "containers/App/UserContext";
import rouletteBet from "lib/api/roulette";
import Cache from "../../lib/cache/cache";
import { setWonPopupMessageDispatcher } from "../../lib/redux";
import { find } from "lodash";
import { Numbers } from "lib/ethereum/lib";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import _ from 'lodash';

class RoulettePage extends Component {
    static contextType = UserContext;

    static propTypes = {
        onHandleLoginOrRegister: PropTypes.func.isRequired
    };

    state = {
        result: null,
        selectedChip: 0.001,
        betHistory: [],
        game_name : 'Roulette',
        game : {
            edge : 0
        },
        betObjectResult : {},
        bet: false,
        amount: 0
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
        const user = this.props.profile;
        if (!user || _.isEmpty(user)) return true;

        return this.getTotalBet() + selectedChip > user.getBalanceWithBonus();
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
        let betHistoryCopy;

        betHistoryCopy = [...betHistory];

        betHistoryCopy.splice(-1, 1);

        this.setState({ betHistory: betHistoryCopy });
    };

    handleClear = () => {
        this.setState({ betHistory: [] });
    };

    handleChangeChip = chip => {
        this.setState({ selectedChip: chip });
    };

    addToHistory = ({result, won}) => {
        try {
            let history = Cache.getFromCache("rouletteHistory");
            history = history ? history : [];
            history.unshift({ value: result, win : won });
            Cache.setToCache("rouletteHistory", history);
        } catch (error) {
            console.log(error);
        }
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
                betObjectResult : res,
                amount: this.getTotalBet()
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
        const { profile } = this.props;
        const { amount } = this.state;
        const { isWon, result, winAmount, userDelta, totalBetAmount } = this.state.betObjectResult;
        setWonPopupMessageDispatcher(winAmount);
        this.addToHistory({result, won : isWon});
        await profile.updateBalance({ userDelta, amount, totalBetAmount });
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
        const { profile } = this.props;

        return (
            <RouletteGameOptions
                onBet={this.handleBet}
                onChangeChip={this.handleChangeChip}
                totalBet={this.getTotalBet()}
                game={this.state.game}
                profile={profile}
                doubleDownBet={this.doubleDownBet}
                disableControls={bet}
            />
        );
    };

    renderGameCard = () => {
        const { result, betHistory, bet } = this.state;
        const { profile } = this.props;

        return (
            <RouletteGameCard
                result={result}
                onAddChip={this.handleAddChipToBoard}
                betHistory={betHistory}
                onClear={this.handleClear}
                profile={profile}
                game={this.state.game}
                onUndo={this.handleUndo}
                bet={bet}
                onResultAnimation={this.handleAnimation}
                isAddChipDisabled={this.isAddChipDisabled()}
            />
        );
    };

    render() {
        const { onTableDetails } = this.props;
        return (
            <GamePage
                options={this.renderGameOptions()}
                game={this.renderGameCard()}
                history="rouletteHistory"
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

export default compose(connect(mapStateToProps))(RoulettePage);
