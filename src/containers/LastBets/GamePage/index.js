import React, { Component } from "react";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";
import { connect } from "react-redux";
import { getLastBets, getBiggestBetWinners } from "../../../lib/api/app";
import { Numbers } from "../../../lib/ethereum/lib";
import {
  dateToHourAndMinute,
  getGames,
  getSkeletonColors,
  getIcon,
} from "../../../lib/helpers";
import Tabs from "../../../components/Tabs";
import {
  SelectBox,
  Table,
  CheckIcon,
  RewardIcon,
  TrophyIcon,
} from "components";
import { formatCurrency } from "../../../utils/numberFormatation";
import _ from "lodash";
import { CopyText } from "../../../copy";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "./index.css";

const views = [
  { text: 10, value: 10 },
  { text: 25, value: 25 },
  { text: 50, value: 50 },
  { text: 100, value: 100 },
];

const rows = {
  all_bets: {
    titles: [],
    fields: [
      {
        value: "game",
        image: true,
      },
      {
        value: "id",
      },
      {
        value: "username",
      },
      {
        value: "winAmount",
        dependentColor: true,
        condition: "isWon",
        currency: true,
      },
      {
        value: "payout",
        //dependentColor : true,
        //condition : 'isWon'
      },
    ],
    rows: [],
  },
  my_bets: {
    titles: [],
    fields: [
      {
        value: "game",
        image: true,
      },
      {
        value: "id",
      },
      {
        value: "winAmount",
        dependentColor: true,
        condition: "isWon",
        currency: true,
      },
      {
        value: "payout",
        //dependentColor : true,
        //condition : 'isWon'
      },
    ],
    rows: [],
  },
  biggest_win_bets: {
    titles: [],
    fields: [
      {
        value: "game",
        image: true,
      },
      {
        value: "id",
      },
      {
        value: "username",
      },
      {
        value: "winAmount",
        dependentColor: true,
        condition: "isWon",
        currency: true,
      },
      {
        value: "payout",
        //dependentColor : true,
        //condition : 'isWon'
      },
    ],
    rows: [],
  },
};

const defaultProps = {
  all_bets: rows.all_bets,
  my_bets: rows.my_bets,
  biggest_win_bets: rows.biggest_win_bets,
  view: "all_bets",
  view_amount: views[0],
  games: [],
  options: [],
  gameMetaName: null,
  isLoading: true,
  isListLoading: true,
};

class LastBets extends Component {
  static contextType = UserContext;

  static propTypes = {
    onHandleLoginOrRegister: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = defaultProps;
  }

  componentDidMount() {
    this.projectData(this.props);
  }

  componentWillReceiveProps(props) {
    /*if(props !== this.props) {
            this.projectData(props);
        }*/
  }

  setTimer = (options) => {
    this.projectData(this.props, options);
  };

  handleTabChange = (name) => {
    this.setState({ ...this.state, view: name });
  };

  changeViewBets = ({ option }) => {
    this.setState({ ...this.state, isListLoading: true });
    this.setTimer({ view_amount: option });
  };

