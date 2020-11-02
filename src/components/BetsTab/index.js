import React, { Component } from "react";
import { connect } from "react-redux";
import { Numbers } from "../../lib/ethereum/lib";
import {
  dateToHourAndMinute,
  getGames,
  getSkeletonColors,
} from "../../lib/helpers";
import { getGames as getVideoGames } from "controllers/Esports/EsportsUser";
import { SelectBox, Table, Tabs } from "components";
import { formatCurrency } from "../../utils/numberFormatation";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { apiUrlEsports } from "../../lib/api/apiConfig";
import { CopyText } from "../../copy";
import _ from "lodash";
import "./index.css";

const views = [
  { text: 10, value: 10 },
  { text: 25, value: 25 },
  { text: 50, value: 50 },
  { text: 100, value: 100 },
];
const allGames = { text: "All Games", value: "all_games" };

const stateOptions = Object.freeze({
  won: { text: "Won", color: "green" },
  lost: { text: "Lost", color: "red" },
  pending: { text: "Pending", color: "primaryLight" },
});

const typeOptions = Object.freeze({
  simple: { text: "Simple", color: "primaryLight" },
  multiple: { text: "Multiple", color: "primaryDark" },
});

const rows = {
  casino: {
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
        value: "timestamp",
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
  esports: {
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
        value: "timestamp",
      },
      {
        value: "winAmount",
        dependentColor: true,
        condition: "isWon",
        currency: true,
      },
      {
        value: "type",
        isStatus: true,
      },
      {
        value: "state",
        isStatus: true,
      },
    ],
    rows: [],
  },
};

const defaultProps = {
  casino: rows.casino,
  esports: rows.esports,
  casinoRows: rows.casino.rows,
  esportsRows: rows.esports.rows,
  view: "casino",
  view_amount: views[0],
  gamesOptions: [],
  casinoGamesOptions: [],
  esportsGamesOptions: [],
  games: [],
  casinoGames: [],
  esportsGames: [],
  options: [],
  view_game: allGames,
  isLoading: true,
  isListLoading: true,
  isEsportsEnabled: false,
};

class BetsTab extends Component {
  constructor(props) {
    super(props);
    this.state = defaultProps;
  }

  componentDidMount() {
    const { isCurrentPath } = this.props;

    if (isCurrentPath) {
      this.projectData(this.props);
    }
  }

  componentWillReceiveProps(props) {
    const { isCurrentPath } = props;
    if (props !== this.props && isCurrentPath) {
      this.projectData(props);
    }
  }

