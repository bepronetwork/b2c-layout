import React, { Component } from "react";
import PropTypes from "prop-types";
import { Typography, DiamondIcon } from "components";
import classNames from "classnames";
import "./index.css";

class KenoBoard extends Component {
  static propTypes = {
    cards: PropTypes.array,
    isDetailsPage: PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.projectData(this.props);
  }

  async componentWillReceiveProps(props) {
    await this.projectData(props);
  }

  async projectData(props) {}

  handleCardClick = index => {
    const { onCardClick, isDetailsPage = false } = this.props;

    if (!isDetailsPage) {
      onCardClick(index);
    }
  };

  render() {
    const { cards, isDetailsPage } = this.props;
    const boardStyles = classNames("board", {
      "board-details": isDetailsPage === true
    });

    return (
      <div styleName={boardStyles}>
        {cards.map((card, index) => {
          const styles = classNames("cover", {
            "cover-picked": card.isPicked === true,
            "cover-selected":
              card.isSelected === true && card.isPicked === false
          });
          return (
            <button
              styleName="card"
              onClick={() => this.handleCardClick(index)}
              style={{ outline: "none" }}
            >
              {card.isSelected === true && card.isPicked === true ? (
                <span styleName="card-selected">
                  <div styleName="card-star">
                    <DiamondIcon />
                  </div>
                </span>
              ) : null}
              <span styleName="card-number">
                <Typography variant={"body"} color={"white"} weight={"bold"}>
                  {card.display}
                </Typography>
              </span>
              <div
                styleName={styles}
                style={{
                  opacity:
                    card.isSelected === true && card.isPicked === true ? 0 : 1
                }}
              >
                <span styleName="number">
                  <Typography
                    variant={"body"}
                    color={card.isPicked === true ? "fixedwhite" : "white"}
                    weight={"bold"}
                  >
                    {card.display}
                  </Typography>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    );
  }
}

export default KenoBoard;