  projectData = async (props, options = null) => {
    let { profile, ln, gameMetaName, onTableDetails } = props;
    let { view_amount } = this.state;

    const games = getGames();

    if (options) {
      view_amount = options.view_amount ? options.view_amount : view_amount;
    }
    const copy = CopyText.homepagegame[ln];
    const gameId = games.find((g) => g.metaName === gameMetaName)._id;

    let all_bets = await getLastBets({ size: view_amount.value, game: gameId });
    let biggest_winners_bets = await getBiggestBetWinners({
      size: view_amount.value,
      game: gameId,
    });

    if (all_bets.length > view_amount.value) {
      all_bets = all_bets.slice(0, view_amount.value);
    }

    if (biggest_winners_bets.length > view_amount.value) {
      biggest_winners_bets = biggest_winners_bets.slice(0, view_amount.value);
    }

    let my_bets = [];

    if (profile && !_.isEmpty(profile)) {
      my_bets = await profile.getMyBets({
        size: view_amount.value,
        game: gameId,
        tag: "casino",
      });
    }

    const latestWinsIcon = getIcon(9);
    const latestBetsIcon = getIcon(10);
    const biggestWinsIcon = getIcon(7);

    this.setState({
      ...this.state,
      ...options,
      isLoading: false,
      isListLoading: false,
      gameMetaName,
      games,
      options: Object.keys(copy.TABLE).map((key) => {
        let icon = null;
        const value = new String(key).toLowerCase();

        if (value === "all_bets") {
          icon =
            latestWinsIcon === null ? (
              <RewardIcon />
            ) : (
              <img src={latestWinsIcon} alt="Reward Icon" />
            );
        } else if (value === "my_bets") {
          icon =
            latestBetsIcon === null ? (
              <CheckIcon />
            ) : (
              <img src={latestBetsIcon} alt="Check Icon" />
            );
        } else if (value === "biggest_win_bets") {
          icon =
            biggestWinsIcon === null ? (
              <TrophyIcon />
            ) : (
              <img src={biggestWinsIcon} alt="Trophy Icon" />
            );
        }

        return {
          value,
          label: copy.TABLE[key].TITLE,
          icon,
        };
      }),
      all_bets: {
        ...this.state.all_bets,
        titles: copy.TABLE.ALL_BETS.ITEMS,
        rows: all_bets
          .map((bet) => {
            return {
              game: games.find((game) => game._id === bet.game._id),
              id: bet._id,
              username:
                bet.user.username.length > 10
                  ? bet.user.username.substring(0, 4) +
                    "..." +
                    bet.user.username.substring(
                      bet.user.username.length - 3,
                      bet.user.username.length
                    )
                  : bet.user.username,
              timestamp: dateToHourAndMinute(bet.bet.timestamp),
              betAmount: formatCurrency(Numbers.toFloat(bet.bet.betAmount)),
              winAmount: formatCurrency(Numbers.toFloat(bet.bet.winAmount)),
              isWon: bet.bet.isWon,
              payout: `${formatCurrency(
                Numbers.toFloat(bet.bet.winAmount / bet.bet.betAmount)
              )}x`,
              currency: bet.currency._id,
            };
          })
          .filter((el) => el.isWon === true),
        onTableDetails: onTableDetails ? onTableDetails : null,
      },
      my_bets: {
        ...this.state.my_bets,
        titles: copy.TABLE.MY_BETS.ITEMS,
        rows: my_bets.map((bet) => {
          return {
            game: games.find((game) => game._id === bet.game),
            id: bet._id,
            timestamp: dateToHourAndMinute(bet.timestamp),
            betAmount: formatCurrency(Numbers.toFloat(bet.betAmount)),
            winAmount: formatCurrency(Numbers.toFloat(bet.winAmount)),
            isWon: bet.isWon,
            payout: `${formatCurrency(
              Numbers.toFloat(bet.winAmount / bet.betAmount)
            )}x`,
            currency: bet.currency,
          };
        }),
        onTableDetails: onTableDetails ? onTableDetails : null,
      },
      biggest_win_bets: {
        ...this.state.biggest_win_bets,
        titles: copy.TABLE.BIGGEST_WIN_BETS.ITEMS,
        rows: biggest_winners_bets.map((bet) => {
          return {
            game: games.find((game) => game._id === bet.game._id),
            id: bet._id,
            username:
              bet.user.username.length > 10
                ? bet.user.username.substring(0, 4) +
                  "..." +
                  bet.user.username.substring(
                    bet.user.username.length - 3,
                    bet.user.username.length
                  )
                : bet.user.username,
            timestamp: dateToHourAndMinute(bet.bet.timestamp),
            betAmount: formatCurrency(Numbers.toFloat(bet.bet.betAmount)),
            winAmount: formatCurrency(Numbers.toFloat(bet.bet.winAmount)),
            isWon: bet.bet.isWon,
            payout: `${formatCurrency(
              Numbers.toFloat(bet.bet.winAmount / bet.bet.betAmount)
            )}x`,
            currency: bet.currency._id,
          };
        }),
      },
    });
  };

  render() {
    const { isLoading, isListLoading, gameMetaName, games } = this.state;

    return (
      <div styleName="container">
        {isLoading ? (
          <SkeletonTheme
            color={getSkeletonColors().color}
            highlightColor={getSkeletonColors().highlightColor}
          >
            <div styleName="lastBets" style={{ opacity: "0.5" }}>
              <div styleName="skeleton-tabs">
                <Skeleton height={40} />
              </div>
            </div>
          </SkeletonTheme>
        ) : (
          <div styleName="lastBets">
            <Tabs
              selected={this.state.view}
              options={this.state.options}
              onSelect={this.handleTabChange}
              color="primary"
            />
            <div styleName="filters">
              <div styleName="bets-dropdown">
                <SelectBox
                  onChange={(e) => this.changeViewBets(e)}
                  options={views}
                  value={this.state.view_amount}
                />
              </div>
            </div>
          </div>
        )}
        <Table
          rows={this.state[this.state.view].rows}
          titles={this.state[this.state.view].titles}
          fields={this.state[this.state.view].fields}
          showRealTimeLoading={this.state.view == "all_bets" ? true : false}
          size={this.state.view_amount.value}
          games={games
            .filter(function (g) {
              return g.metaName == gameMetaName;
            })
            .map(function (g) {
              return g;
            })}
          isLoading={isListLoading}
          onTableDetails={this.state[this.state.view].onTableDetails}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language,
  };
}

export default connect(mapStateToProps)(LastBets);
