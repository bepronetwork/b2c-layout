import React, { Component } from "react";
import { find } from "lodash";
import { GameCard } from "components";
import PropTypes from "prop-types";
import Dices from "components/Icons/Dices";
import roulette from "assets/roulette-wheel.png";
import Bitcoin from "components/Icons/Bitcoin";
import UserContext from "containers/App/UserContext";
import PlayInvitation from "components/PlayInvitation";
import { Row, Col} from 'reactstrap';

import "./index.css";

const games = [{
    name : 'Linear Dice',
    path :"/dice",
    title : "Linear Dice",
    width : "145px",
    color: "cornflower-blue",
    content : <Dices/>
}, {
    name : 'Roulette',
    path :"/roulette",
    title : "Roulette",
    color: "malachite",
    content : (<img alt="roulette" src={roulette} />)
},  {
    name : 'CoinFlip',
    path :"/coinflip",
    title : "CoinFlip",
    width : '110px',
    color: "dodger-blue",
    content : (<div styleName="coin"><Bitcoin /></div>)
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
        if (!appInfo) return null;
        return find(appInfo.games, { name: game });
    };

    renderGame = ({path, title, width, color, content}) => {
        if(!this.isGameAvailable(title)){return null};

        return (
            <Col md={6} lg={4}>
                <GameCard
                    path={path}
                    title={title}
                    width={width}
                    color={color}
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
                </div>
            </div>
        );
    }
}
