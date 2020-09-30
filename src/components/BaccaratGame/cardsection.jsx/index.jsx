import React, { Component } from "react";
import cardbackimage from "assets/images/cardimage.svg";
import "./index.css";

import images from "../BaccaratMock";

class CardSection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const cardBack = (
      <div
        styleName="cardback"
        style={{ backgroundImage: `url(${cardbackimage})` }}
      />
    );


    return (
      <div styleName="cardsection">
        <div styleName="card_wrapper">
          <div styleName="card_side_a">
            <div
              styleName="card_block"
              style={{ borderColor: this.props.sideAborderColor }}
            >
              <div />
              {this.props.CardAResult[0] !== undefined ? (
                <div
                  styleName={`card1 ${this.props.CardAResultNumber === true ? "result-border" : "card1"}  ${
                    this.props.sideACard1 ? `active` : ""
                  } playcard ${this.props.cardHide ? "allhc" : ""}`}
                  style={{
                    transform: this.props.sideACard1transform,
                    opacity: this.props.sideACard1opacity
                  }}
                >
                  {this.props.CardAResult.slice(0, 1).map(num => {
                    return (
                      <div styleName="cardfront">
                        <img
                          src={images[num].img[this.props.randNumber1]}
                          alt="card1"
                        />
                      </div>
                    );
                  })}
                  {cardBack}
                </div>
              ) : null}
              <div />
              {this.props.CardAResult[1] !== undefined ? (
                <div
                  styleName={`card2 ${this.props.CardAResultNumber === true ? "result-border" : "card1"}  ${
                    this.props.sideACard2 ? `active` : ""
                  } playcard ${this.props.cardHide ? "allhc" : ""}`}
                  style={{
                    transform: this.props.sideACard2transform,
                    opacity: this.props.sideACard2opacity
                  }}
                >
                  {this.props.CardAResult.slice(1, 2).map(num => {
                    return (
                      <div styleName="cardfront">
                        <img
                          src={images[num].img[this.props.randNumber2]}
                          alt="card1"
                        />
                      </div>
                    );
                  })}
                  {cardBack}
                </div>
              ) : null}

              {this.props.CardAResult[2] !== undefined ? (
                <div
                  styleName={`card3 ${this.props.CardAResultNumber === true ? "result-border" : "card1"}  ${
                    this.props.sideACard3 ? `active` : ""
                  } playcard ${this.props.cardHide ? "allhc" : ""}`}
                  style={{
                    transform: this.props.sideACard3transform,
                    opacity: this.props.sideACard3opacity
                  }}
                >
                  {this.props.CardAResult.slice(2, 3).map(num => {
                    return (
                      <div styleName="cardfront">
                        <img
                          src={images[num].img[this.props.randNumber3]}
                          alt="card1"
                        />
                      </div>
                    );
                  })}
                  {cardBack}
                </div>
              ) : null}
            </div>
          </div>
          <div styleName="card_side_b">
            <div
              styleName="card_block"
              style={{ borderColor: this.props.sideBborderColor }}
            >
              {this.props.CardBResult[0] !== undefined ? (
                <div
                  styleName={`card1 ${this.props.CardBResultNumber === true ? "result-border" : "card1"} ${
                    this.props.sideBCard1 ? `active` : ""
                  } playcard ${this.props.cardHide ? "allhc" : ""}`}
                  style={{
                    transform: this.props.sideBCard1transform,
                    opacity: this.props.sideBCard1opacity
                  }}
                >
                  {this.props.CardBResult.slice(0, 1).map(num => {
                    return (
                      <div styleName="cardfront">
                        <img
                          src={images[num].img[this.props.randNumber1]}
                          alt="card1"
                        />
                      </div>
                    );
                  })}
                  {cardBack}
                </div>
              ) : null}

              {this.props.CardBResult[1] !== undefined ? (
                <div
                  styleName={`card2 ${this.props.CardBResultNumber === true ? "result-border" : "card1"}  ${
                    this.props.sideBCard2 ? `active` : ""
                  } playcard ${this.props.cardHide ? "allhc" : ""}`}
                  style={{
                    transform: this.props.sideBCard2transform,
                    opacity: this.props.sideBCard2opacity
                  }}
                >
                  {this.props.CardBResult.slice(1, 2).map(num => {
                    return (
                      <div styleName="cardfront">
                        <img
                          src={images[num].img[this.props.randNumber2]}
                          alt="card1"
                        />
                      </div>
                    );
                  })}
                  {cardBack}
                </div>
              ) : null}

              {this.props.CardBResult[2] !== undefined ? (
                <div
                  styleName={`card3 ${this.props.CardBResultNumber === true ? "result-border" : "card1"}  ${
                    this.props.sideBCard3 ? `active` : ""
                  } playcard ${this.props.cardHide ? "allhc" : ""}`}
                  style={{
                    transform: this.props.sideBCard3transform,
                    opacity: this.props.sideBCard3opacity
                  }}
                >
                  {this.props.CardBResult.slice(2, 3).map(num => {
                    return (
                      <div styleName="cardfront">
                        <img
                          src={images[num].img[this.props.randNumber3]}
                          alt="card1"
                        />
                      </div>
                    );
                  })}
                  {cardBack}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CardSection;
