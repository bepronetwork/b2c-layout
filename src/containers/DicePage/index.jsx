import React, { Component } from "react";
import { DiceGameCard, DiceGameOptions } from "components";
import { updateUserBalance } from "lib/api/users";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";
import GamePage from "containers/GamePage";
import diceBet from "lib/api/dice";
import Cache from "../../lib/cache/cache";
import { find } from "lodash";
import store from "../App/store";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';

class DicePage extends Component {
    static contextType = UserContext;

    static propTypes = {
        onHandleLoginOrRegister: PropTypes.func.isRequired
    };

    state = {
        result: null,
        disableControls: false,
        rollNumber: 50,
        rollType: "over",
        game_name : 'Linear Dice',
        game : {
            edge : 0
        }
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


    handleRollAndRollTypeChange = (rollNumber, rollType=this.state.rollType) => {
        this.setState({ rollNumber, rollType });
    };

    handleBet = async ({ amount }) => {
        try{
            const { user } = this.context;
            const { onHandleLoginOrRegister } = this.props;
            const { rollNumber, rollType } = this.state;
            this.setState({ disableControls: true });
            if (!user) return onHandleLoginOrRegister("register");

            const res = await diceBet({
                rollNumber,
                rollType,
                betAmount: amount,
                user
            });
            this.setState({ 
                result : res.result, 
                disableControls : false, 
                betObjectResult : res 
            });
            return res;
        }catch(err){
            return this.setState({ result : 0, disableControls : false });

        }
    };

    handleAnimation = async () => {
        const { profile } = this.props;
        const { betObjectResult } = this.state;
        await profile.getBalanceData();
        this.setState({ result: null, disableControls: false });
    };

    getOptions = () => {
        const { disableControls, rollType, rollNumber } = this.state;

        return (
            <DiceGameOptions
                disableControls={disableControls}
                onBet={this.handleBet}
                game={this.state.game}
                onChangeRollAndRollType={this.handleRollAndRollTypeChange}
                rollType={rollType}
                rollNumber={rollNumber}
            />
        );
    };

    getGameCard = () => {
        const { result, disableControls, rollNumber } = this.state;

        return (
            <DiceGameCard
                onResultAnimation={this.handleAnimation}
                disableControls={disableControls}
                result={result}
                rollNumber={rollNumber}
                game={this.state.game}
                onChangeRollAndRollType={this.handleRollAndRollTypeChange}
            />
        );
    };

    render() {
        return (
            <GamePage
                game={this.getGameCard()}
                options={this.getOptions()}
                history="diceHistory"
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

export default connect(mapStateToProps)(DicePage);
