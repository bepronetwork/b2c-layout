import React, { Component } from "react";
import { connect } from "react-redux";
import { Typography, Button } from "components";
import { Shield } from "components/Esports";
import classNames from "classnames";
import "./index.css";

class SerieFilterMore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serieFilter: [],
    };
  }

  componentDidMount() {
    this.projectData(this.props);
  }

  componentWillReceiveProps(props) {
    this.projectData(props);
  }

  projectData = async (props) => {
    const { serieFilter } = props;

    this.setState({
      serieFilter,
    });
  };

  handleFilterClick = async (id) => {
    const { serieFilter } = this.state;
    const exist = serieFilter.some((el) => el === id);

    if (exist) {
      const index = serieFilter.indexOf(id);
      serieFilter.splice(index, 1);
    } else {
      serieFilter.push(id);
    }

    this.setState({ serieFilter });
  };

  handleSaveFilterClick = async () => {
    const { onFilterClick } = this.props;
    const { serieFilter } = this.state;

    onFilterClick(serieFilter);
  };

  render() {
    const { games, gameFilter } = this.props;
    const { serieFilter } = this.state;

    return (
      <div styleName="more">
        <div styleName="top-row">
          <Typography variant={"small-body"} weight={"bold"} color={"white"}>
            Select your tournaments
          </Typography>
        </div>
        <div styleName="more-content">
          <div styleName="box">
            {games
              .filter(
                (game) =>
                  gameFilter.includes(game.external_id) ||
                  gameFilter.length == 0
              )
              .map((game) => {
                return (
                  <div styleName="more-group" data-order="1">
                    <div styleName="more-heading">
                      <Shield image={game.image} size={"large"} isFull={true} />
                      <Typography
                        variant={"small-body"}
                        weight={"bold"}
                        color={"white"}
                      >
                        {game.name}
                      </Typography>
                    </div>
                    <div styleName="more-series">
                      <ul>
                        {game.series.map((serie) => {
                          const exist = serieFilter.some(
                            (el) => el === serie.id
                          );
                          const styles = classNames("tournament", {
                            tourSelected: exist,
                          });
                          return (
                            <li
                              styleName={styles}
                              onClick={() => this.handleFilterClick(serie.id)}
                            >
                              <div styleName="tournament-name">
                                <Typography
                                  variant={"x-small-body"}
                                  color={"white"}
                                >{`${serie.league.name} - ${serie.full_name}`}</Typography>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div styleName="bottom-row">
          <Button
            size={"x-small"}
            theme="primary"
            onClick={() => this.handleSaveFilterClick()}
          >
            <Typography color={"fixedwhite"} variant={"x-small-body"}>
              Save my filters
            </Typography>
          </Button>
        </div>
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

export default connect(mapStateToProps)(SerieFilterMore);
