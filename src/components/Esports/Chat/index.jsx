import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import "./index.css";

class Chat extends Component {
  render() {
    const { streaming } = this.props;
    const channel = streaming.substring(streaming.lastIndexOf("=") + 1);

    return (
      <iframe
        frameborder="0"
        scrolling="no"
        id="chat_embed"
        src={`https://www.twitch.tv/embed/${channel}/chat?parent=${window.location.hostname}&te-theme=dark&darkpopout`}
        height="500"
        width="100%"
      ></iframe>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language
  };
}

export default connect(mapStateToProps)(Chat);
