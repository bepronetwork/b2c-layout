import React, { Component } from "react";
import { Row, Col, Button } from "antd";

import bgimg from "assets/images/baccarat_game_bg.svg";
import chip_dot from "assets/images/chip_dot.svg";
import undoimg from "assets/images/undo.svg";
import rotateimg from "assets/images/rotate.svg";
import cards from "assets/images/cardimage.svg";

import "./index.css";
import CardSection from "./cardsection.jsx";

class Baccarat extends Component {
  render() {
    const {
      onClickPlayerCoinValue,
      onClickTieCoinValue,
      onClickBankerCoinValue,
      gameRunning,
      notifyStatusColor,
      clearBaccaratState,
      betMultiply,
      playerCoinChildren,
      tieCoinChildren,
      bankerCoinChildren,
      playerCoinArr,
      tieCoinArr,
      bankerCoinArr,
      onClickPlayer,
      onClickTie,
      onClickBaker,
      playerAmount,
      tieAmount,
      bankerAmount,
      notifyStatus,
      stateCard,
      winAmount
    } = this.props;

    for (let i = 0; i < playerCoinChildren; i += 1) {
      playerCoinArr.push(
        <CoinComponent
          onClickCoinValue={onClickPlayerCoinValue}
          key={i}
          number={i}
        />
      );
    }
    for (let j = 0; j < tieCoinChildren; j += 1) {
      tieCoinArr.push(
        <CoinComponent
          onClickCoinValue={onClickTieCoinValue}
          key={j}
          number={j}
        />
      );
    }
    for (let k = 0; k < bankerCoinChildren; k += 1) {
      bankerCoinArr.push(
        <CoinComponent
          onClickCoinValue={onClickBankerCoinValue}
          key={k}
          number={k}
        />
      );
    }

    return (
      <div styleName="baccarat">
        <Row>
          <Col
            styleName="main_section"
            span={18}
            push={6}
            gutter={16}
            style={{ backgroundImage: `url(${bgimg})` }}
          >
            <div styleName="cards">
              <div styleName="image_cards">
                <img src={cards} alt="cards" />
              </div>
            </div>
            <div styleName="baccarat_main">
              <CardSection {...stateCard} />
            </div>
            <div styleName="baccarat_footer">
              <div styleName="wrapper">
                <div styleName="text">Place your bets</div>
                <div styleName="inner_col">
                  <Button
                    styleName="custom_bet_btn"
                    disabled={gameRunning}
                    // onClick={this.handleCoin.bind(this, 'playerclicked')}>
                    onClick={onClickPlayer}
                  >
                    <div styleName="player">PLAYER</div>
                    <div styleName="amount">{playerAmount.toFixed(2)}</div>
                    <div styleName="coin_wrapper">{playerCoinArr}</div>
                  </Button>
                </div>
                <div styleName="inner_col">
                  <Button
                    styleName="custom_bet_btn"
                    disabled={gameRunning}
                    // onClick={this.handleCoin.bind(this, 'tieclicked')}>
                    onClick={onClickTie}
                  >
                    <div styleName="player">TIE</div>
                    <div styleName="amount">{tieAmount.toFixed(2)}</div>
                    <div styleName="coin_wrapper">{tieCoinArr}</div>
                  </Button>
                </div>

                <div styleName="inner_col">
                  <Button
                    styleName="custom_bet_btn"
                    // onClick={this.handleCoin.bind(this, 'bankerclicked')}
                    onClick={onClickBaker}
                    disabled={gameRunning}
                  >
                    <div styleName="player">BANKER</div>
                    <div styleName="amount">{bankerAmount.toFixed(2)}</div>
                    <div styleName="coin_wrapper">{bankerCoinArr}</div>
                  </Button>
                </div>
              </div>

              <div styleName="btn_wrapper">
                <Button
                  styleName="undo"
                  type="link"
                  size="large"
                  disabled={gameRunning}
                >
                  <span styleName="icon_">
                    <img src={undoimg} alt="undo" />
                  </span>
                  Undo
                </Button>

                <Button
                  styleName="clear"
                  type="link"
                  size="large"
                  disabled={gameRunning}
                  onClick={clearBaccaratState}
                >
                  > Clear
                  <span styleName="icon_">
                    <img src={rotateimg} alt="undo" />
                  </span>
                </Button>
              </div>
            </div>
            {notifyStatus && (
              <div
                styleName="bet_notification_wrapper"
                style={{
                  color: notifyStatusColor,
                  boxShadow: `0px 0px 0px 4px ${notifyStatusColor}`
                }}
              >
                <div styleName="bet_notification_inner">
                  <span styleName="text">
                    {betMultiply}
                    .00
                    <span>+</span>
                  </span>
                  <span styleName="win_amt">
                    <span>{winAmount.toFixed(2)}</span>
                  </span>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default Baccarat;

class CoinComponent extends Component {
  render() {
    return (
      <div
        styleName="coin_image"
        style={{ backgroundImage: "url(" + chip_dot + ")" }}
      >
        <div styleName="coin_value">{this.props.onClickCoinValue}</div>
      </div>
    );
  }
}
