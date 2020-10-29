import React, { Component } from "react";
import { Typography } from "components";
import "./index.css";

class TextContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { text, color, size, link } = this.props;

    return (
      <a href={link} styleName="text-container" target={"_blank"}>
        <Typography color={color} variant={size}>
          {text}
        </Typography>
      </a>
    );
  }
}

export default TextContainer;
