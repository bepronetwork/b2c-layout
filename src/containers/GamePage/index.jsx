import React, { Component } from "react";
import PropTypes from "prop-types";
import { ButtonIcon, History } from "components";
import UserContext from "containers/App/UserContext";
import { Row, Col } from 'reactstrap';
import "./index.css";

export default class GamePage extends Component {
    static contextType = UserContext;

    static propTypes = {
        options: PropTypes.node,
        game: PropTypes.node,
        history: PropTypes.oneOf(["diceHistory", "rouletteHistory", "flipHistory", "plinkoHistory"])
    };

    static defaultProps = {
        options: null,
        game: null,
        history: ""
    };

    constructor(props) {
        super(props);

        const sound = localStorage.getItem("sound");

        this.state = {
            soundMode: sound || "off"
        };
    }

    handleSounds = () => {
        const { soundMode } = this.state;
        const mode = soundMode === "off" ? "on" : "off";

        this.setState({ soundMode: mode }, () => {
        localStorage.setItem("sound", mode);
        });
    };

    renderHistory = () => {
        const { user } = this.context;
        const { history } = this.props;

        if (!user) {
        return null;
        }

        return (
        <div styleName="history">
            <History game={history} />
        </div>
        );
    };

    render() {
        const { options, game } = this.props;
        const { soundMode } = this.state;

        return (
            <div styleName='main-container'>
                <div styleName="root">
                    <div styleName="container">
                        <Row styleName="game-page-container">
                            <Col lg={{ size: 9, order: 2}} styleName='no-padding'>
                                <div styleName="game-container">
                                    {game}
                                    {this.renderHistory()}
                                </div>
                                <div styleName="sound">
                                    <ButtonIcon
                                        iconAtLeft
                                        icon="sound"
                                        label="Sound"
                                        onClick={this.handleSounds}
                                        soundMode={soundMode}
                                    />
                                </div>
                            </Col>
                            <Col lg={{ size: 3, order: 1}} styleName='no-padding'>
                                <div styleName="options-container">{options}</div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}
