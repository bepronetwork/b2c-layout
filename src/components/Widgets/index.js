import React from "react";
import BackgroundMusic from "./BackgroundMusic";
import "./index.css";
import Cache from "../../lib/cache/cache";

class Widgets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundMusic: null,
    };
  }

  componentDidMount() {
    this.projectData();
  }

  projectData() {
    let cacheCustomization = Cache.getFromCache("customization");

    if (!cacheCustomization) {
      cacheCustomization = {};
    }

    this.setState({ ...cacheCustomization });
  }

  render() {
    const { backgroundMusic } = this.state;

    return (
      <div>
        <BackgroundMusic mute={!backgroundMusic} />
      </div>
    );
  }
}

export default Widgets;
