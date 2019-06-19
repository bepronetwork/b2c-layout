import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Typography } from "components";
import classNames from "classnames";

import "./index.css";

export default class GameCard extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    edge: PropTypes.number,
    image: PropTypes.string,
    path: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    width: PropTypes.string,
    color: PropTypes.oneOf(["cornflower-blue", "dodger-blue", "malachite"])
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
    const { title, edge, path, children, width, color } = this.props;

    const imageStyles = classNames("image-container", {
      [color]: true
    });

    return (
      <div styleName="root">
        <Link to={path} styleName="button">
          <div styleName={imageStyles}>
            <div styleName="icon" style={{ width }}>
              {children || null}
            </div>
          </div>
          <div styleName="labels">
            <div styleName="title">
              <Typography variant="h4" weight="semi-bold" color="white">
                {title}
              </Typography>
            </div>
            <Typography variant="small-body" color="white">
              {edge ? `${edge}% Edge` : ""}
            </Typography>
          </div>
        </Link>
      </div>
    );
  }
}
