import React, { Component } from "react";
import { find } from "lodash";
import { GameCard, CoinFlip, Roulette } from "components";
import PropTypes from "prop-types";
import Dices from "components/Icons/Dices";
import UserContext from "containers/App/UserContext";
import PlayInvitation from "components/PlayInvitation";
import { Row, Col} from 'reactstrap';

import "./index.css";
import LastBets from "../LastBets";

const games = [{
    name : 'Linear Dice',
    path :"/dice",
    title : "Linear Dice",
    color: "dice-background-color",
    content : <Dices/>
}, {
    name : 'Roulette',
    path :"/roulette",
    title : "Roulette",
    color: "roulette-background-color",
    content : <Roulette/>
},  {
    name : 'CoinFlip',
    path :"/coinflip",
    title : "CoinFlip",
    color: "coinflip-background-color",
    content : <CoinFlip/>
}];

export default class HomePage extends Component {
    static contextType = UserContext;

    static propTypes = {
        onHandleLoginOrRegister: PropTypes.func.isRequired
    };

    renderPlayNow = () => {
        const { user } = this.context;
        const { onHandleLoginOrRegister } = this.props;

        return <PlayInvitation {...this.props} onLoginRegister={onHandleLoginOrRegister} />;
    };

    isGameAvailable = game => {
        const appInfo = JSON.parse(localStorage.getItem("appInfo"));
        if (!appInfo) { return null; }
        return find(appInfo.games, { name: game });
    };

    renderGame = ({path, title, color, content}) => {
        let game = this.isGameAvailable(title);
        if(!game) {return null};
        return (
            <Col md={6} lg={4}>
                <GameCard
                    path={path}
                    title={title}
                    color={color}
                    edge={game.edge}
                >
                    {content}
                </GameCard>
            </Col>
        )
    }

    render() {
        return (
            <div styleName="root">
                {this.renderPlayNow()}
                <div styleName="container">
                        <Row>
                            {games.map( (item) => this.renderGame(item))}
                        </Row>
                    <LastBets/>
                </div>
            </div>
        );
    }
}
