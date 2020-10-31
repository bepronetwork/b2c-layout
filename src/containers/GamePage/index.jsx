import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  ButtonIcon,
  History,
  Modal,
  Typography,
  MaximizeIcon
} from "components";
import CloseIcon from "components/Icons/CloseCross";
import UserContext from "containers/App/UserContext";
import LastBets from "../LastBets/GamePage";
import Actions from "./Actions";
import IFrame from "./IFrame";
import Cache from "../../lib/cache/cache";
import { getIcon, convertAmountProviderBigger } from "../../lib/helpers";
import { Row, Col } from "reactstrap";
import { connect } from "react-redux";
import classNames from "classnames";
import { find } from "lodash";
import _ from "lodash";
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
        <Actions game={gameInfo} />
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
      if (appInfo) {
        let gameInfo = find(appInfo.games, { metaName: gameMetaName });
        this.setState({ ...this.state, gameInfo });
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
    this.setState({ max: document.documentElement.clientWidth <= 1024 });

    window.scrollTo(0, 0);
  };

  maximizeIframe(max) {
    this.setState({ max });
  }

  renderBox({ title, game, info, showActions }) {
    const { soundMode } = this.state;

    return (
      <div styleName="box">
        <div styleName="box-title">
          <Typography variant="small-body" color={"white"}>
            {title}
          </Typography>
        </div>
        <div styleName="box-game">
          <Typography variant="x-small-body" color={"white"}>
            {game}
          </Typography>
        </div>
        {info ? (
          <div styleName="box-info">
            <Typography variant="x-small-body" color={"white"}>
              {info}
            </Typography>
          </div>
        ) : null}
        {showActions === true ? (
          <div styleName="buttons">
            <ButtonIcon
              iconAtLeft
              icon="copy"
              onClick={this.handleActionsModalOpen}
              soundMode={soundMode}
              theme="primary"
            />
            <ButtonIcon
              iconAtLeft
              icon="sound"
              onClick={this.handleSounds}
              soundMode={soundMode}
              theme="primary"
            />
          </div>
        ) : null}
      </div>
    );
  }

  renderIframe() {
    const {
      currency,
      providerToken,
      providerGameId,
      providerPartnerId,
      providerUrl,
      providerExternalId,
      providerName,
      providerGameName
    } = this.props;
    const { max } = this.state;

    const newCurrency = convertAmountProviderBigger(currency.ticker, 1);

    if (newCurrency === null) {
      return null;
    }

    const closeStyles = classNames("close-iframe", {
      "show-close": max === true
    });

    const maximizeIcon = getIcon(14);

    return (
      <div>
        <div styleName={closeStyles} onClick={() => this.maximizeIframe(false)}>
          <CloseIcon />
        </div>
        <div styleName="third">
          <IFrame
            providerUrl={providerUrl}
            token={providerToken}
            partnerId={providerPartnerId}
            playerId={providerExternalId}
            gameId={providerGameId}
            ticker={newCurrency.ticker}
            max={max}
          />
          <div styleName="functions">
            <div onClick={() => this.maximizeIframe(true)}>
              {maximizeIcon === null ? (
                <MaximizeIcon />
              ) : (
                <img src={maximizeIcon} alt='Maximize Icon' />
              )}
            </div>
          </div>
        </div>
        {this.renderBox({
          title: providerName,
          game: providerGameName,
          info: `1 ${newCurrency.ticker} = ${newCurrency.value} ${currency.ticker}`
        })}
      </div>
    );
  }

  render() {
    const {
      options,
      game,
      gameMetaName,
      onTableDetails,
      isThirdParty
    } = this.props;
    const { gameInfo } = this.state;

    if (_.isEmpty(gameMetaName) && isThirdParty != true) return null;

    return (
      <div styleName="main-container">
        {isThirdParty == true ? (
          this.renderIframe()
        ) : (
          <div>
            {this.renderActions()}
            <div styleName="root">
              <div styleName="container">
                <Row styleName="game-page-container">
                  <Col lg={{ size: 9, order: 2 }} styleName="card">
                    <div styleName="game">
                      {game}
                      {this.renderHistory()}
                    </div>
                  </Col>
                  <Col lg={{ size: 3, order: 1 }} styleName="options">
                    <div styleName="options-container">{options}</div>
                  </Col>
                </Row>
              </div>
              {this.renderBox({
                title: "BetProtocol Games",
                game: gameInfo ? gameInfo.description : null,
                showActions: true
              })}
            </div>
            <LastBets
              gameMetaName={gameMetaName}
              onTableDetails={onTableDetails}
            />
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ln: state.language,
    modal: state.modal,
    profile: state.profile,
    currency: state.currency
  };
}

export default connect(mapStateToProps)(GamePage);
