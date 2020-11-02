import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal } from "components";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import {
  Market,
  ScoreBoard,
  SideMenu,
  Live,
  BetSlip,
  BetSlipFloat,
  Player,
} from "components/Esports";
import { getMatch } from "controllers/Esports/EsportsUser";
import { getSkeletonColors } from "../../../lib/helpers";
import "./index.css";

class MatchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      match: null,
      isLoading: true,
      openPlayer: false,
      player: null,
      isLive: false,
    };
  }

  componentDidMount() {
    this.projectData(this.props);
  }

  componentWillReceiveProps(props) {
    this.projectData(props);
  }

  projectData = async (props) => {
    const { params } = props.match;
    let match = null;

    const matchParam = String(params.match);
    if (matchParam != null) {
      const matchId = parseInt(matchParam.split(/[-]+/).pop());
      match = await getMatch(matchId);
    }

    const isLive = match.status === "live";

    this.setState({
      match,
      isLoading: false,
      isLive,
    });
  };

  handlePlayerClick = async (player) => {
    this.setState({
      openPlayer: true,
      player,
    });
  };

  handlePlayerModal = async () => {
    const { openPlayer } = this.state;

    this.setState({ openPlayer: !openPlayer });
  };

  renderPlayerModal = () => {
    const { openPlayer, match, player } = this.state;

    return openPlayer == true ? (
      <Modal onClose={this.handlePlayerModal}>
        <Player match={match} player={player} />
      </Modal>
    ) : null;
  };

  render() {
    const { onHandleLoginOrRegister } = this.props;
    const { match, isLoading, isLive } = this.state;

    return (
      <div styleName="root">
        {this.renderPlayerModal()}
        <BetSlipFloat onHandleLoginOrRegister={onHandleLoginOrRegister} />
        <div styleName="main">
          {isLoading ? (
            <SkeletonTheme
              color={getSkeletonColors().color}
              highlightColor={getSkeletonColors().highlightColor}
            >
              <div style={{ opacity: "0.5" }}>
                <Skeleton height={70} width={"100%"} />
              </div>
            </SkeletonTheme>
          ) : (
            <ScoreBoard match={match} />
          )}
        </div>
        <div styleName="painel">
          <div styleName="left">
            {isLoading ? (
              <SkeletonTheme
                color={getSkeletonColors().color}
                highlightColor={getSkeletonColors().highlightColor}
              >
                <div style={{ opacity: "0.5" }}>
                  <Skeleton height={200} width={"100%"} />
                </div>
              </SkeletonTheme>
            ) : (
              <SideMenu match={match} onPlayerClick={this.handlePlayerClick} />
            )}
          </div>
          {isLoading ? (
            <SkeletonTheme
              color={getSkeletonColors().color}
              highlightColor={getSkeletonColors().highlightColor}
            >
              <div style={{ opacity: "0.5" }}>
                <div styleName="middle">
                  <Skeleton height={200} width={"100%"} />
                </div>
              </div>
            </SkeletonTheme>
          ) : isLive == true ? (
            <div styleName={isLive == true ? "isLive middle" : "middle"}>
              <Live streaming={match.live_embed_url} match={match} />
            </div>
          ) : match.status == "finished" || match.status == "settled" ? (
            <div />
          ) : (
            <div>
              <Market match={match} />
            </div>
          )}
          <div styleName="right">
            {isLoading ? (
              <SkeletonTheme
                color={getSkeletonColors().color}
                highlightColor={getSkeletonColors().highlightColor}
              >
                <div style={{ opacity: "0.5" }}>
                  <Skeleton height={100} width={"100%"} />
                </div>
              </SkeletonTheme>
            ) : (
              <BetSlip
                match={match}
                onHandleLoginOrRegister={onHandleLoginOrRegister}
              />
            )}
          </div>
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

export default connect(mapStateToProps)(MatchPage);
