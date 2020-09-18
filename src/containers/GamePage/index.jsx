import React, { Component } from "react";
import PropTypes from "prop-types";
import { ButtonIcon, History, Modal, Tabs, Button, Typography, MaximizeIcon } from "components";
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
        history: PropTypes.oneOf([
            "diceHistory",
            "rouletteHistory",
            "flipHistory",
            "plinko_variation_1History",
            "wheelHistory",
            "wheel_variation_1History",
            "kenoHistory",
            "diamondsHistory",
            "slotsHistory"
    ])
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
            gameInfo: null,
            max: false
        };
        this.escFunction = this.escFunction.bind(this);
    }

    escFunction(event){
        if(event.keyCode === 27) {
          this.setState({ max: false });
        }
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

    componentDidMount = async () => {
        window.scrollTo(0, 0);
        document.addEventListener("keydown", this.escFunction, false);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.escFunction, false);
    }

    convertAmountProviderBigger = (ticker, value) => {
        let tickers = {
            "ETH": {value: 1000, ticker: "mETH"},
            "BTC": {value: 1000000, ticker: "μBTC"}
        };
        return {value: (value * tickers[ticker].value),  ticker: (tickers[ticker].ticker)};
    }

    maximizeIframe() {
        this.setState({ max: true });
    }

    renderBox({title, game, info, showActions}) {
        const { ln } = this.props;
        const { soundMode } = this.state;
        const copy = CopyText.homepagegame[ln];

        return(
            <div styleName="box">
                <div styleName="box-title">
                    <Typography variant='small-body' color={"white"}>
                        {title}
                    </Typography>
                </div>
                <div styleName="box-game">
                    <Typography variant='x-small-body' color={"white"}>
                        {game}
                    </Typography>
                </div>
                {
                    info 
                    ?
                        <div styleName="box-info">
                            <Typography variant='x-small-body' color={"white"}>
                                {info}
                            </Typography>
                        </div>
                    :
                        null
                }
                {
                    showActions === true
                    ?
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
                    :
                        null
                }
            </div>
        )
    }

    render() {
        const { currency, ln, options, game, gameMetaName, onTableDetails, isThirdParty, providerToken, providerGameId, providerPartnerId, providerUrl, providerExternalId, providerName, providerGameName } = this.props;
        const { gameInfo, max } = this.state;

        if (_.isEmpty(gameMetaName) && isThirdParty != true) return null;

        const newCurrency = this.convertAmountProviderBigger(currency.ticker, 1);
        const thirdStyles = classNames("iframe", {
            max: max === true
          });

        return (
            <div styleName='main-container'>
                {
                    isThirdParty == true
                    ?
                        <div>
                            <div styleName="third">
                                <div styleName="functions">
                                    <div onClick={() => this.maximizeIframe()}><MaximizeIcon /></div>
                                </div>
                                <iframe styleName={thirdStyles} allowfullscreen="" src={`${providerUrl}/game?token=${providerToken}&partner_id=${providerPartnerId}&player_id=${providerExternalId}&game_id=${providerGameId}&language=${ln}&currency=${newCurrency.ticker}`}
                                frameborder="0"></iframe>
                            </div>
                            {this.renderBox({title: providerName, game: providerGameName, info: `1 ${currency.ticker} = ${newCurrency.value} ${newCurrency.ticker}`})}
                        </div>
                    :
                    <div>
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
                            {this.renderBox({title: "BetProtocol Games", game: gameInfo ? gameInfo.description : null, showActions: true})}
                        </div>
                        <LastBets gameMetaName={gameMetaName} onTableDetails={onTableDetails}/>
                    </div>
                }
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        ln : state.language,
        modal : state.modal,
        profile : state.profile,
        currency : state.currency
    };
}

export default connect(mapStateToProps)(GamePage);
