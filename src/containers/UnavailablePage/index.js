import React, { Component } from "react";
import "./index.css";
import { Typography } from "components";
import { CopyText } from "../../copy";

class UnavailablePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.projectData();
  }

  isAvailable = () => {
    return false;
  };

  render() {
    const { app } = this.props;
    const { ln } = this.props;
    const copy = CopyText.homepage[ln];

    if (!app) {
      return null;
    }

    if (this.isAvailable()) {
      return null;
    }

    return (
      <div styleName="root">
        <div styleName="container">
          <Typography variant={"h2"} color={"white"}>
            {" "}
            {copy.CONTAINERS.UNAVAILABLE.TYPOGRAPHY[0]}{" "}
          </Typography>
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

export default connect(mapStateToProps)(UnavailablePage);
