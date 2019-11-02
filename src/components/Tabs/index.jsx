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
        onSelect: PropTypes.func.isRequired,
        spacing: PropTypes.string
    };

    handleTabClick = name => {
        const { onSelect } = this.props;

        if (onSelect) onSelect(name);
    };

    renderTabs = () => {
        const { options, selected, spacing } = this.props;

        if (!options) {
        return null;
        }

        let spacingValue = !_.isEmpty(spacing) ? spacing + "px" : "20px";

        const selectedTab = selected || options[0].value;

        return map(options, ({ value, label }) => (
        <div key={value} style={{"paddingRight" : spacingValue}}>
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
