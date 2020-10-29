import React, { Component } from "react";
import { OddsTable } from "components/Esports";
import { connect } from "react-redux";
import _ from "lodash";
import "./index.css";

class Live extends Component {
  render() {
    const { streaming, match } = this.props;

    return (
      <div>
        <div styleName="iframe">
          <iframe
            src={`${streaming}&muted=true&parent=${window.location.hostname}`}
            width="100%"
            frameborder="true"
            scrolling="true"
            allowfullscreen="true"
          ></iframe>
        </div>
        <div styleName="odds">
          <OddsTable match={match} />
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

export default connect(mapStateToProps)(Live);
