import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Typography, Info } from "components";
import { connect } from "react-redux";
import "./index.css";
import { CopyText } from "../../copy";

class GameCard extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    edge: PropTypes.number,
    image: PropTypes.string,
    path: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    width: PropTypes.string
  };

  static defaultProps = {
    edge: null,
    image: "",
    width: null,
    color: "firefly"
  };

  renderImage = () => {
    const { image } = this.props;

    if (!image) {
      return <div styleName="image-container" />;
    }

    return (
      <div styleName="image-container">
        <img alt="menu" src={image} />
      </div>
    );
  };

  render() {
    const { title, edge, path, image_url, background_url, ln } = this.props;
    const copy = CopyText.shared[ln];
    const imageStyles = "image-container dice-background-color";
    return (
      <div styleName="root">
        <Link to={path} styleName="button">
          <div
            styleName={imageStyles}
            style={{
              background: background_url
                ? "url(" + background_url + ") center center / cover no-repeat"
                : null
            }}
          >
            <div styleName="icon">
              <img src={image_url} styleName="game-icon" />
            </div>
          </div>
        </Link>
        <div styleName="title">
          <div styleName="name">
            <Typography variant="x-small-body" weight="semi-bold" color="white">
              {title}
            </Typography>
          </div>
          <span styleName="info">
            <Info text={edge >= 0 ? `${copy.EDGE_NAME}: ${edge}%` : ""} />
          </span>
        </div>
        <div styleName="title">
          <div styleName="prov">
            <Typography variant={"x-small-body"} color={"grey"}>
              BetProtocol Games
            </Typography>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ln: state.language
  };
}

export default connect(mapStateToProps)(GameCard);
