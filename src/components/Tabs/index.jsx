import map from "lodash/map";
import React, { Component } from "react";
import PropTypes from "prop-types";
import Tab from "./Tab";

import "./index.css";

export default class Tabs extends Component {
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    selected: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired
  };

  handleTabClick = name => {
    const { onSelect } = this.props;

    if (onSelect) onSelect(name);
  };

  renderTabs = () => {
    const { options, selected } = this.props;

    if (!options) {
      return null;
    }

    const selectedTab = selected || options[0].value;

    return map(options, ({ value, label }) => (
      <div styleName="tab" key={value}>
        <Tab
          label={label}
          name={value}
          onClick={this.handleTabClick}
          selected={selectedTab === value}
        />
      </div>
    ));
  };

  render() {
    return <div styleName="root">{this.renderTabs()}</div>;
  }
}
