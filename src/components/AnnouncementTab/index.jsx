import React, { Component } from "react";
import { Typography } from "components";
import "./index.css";

class AnnouncementTab extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { topBar } = this.props;
    if (!topBar) {
      return null;
    }

    const { backgroundColor, textColor, text, isActive } = topBar;
    if (!isActive) {
      return null;
    }
    return (
      <div styleName="container" style={{ backgroundColor: backgroundColor }}>
        <h6 styleName="announcement-text" style={{ color: textColor }}>
          {" "}
          {text}
        </h6>
      </div>
    );
  }
}

export default AnnouncementTab;
