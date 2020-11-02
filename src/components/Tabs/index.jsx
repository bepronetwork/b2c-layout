import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Tab from "./Tab";
import "./index.css";

export default class Tabs extends Component {
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    selected: PropTypes.string.isRequired,
    onSelect: PropTypes.func,
  };

  handleTabClick = (name) => {
    const { onSelect } = this.props;

    if (onSelect) onSelect(name);
  };

  renderTabs = () => {
    const { options, selected, style, variant } = this.props;
    const filteredOptions = options.filter((o) => !o.disabled);
    const styles = classNames("tabs", {
      "tabs-limit": filteredOptions.length > 3,
      fullBackground: style === "full-background",
    });
    const selectedTab = selected || filteredOptions[0].value;

    if (!filteredOptions) {
      return null;
    }

    return (
      <div styleName={styles}>
        {filteredOptions.map((option) => (
          <Tab
            label={option.label}
            name={option.value}
            icon={option.icon}
            onClick={this.handleTabClick}
            selected={selectedTab === option.value}
            style={style}
            variant={variant}
          />
        ))}
      </div>
    );
  };

  render() {
    return this.renderTabs();
  }
}