  projectData = async (props, options = null) => {
    let { profile, ln, onTableDetails } = props;
    let { view, view_amount, view_game, casinoRows, esportsRows } = this.state;
    const copy = CopyText.betspage[ln];
    let casinoGames = [];
    let esportsGames = [];
    let games;
    let casinoGamesOptions = [];
    let esportsGamesOptions = [];

    casinoGames = await getGames();
    casinoGamesOptions.push(allGames);
    casinoGames.map((data) => {
      const n = {
        value: data.metaName,
        text: data.name,
      };
      casinoGamesOptions.push(n);
    });

    const isEsportsEnabled = _.isEmpty(apiUrlEsports) ? false : true;
    const images = require.context("assets/esports", true);

    if (isEsportsEnabled === true) {
      esportsGames = await getVideoGames();
      esportsGamesOptions.push(allGames);
      esportsGames = esportsGames
        .filter((g) => g.series.length > 0)
        .map((g) => {
          g.image_url = images("./" + g.slug + "-ico.png");
          return g;
        });
      esportsGames.map((data) => {
        const n = {
          value: data._id,
          text: data.name,
        };
        esportsGamesOptions.push(n);
      });
    }

    games = view == "casino" ? casinoGames : esportsGames;

    if (options) {
      view_amount = options.view_amount ? options.view_amount : view_amount;
      view_game = options.view_game ? options.view_game : view_game;
    }

    if (profile && !_.isEmpty(profile)) {
      if (view_game.value != "all_games") {
        if (view == "casino") {
          casinoRows = await profile.getMyBets({
            size: view_amount.value,
            game: games.find((g) => g.metaName === view_game.value)._id,
            tag: "casino",
          });
        } else if (view == "esports" && isEsportsEnabled === true) {
          esportsRows = await profile.getMyBets({
            size: view_amount.value,
            slug: games.find((g) => g._id === view_game.value).slug,
            tag: "esports",
          });
        }
      } else {
        casinoRows = await profile.getMyBets({
          size: view_amount.value,
          tag: "casino",
        });

        if (isEsportsEnabled === true) {
          esportsRows = await profile.getMyBets({
            size: view_amount.value,
            tag: "esports",
          });
        }
      }
    }

    this.setState({
      ...this.state,
      ...options,
      isLoading: false,
      isListLoading: false,
      games,
      casinoGames,
      esportsGames,
      gamesOptions: view == "casino" ? casinoGamesOptions : esportsGamesOptions,
      casinoGamesOptions,
      esportsGamesOptions,
      casinoRows,
      esportsRows,
      isEsportsEnabled,
      options: Object.keys(copy.TABLE)
        .filter(
          (key) =>
            key != "ESPORTS" || (key === "ESPORTS" && isEsportsEnabled === true)
        )
        .map((key) => {
          return {
            value: new String(key).toLowerCase(),
            label: copy.TABLE[key].TITLE,
          };
        }),
      casino: {
        ...this.state.casino,
        titles: copy.TABLE.CASINO.ITEMS,
        rows: casinoRows.map((bet) => {
          return {
            game: casinoGames.find((game) => game._id === bet.game),
            id: bet._id,
            timestamp: dateToHourAndMinute(bet.timestamp),
            betAmount: formatCurrency(Numbers.toFloat(bet.betAmount)),
            winAmount: formatCurrency(Numbers.toFloat(bet.winAmount)),
            currency: bet.currency,
            isWon: bet.isWon,
            payout: `${formatCurrency(
              Numbers.toFloat(bet.winAmount / bet.betAmount)
            )}x`,
          };
        }),
        onTableDetails: onTableDetails ? onTableDetails : null,
      },
      esports: {
        ...this.state.esports,
        titles: copy.TABLE.ESPORTS.ITEMS,
        rows: esportsRows.map((bet) => {
          let game;
          if (bet.videogames.length > 1) {
            let name = "";
            bet.videogames.map((g) => {
              name = name + " " + g.name;
            });

            game = {
              name: name,
              image_url: images("./all-ico.png"),
            };
          } else {
            game = {
              name: bet.videogames[0].name,
              image_url: images("./" + bet.videogames[0].slug + "-ico.png"),
            };
          }

          const state =
            bet.resolved == false
              ? stateOptions.pending
              : bet.isWon == true
              ? stateOptions.won
              : stateOptions.lost;
          const type =
            bet.type == "simple" ? typeOptions.simple : typeOptions.multiple;

          return {
            game: game,
            id: bet._id,
            timestamp: dateToHourAndMinute(bet.timestamp),
            betAmount: formatCurrency(Numbers.toFloat(bet.betAmount)),
            winAmount: formatCurrency(Numbers.toFloat(bet.winAmount)),
            currency: bet.currency,
            isWon: bet.isWon,
            type: type,
            state: state,
          };
        }),
        onTableDetails: onTableDetails ? onTableDetails : null,
      },
    });
  };

  setTimer = (options) => {
    this.projectData(this.props, options);
  };

  changeViewBets = ({ option }) => {
    this.setState({ ...this.state, isListLoading: true });
    this.setTimer({ view_amount: option });
  };

  changeViewGames = ({ option }) => {
    this.setState({ ...this.state, isListLoading: true });
    this.setTimer({ view_game: option });
  };

  handleTabChange = async (name) => {
    const {
      casinoGamesOptions,
      esportsGamesOptions,
      casinoGames,
      esportsGames,
    } = this.state;
    this.setState({
      ...this.state,
      view: name,
      gamesOptions: name == "casino" ? casinoGamesOptions : esportsGamesOptions,
      games: name == "casino" ? casinoGames : esportsGames,
    });
  };

  render() {
    const {
      games,
      gamesOptions,
      isLoading,
      isListLoading,
      view_game,
      options,
      view,
    } = this.state;

    return (
      <div styleName="container">
        {isLoading ? (
          <SkeletonTheme
            color={getSkeletonColors().color}
            highlightColor={getSkeletonColors().highlightColor}
          >
            <div styleName="lastBets" style={{ opacity: "0.5" }}>
              <Skeleton height={30} />
              <div styleName="filters">
                <div styleName="bets-dropdown-game">
                  <Skeleton width={100} height={30} />
                </div>
                <div styleName="bets-dropdown">
                  <Skeleton width={50} height={30} />
                </div>
              </div>
            </div>
          </SkeletonTheme>
        ) : (
          <div styleName="lastBets">
            <Tabs
              selected={view}
              options={options}
              onSelect={this.handleTabChange}
            />
            <div styleName="filters">
              <div styleName="bets-dropdown-game">
                <SelectBox
                  onChange={(e) => this.changeViewGames(e)}
                  options={gamesOptions}
                  value={this.state.view_game}
                />
              </div>

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
          rows={this.state[view].rows}
          titles={this.state[view].titles}
          fields={this.state[view].fields}
          size={this.state.view_amount.value}
          games={games
            .filter(function (g) {
              return (
                view_game.value == "all_games" || g.metaName == view_game.value
              );
            })
            .map(function (g) {
              return g;
            })}
          isLoading={isListLoading}
          onTableDetails={this.state[view].onTableDetails}
          tag={view}
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

export default connect(mapStateToProps)(BetsTab);
