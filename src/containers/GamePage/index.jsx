import React, { Component } from "react";
import PropTypes from "prop-types";
import { ButtonIcon, History, Modal, Tabs, Button, Typography } from "components";
import UserContext from "containers/App/UserContext";
import LastBets from "../LastBets/GamePage";
import Actions from "./Actions"
import { Row, Col } from 'reactstrap';
import { CopyText } from "../../copy";
import { connect } from "react-redux";
import _ from 'lodash';
import "./index.css";

class GamePage extends Component {
    static contextType = UserContext;

    static propTypes = {
        options: PropTypes.node,
        game: PropTypes.node,
        history: PropTypes.oneOf(["diceHistory", "rouletteHistory", "flipHistory", "plinko_variation_1History", "wheelHistory", "wheel_variation_1History"])
    };

    static defaultProps = {
        options: null,
        game: null,
        history: "",
        gameMetaName: null
    };

    constructor(props) {
        super(props);

        const sound = localStorage.getItem("sound");

        this.state = {
            soundMode: sound || "off",
            actionsOpen: false
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

    renderActions = (rulesTitle) => {
        const { actionsOpen } = this.state;
        const { game } = this.props;
        let rules = {title: rulesTitle, content: game.rules};

        return actionsOpen ? (
            <Modal onClose={this.handleActionsModalClose}>
                <Actions rules={rules}/>
            </Modal>
        ) : null;
    };

    handleActionsModalOpen = () => {
        this.setState({ actionsOpen: true });
    };

    handleActionsModalClose = () => {
        this.setState({ actionsOpen: false });
    };

    render() {
        const { ln, options, game, gameMetaName } = this.props;
        const { soundMode } = this.state;
        const copy = CopyText.homepagegame[ln];
        const rulesTitle = copy.RULES;

        if (_.isEmpty(gameMetaName)) return null;

        return (
            <div styleName='main-container'>
                {this.renderActions(rulesTitle)}
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
                <div styleName="actions">
                    <Button size={'x-small'} theme={'action'} onClick={this.handleActionsModalOpen}>
                        <Typography color={'white'} variant={'small-body'}>{rulesTitle}</Typography>
                    </Button>
                </div>
                <LastBets gameMetaName={gameMetaName} />
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
