import React, { Component } from "react";
import cardbackimage from "assets/images/cardimage.svg";
import "./index.css";

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
              <div
                styleName={`card1 ${
                  this.props.sideACard1 ? `active` : ""
                } playcard ${this.props.cardHide ? "allhc" : ""}`}
                style={{
                  transform: this.props.sideACard1transform,
                  opacity: this.props.sideACard1opacity
                }}
              >
                <div styleName="cardfront">
                  <img src={this.props.sideA.card1} alt="card1" />
                </div>
                {cardBack}
              </div>
              <div
                styleName={`card2 ${
                  this.props.sideACard2 ? `active` : ""
                } playcard ${this.props.cardHide ? "allhc" : ""}`}
                style={{
                  transform: this.props.sideACard2transform,
                  opacity: this.props.sideACard2opacity
                }}
              >
                <div styleName="cardfront">
                  <img src={this.props.sideA.card2} alt="card2" />
                </div>
                {cardBack}
              </div>
              <div
                styleName={`card3 ${
                  this.props.sideACard3 ? `active` : ""
                } playcard ${this.props.cardHide ? "allhc" : ""}`}
                style={{
                  transform: this.props.sideACard3transform,
                  opacity: this.props.sideACard3opacity
                }}
              >
                <div styleName="cardfront">
                  <img src={this.props.sideA.card3} alt="card3" />
                </div>
                {cardBack}
              </div>
              {this.props.sideA.counter !== "" && (
                <div styleName="counter">
                  <span styleName="">{this.props.sideA.counter}</span>
                </div>
              )}
            </div>
          </div>
          <div styleName="card_side_b">
            <div
              styleName="card_block"
              style={{ borderColor: this.props.sideBborderColor }}
            >
              <div
                styleName={`card1 ${
                  this.props.sideBCard1 ? `active` : ""
                } playcard ${this.props.cardHide ? "allhc" : ""}`}
                style={{
                  transform: this.props.sideBCard1transform,
                  opacity: this.props.sideBCard1opacity
                }}
              >
                <div styleName="cardfront">
                  <img src={this.props.sideB.card1} alt="card1" />
                </div>
                {cardBack}
              </div>

              <div
                styleName={`card2 ${
                  this.props.sideBCard2 ? `active` : ""
                } playcard ${this.props.cardHide ? "allhc" : ""}`}
                style={{
                  transform: this.props.sideBCard2transform,
                  opacity: this.props.sideBCard2opacity
                }}
              >
                <div styleName="cardfront">
                  <img src={this.props.sideB.card2} alt="card2" />
                </div>
                {cardBack}
              </div>
              <div
                styleName={`card3 ${
                  this.props.sideBCard3 ? `active` : ""
                } playcard ${this.props.cardHide ? "allhc" : ""}`}
                style={{
                  transform: this.props.sideBCard3transform,
                  opacity: this.props.sideBCard3opacity
                }}
              >
                <div styleName="cardfront">
                  <img src={this.props.sideB.card3} alt="card3" />
                </div>
                {cardBack}
              </div>
              {this.props.sideB.counter !== "" && (
                <div styleName="counter">
                  <span styleName="">{this.props.sideB.counter}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CardSection;
