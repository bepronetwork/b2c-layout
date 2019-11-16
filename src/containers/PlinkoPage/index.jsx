import React, { Component } from "react";
import { PlinkoGameCard, PlinkoGameOptions } from "components";
import { updateUserBalance } from "lib/api/users";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";
import GamePage from "containers/GamePage";
import plinkoBet from "lib/api/plinko";
import Cache from "../../lib/cache/cache";
import { find } from "lodash";
import store from "../App/store";
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
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
        }
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
            console.log(amount)
            const { user } = this.context;
            const { onHandleLoginOrRegister } = this.props;
            this.setState({ disableControls: true });
            if (!user || _.isEmpty(user)) return onHandleLoginOrRegister("register");

            const res = await plinkoBet({
                betAmount: amount,
                user
            });
            console.log(res);
            this.triggerChildGameCard(res.result);
            this.setState({ 
                result : res.result, 
                disableControls : false, 
                bet : res,
                animating : true,
                betObjectResult : res 
            });
            return res;
        }catch(err){
            console.log(err)
            return this.setState({ result : 0, disableControls : false });

        }
    };

    handleAnimation = async () => {
        const { profile } = this.props;
        const { betObjectResult } = this.state;
        await profile.getBalanceData();
        this.setState({ result: null, animating : false, disableControls: false });
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
        const { result, disableControls, bet, animating } = this.state;
        const { profile } = this.props;
        return (
            <PlinkoGameCard
                profile={profile}
                onResultAnimation={this.handleAnimation}
                disableControls={disableControls}
                result={result}
                animating={animating}
                bet={bet}
                game={this.state.game}
                ref="childGameCard"
            />
        );
    };

    render() {
        return (
            <GamePage
                game={this.getGameCard()}
                options={this.getOptions()}
                history="plinko_variation_1History"
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

export default connect(mapStateToProps)(PlinkoPage);
