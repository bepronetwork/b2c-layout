import React, { Component } from "react";
import PropTypes from "prop-types";
import Typography from "components/Typography";
import ArrowDown from "components/Icons/ArrowDown";
import ArrowUp from "components/Icons/ArrowUp";
import Coins from "components/Icons/Coins";
import Logout from "components/Icons/Logout";
import { map } from "lodash";

import "./index.css";

export default class UserMenu extends Component {
    
    static propTypes = {
        username: PropTypes.string.isRequired,
        onLogout: PropTypes.func.isRequired,
        onCashier: PropTypes.func.isRequired
    };

    state = {
        open: false
    };

    componentDidUpdate() {
        const { open } = this.state;

        if (open) {
        document.addEventListener("mousedown", this.handleClickOutside);
        } else {
        document.removeEventListener("mousedown", this.handleClickOutside);
        }
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    getOptions = () => {
        const { onLogout, onCashier } = this.props;

        return [
        {
            value: "cashier",
            label: "Cashier",
            icon: <Coins />,
            action: onCashier
        },
        { value: "logout", label: "Logout", icon: <Logout />, action: onLogout }
        ];
    };

    handleClickOutside = event => {
        const isOutsideClick = !this.optionsRef.contains(event.target);
        const isLabelClick = this.labelRef.contains(event.target);

        if (isOutsideClick && !isLabelClick) {
        this.setState({ open: false });
        }
    };

    handleLabelClick = () => {
        const { open } = this.state;

        this.setState({ open: !open });
    };

    renderLabel() {
        const { open } = this.state;
        const { username } = this.props;

        return (
        <div styleName="label">
            <Typography color="white">{username}</Typography>
            {open ? <ArrowUp /> : <ArrowDown />}
        </div>
        );
    }

    renderOptionsLines = () => {
        return map(this.getOptions(), ({ value, label, icon, action }) => (
        <button
            styleName="option"
            key={value}
            id={value}
            onClick={action}
            type="button"
        >
            {icon}
            <Typography color="casper">{label}</Typography>
        </button>
        ));
    };

    renderOptions() {
        const { open } = this.state;

        if (!open) return null;

        return (
        <div styleName="options">
            <span styleName="triangle" />

            {this.renderOptionsLines()}
        </div>
        );
    }

    render() {
        return (
        <div styleName="root">
            <button
            ref={el => {
                this.labelRef = el;
            }}
            onClick={this.handleLabelClick}
            type="button"
            >
            {this.renderLabel()}
            </button>

            <div
            ref={el => {
                this.optionsRef = el;
            }}
            >
            {this.renderOptions()}
            </div>
        </div>
        );
    }
}
