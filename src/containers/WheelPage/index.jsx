import React, { Component } from "react";
import PropTypes from "prop-types";
import { WheelGameOptions, WheelGameCard } from "components";
import GamePage from "containers/GamePage";
import { reduce } from "lodash";
import UserContext from "containers/App/UserContext";
import { setWonPopupMessageDispatcher } from "../../lib/redux";
import wheelBet from "lib/api/wheel";
import Cache from "../../lib/cache/cache";
import { find } from "lodash";
import { Numbers } from "lib/ethereum/lib";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import _ from "lodash";


const resultSpaceColors = [
    {
        "color" : '#000000'
    },
    {        
        "color" : '#406c82'
    },
    {
        "color" : '#00e403'
    },
    {
        "color" : '#d5e8f2'
    },
    {
        "color" : '#fde905'
    },
    {
        "color" : '#7f46fd'
    },
    {
        "color" : '#fca32f'
    }
]

class WheelPage extends React.Component {
    static contextType = UserContext;

    static propTypes = {
        onHandleLoginOrRegister: PropTypes.func.isRequired
    };

    constructor(props){
        super(props);
        this.state = {
            result: null,
            selectedChip: 0.01,
            betHistory: [],
            game_name : 'Wheel',
            game : {
                edge : 0
            },
            options : [],
            betObjectResult : {},
            bet: false
        }
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = (props) => {
        const appInfo = Cache.getFromCache("appInfo");
        let game = null
        if(appInfo){
            game = find(appInfo.games, { name: this.state.game_name });
        }

        if(_.isEmpty(game)){return}
        if(!game.resultSpace){return}

        let options = [];
        let indexOptions = 0;

        for(var i = 0; i < game.resultSpace.length; i++){
            let resultSpace = game.resultSpace[i];
            let optExists = options.find( opt => opt.multiplier == resultSpace.multiplier);
            if(!optExists){
                let color = resultSpaceColors[indexOptions].color;
                // Does not exist
                options.push({
                    index : indexOptions,
                    probability : resultSpace.probability,
                    multiplier : resultSpace.multiplier,
                    amount : 1,
                    start : i,
                    placings : [i],
                    color : color
                })
                indexOptions = indexOptions + 1;
            }else{
                optExists.placings.push(i)
                // Exit update
                options[optExists.index] = {
                    ...optExists,
                    amount : optExists.amount + 1,
                    placings : optExists.placings,
                    probability : optExists.probability + resultSpace.probability
                }
            }
        }
        this.setState({...this.state, 
            options,
            game
        })
    }

    isAddChipDisabled = () => {
        const { selectedChip } = this.state;
        const user = this.props.profile;

        if (!user || _.isEmpty(user)) return true;

        return this.getTotalBet() + selectedChip > user.getBalance();
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
        try {
            let multiplier = this.state.game.resultSpace[result].multiplier;
            let history = Cache.getFromCache("wheelHistory");
            history = history ? history : [];
            history.unshift({ value: `${multiplier}x`, win : won });
            Cache.setToCache("wheelHistory", history);
        } catch (error) {
            console.log(error);
        }
    }



    handleBet = async ({amount}) => {
        try{
            var { user } = this.context;
            var { onHandleLoginOrRegister } = this.props;
            var { betHistory, game } = this.state;
            
            if (!user) return onHandleLoginOrRegister("register");
            
            this.setState({ bet: true });

            const res = await wheelBet({
                amount,
                user,
                game_id : game._id
            });
            const { isWon, result } = res;

            this.setState({ 
                result,
                inResultAnimation : true,
                hasWon : isWon,
                disableControls: false,
                betObjectResult : res
            });
            return res;
        }catch(err){
            return this.setState({
                bet : false,
                flipResult : 0,
                inResultAnimation : false,
                hasWon : false,
                disableControls: false
            });        
        }
    };


    stopAnimation = async () => {
        
    }

    handleAnimation = async () => {
        this.setState({ bet: false, disableControls : false, inResultAnimation : false });
        const { profile } = this.props;
        /* Update Info User View */
        const { isWon, result, winAmount, userDelta } = this.state.betObjectResult;
        setWonPopupMessageDispatcher(winAmount);
        this.addToHistory({result, won : isWon});
        await profile.updateBalance({ userDelta });
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
        const { bet, options } = this.state;
        const { profile } = this.props;

        return (
            <WheelGameOptions
                onBet={this.handleBet}
                onChangeChip={this.handleChangeChip}
                totalBet={this.getTotalBet()}
                game={this.state.game}
                options={options}
                profile={profile}
                doubleDownBet={this.doubleDownBet}
                disableControls={bet}
            />
        );
    };

    renderGameCard = () => {
        const { result, betHistory, bet, inResultAnimation, onAnimation, options } = this.state;
        const { profile } = this.props;

        return (
            <WheelGameCard
                result={result}
                betHistory={betHistory}
                onClear={this.handleClear}
                options={options}
                profile={profile}
                inResultAnimation={inResultAnimation}
                game={this.state.game}
                onUndo={this.handleUndo}
                stopAnimation={this.stopAnimation}
                bet={bet}
                onAnimation={onAnimation}
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
                history="wheelHistory"
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

export default compose(connect(mapStateToProps))(WheelPage);
