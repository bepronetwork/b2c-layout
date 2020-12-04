import React, { Component } from "react";
import { Typography } from "components";
import PropTypes from "prop-types";
import { map, take, reverse, isEqual, cloneDeep } from "lodash";
import classNames from "classnames";
import "./index.css";

const betWidth = "52px";

export default class History extends Component {
  static propTypes = {
    game: PropTypes.oneOf([
      "diceHistory",
      "rouletteHistory",
      "flipHistory",
      "plinko_variation_1History",
      "wheelHistory",
      "wheel_variation_1History",
      "kenoHistory",
      "diamondsHistory",
      "slotsHistory"
    ]).isRequired
  };

  constructor(props) {
    super(props);

    let bets = localStorage.getItem(props.game);

    bets = bets ? JSON.parse(bets) : null;

    this.state = {
      anime: null,
      bets: bets ? take(bets, 5) : null
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let bets = localStorage.getItem(nextProps.game);

    bets = bets ? JSON.parse(bets) : null;

    if (!bets) {
      return null;
    }

    if (!isEqual(take(bets, 5), prevState.bets) && !prevState.anime) {
      return {
        anime: true
      };
    }

    return null;
  }

  componentDidUpdate(prevProps) {
    let betsStorage = localStorage.getItem(prevProps.game);
    const { anime } = this.state;

    betsStorage = betsStorage ? take(JSON.parse(betsStorage), 5) : null;

    if (anime === true) {
      clearTimeout(this.animeTimeout);

      this.animeTimeout = setTimeout(() => {
        clearTimeout(this.animeTimeout);
        this.setState({ bets: betsStorage, anime: false });
      }, 1000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.animeTimeout);
  }

  renderBets = () => {
    const { bets } = this.state;

    if (!bets) {
      return null;
    }

    const betsArray = reverse(cloneDeep(bets));
    let opacity = 1 - (betsArray.length - 1) * 0.2;

    return map(betsArray, ({ value, win }, index) => {
      const betStyles = classNames("bet", {
        win
      });

      const node = (
        <div style={{ opacity }} key={index} styleName={betStyles}>
          <Typography
            weight="semi-bold"
            color={win ? "gable-green" : "casper"}
            variant="small-body"
          >
            {value}
          </Typography>
        </div>
      );

      opacity += 0.2;

      return node;
    });
  };

  handleAnimation = () => {
    clearTimeout(this.doneTimeout);
    this.setState({ anime: false });
  };

    render() {
        const { bets, anime } = this.state;
        if (!bets) {
            return null;
        }

        const containerStyles = classNames("container", {
            hide: anime,
            show: true
        });

        return (
            <div styleName="root">
                <div
                    styleName={containerStyles}
                    onAnimationEnd={this.handleAnimation}
                    style={{
                        gridTemplateColumns: `repeat(${bets.length}, ${betWidth})`
                    }}
                >
                    {this.renderBets()}
                </div>
            </div>
        );
    }
}
