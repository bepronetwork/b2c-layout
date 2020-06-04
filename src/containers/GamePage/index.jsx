import React, { Component } from "react";
import PropTypes from "prop-types";
import { ButtonIcon, History, Modal, Tabs, Button, Typography } from "components";
import UserContext from "containers/App/UserContext";
import LastBets from "../LastBets/GamePage";
import Actions from "./Actions"
import Cache from "../../lib/cache/cache";
import { Row, Col } from 'reactstrap';
import { CopyText } from "../../copy";
import { connect } from "react-redux";
import classNames from "classnames";
import { find } from "lodash";
import _ from 'lodash';
import "./index.css";

class GamePage extends Component {
    static contextType = UserContext;

    static propTypes = {
        options: PropTypes.node,
        game: PropTypes.node,
        history: PropTypes.oneOf(["diceHistory", "rouletteHistory", "flipHistory", "plinko_variation_1History", "wheelHistory", "wheel_variation_1History", "kenoHistory"])
    };

    static defaultProps = {
        options: null,
        game: null,
        history: "",
        gameMetaName: null
    };

    constructor(props) {
        super(props);

        const { ln } = this.props;
        const sound = localStorage.getItem("sound");

        this.state = {
            soundMode: sound || "off",
            actionsOpen: false,
            gameInfo: null
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

    renderActions = () => {
        const { actionsOpen, gameInfo } = this.state;

        return actionsOpen ? (
            <Modal onClose={this.handleActionsModalClose}>
                <Actions game={gameInfo}/>
            </Modal>
        ) : null;
    };

    handleActionsModalOpen = () => {
        this.setState({ actionsOpen: true });
    };

    handleActionsModalClose = () => {
        this.setState({ actionsOpen: false });
    };

    getGame = () => {
        const { gameMetaName } = this.props;
        if (!_.isEmpty(gameMetaName)) {
            const appInfo = Cache.getFromCache("appInfo");
            if(appInfo){
                let gameInfo = find(appInfo.games, { metaName: gameMetaName });
                this.setState({...this.state, gameInfo});
            }
        }
    };

    componentDidUpdate(prevProps) {
        const { gameMetaName } = this.props;

        if (gameMetaName !== prevProps.gameMetaName) {
            this.getGame();
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)
    }

    render() {
        const { options, game, gameMetaName, onTableDetails } = this.props;
        const { soundMode } = this.state;

        const { ln } = this.props;
        const copy = CopyText.homepagegame[ln];

        if (_.isEmpty(gameMetaName)) return null;

        return (
            <div styleName='main-container'>
                {this.renderActions()}
                <div styleName="root">
                    <div styleName="container">
                        <Row styleName="game-page-container">
                            <Col lg={{ size: 9, order: 2}} styleName='card'>
                                <div styleName="game">
                                    {game}
                                    {this.renderHistory()}
                                </div>

                            </Col>
                            <Col lg={{ size: 3, order: 1}} styleName='options'>
                                <div styleName="options-container">{options}</div>
                            </Col>
                        </Row>
                    </div>
                    <div styleName="buttons">
                        <div styleName="actions">
                            <ButtonIcon
                                iconAtLeft
                                icon="copy"
                                label={copy.RULES}
                                onClick={this.handleActionsModalOpen}
                                soundMode={soundMode}
                                theme="primary"
                            />
                        </div>
                        <div styleName="sound">
                            <ButtonIcon
                                iconAtLeft
                                icon="sound"
                                label={copy.SOUND}
                                onClick={this.handleSounds}
                                soundMode={soundMode}
                                theme="primary"
                            />
                        </div>
                    </div>
                </div>
                <LastBets gameMetaName={gameMetaName} onTableDetails={onTableDetails}/>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        ln : state.language,
        modal : state.modal
    };
}

export default connect(mapStateToProps)(GamePage);
