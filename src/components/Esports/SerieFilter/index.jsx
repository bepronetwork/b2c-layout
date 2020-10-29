import React, { Component } from "react";
import { Typography, MoreIcon, Modal } from "components";
import CloseIcon from "components/Icons/CloseCross";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { getSkeletonColors } from "../../../lib/helpers";
import { Shield, SerieFilterMore } from "components/Esports";
import { connect } from "react-redux";
import classNames from "classnames";
import _ from "lodash";
import "./index.css";

class SerieFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serieFilter: [],
      moreWindowOpen: false
    };
  }

  handleFilterClick = async id => {
    const { onSerieFilter } = this.props;
    const { serieFilter } = this.state;
    const exist = serieFilter.some(el => el === id);

    if (exist) {
      const index = serieFilter.indexOf(id);
      serieFilter.splice(index, 1);
    } else {
      serieFilter.push(id);
    }

    this.setState({ serieFilter });

    onSerieFilter(serieFilter);
  };

  handleCleanFilterClick = async () => {
    const { onCleanSerieFilter } = this.props;
    const { serieFilter } = this.state;

    serieFilter.splice(0, serieFilter.length);

    this.setState({ serieFilter });

    onCleanSerieFilter(serieFilter);
  };

  handleFilterMoreClick = async serieFilter => {
    const { onSerieFilter } = this.props;

    this.setState({ serieFilter });

    onSerieFilter(serieFilter);

    this.handleFilterMoreModal();
  };

  handleFilterMoreModal = async () => {
    const { moreWindowOpen } = this.state;

    this.setState({ moreWindowOpen: !moreWindowOpen });
  };

  renderFilterMoreModal = () => {
    const { games, gameFilter } = this.props;
    const { moreWindowOpen, serieFilter } = this.state;

    return moreWindowOpen == true ? (
      <Modal onClose={this.handleFilterMoreModal}>
        <SerieFilterMore
          serieFilter={serieFilter}
          games={games}
          onFilterClick={this.handleFilterMoreClick}
          gameFilter={gameFilter}
        />
      </Modal>
    ) : null;
  };

  renderOptions() {
    const { serieFilter } = this.state;
    const { games, gameFilter } = this.props;

    let series = [];

    games
      .filter(
        game => gameFilter.includes(game.external_id) || gameFilter.length == 0
      )
      .slice(0, 3)
      .map(game => {
        if (!_.isEmpty(game.series)) {
          const exist = serieFilter.some(el => el === game.series[0].id);
          const styles = classNames("tournament", {
            tourSelected: exist
          });
          series.push(
            <li
              styleName={styles}
              onClick={() => this.handleFilterClick(game.series[0].id)}
              key={game.series[0].id}
            >
              <Shield image={game.image} size={"small"} isFull={true} />
              <div styleName="tournament-name">
                <Typography
                  variant={"x-small-body"}
                  color={"white"}
                >{`${game.series[0].league.name} - ${game.series[0].full_name}`}</Typography>
              </div>
            </li>
          );
        }
      });

    if (series.length > 0) {
      series.push(
        <div
          styleName="tournament-more"
          onClick={() => this.handleFilterMoreModal()}
        >
          <MoreIcon />
        </div>
      );
    }

    return series;
  }

  render() {
    const { serieFilter } = this.state;
    const { isLoading } = this.props;

    return (
      <div>
        {this.renderFilterMoreModal()}
        <div styleName="filter-tournaments">
          <div styleName="all" onClick={() => this.handleCleanFilterClick()}>
            <Typography variant={"x-small-body"} color={"white"}>
              All Tournaments
            </Typography>
            {serieFilter.length ? (
              <span styleName="all-selected">
                <CloseIcon />
              </span>
            ) : null}
          </div>
          <ul>
            {isLoading ? (
              <SkeletonTheme
                color={getSkeletonColors().color}
                highlightColor={getSkeletonColors().highlightColor}
              >
                <div style={{ opacity: "0.5" }}>
                  <li styleName="tournament">
                    <Skeleton
                      circle={true}
                      height={30}
                      width={30}
                      style={{ marginRight: 12 }}
                    />
                    <Skeleton height={20} width={150} />
                  </li>
                  <li styleName="tournament">
                    <Skeleton
                      circle={true}
                      height={30}
                      width={30}
                      style={{ marginRight: 12 }}
                    />
                    <Skeleton height={20} width={120} />
                  </li>
                  <li styleName="tournament">
                    <Skeleton
                      circle={true}
                      height={30}
                      width={30}
                      style={{ marginRight: 12 }}
                    />
                    <Skeleton height={20} width={100} />
                  </li>
                </div>
              </SkeletonTheme>
            ) : (
              this.renderOptions()
            )}
          </ul>
        </div>
        <div styleName="filter-tournaments-mobile">
          <div
            styleName="tournament-more"
            onClick={() => this.handleFilterMoreModal()}
          >
            <Typography variant={"x-small-body"} color={"white"}>
              Filters
            </Typography>{" "}
            <MoreIcon />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language
  };
}

export default connect(mapStateToProps)(SerieFilter);
