import map from "lodash/map";
import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from 'lodash';
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
        const filteredOptions = options.filter(o => !o.disabled);

        if (!filteredOptions) {
        return null;
        }

        const selectedTab = selected || filteredOptions[0].value;

        return (
            <div styleName="tabs">
             {   filteredOptions.map(option => (

                    <Tab
                        label={option.label}
                        name={option.value}
                        icon={option.icon}
                        onClick={this.handleTabClick}
                        selected={selectedTab === option.value}
                    />
            ))
            }
        </div>
        )
    };

    render() {
        return this.renderTabs();
    }
}
