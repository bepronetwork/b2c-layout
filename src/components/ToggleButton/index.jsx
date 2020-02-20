import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Typography from "../Typography";

import "./index.css";

export default class ToggleButton extends Component {
    static propTypes = {
        selected: PropTypes.string,
        size: PropTypes.oneOf(["medium", "auto", "full"]),
        differentBorders: PropTypes.bool,
        config: PropTypes.shape({
        left: PropTypes.shape({
            value: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            color: PropTypes.string
        }),
        right: PropTypes.shape({
            value: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired
        })
        }).isRequired,
        onSelect: PropTypes.func.isRequired
    };

    static defaultProps = {
        selected: null,
        size: "auto",
        differentBorders: false
    };

    constructor(props) {
        super(props);

        const {
        selected,
        config: {
            left: { value }
        }
        } = props;

        this.state = {
        selected: selected || value
        };
    }

    onClick = side => () => {
        const { onSelect } = this.props;

        this.setState({ selected: side }, () => {
        onSelect(side);
        });
    };

    render() {
        const {
        size,
        differentBorders,
        config: { left, right }
        } = this.props;
        const { selected } = this.state;

        const leftToggleStyles = classNames("toggle", {
        "toggle-left": differentBorders,
        selected: selected === left.value,
        [size]: true,
        [left.color]: left.color && selected === left.value ? true : null
        });

        const rightToggleStyles = classNames("toggle", {
        "toggle-right": differentBorders,
        selected: selected === right.value,
        [size]: true,
        [right.color]: right.color && selected === right.value ? true : null
        });

        return (
        <div styleName="root">
            <button
            type="button"
            disabled={left.disabled}
            styleName={leftToggleStyles}
            onClick={this.onClick(left.value)}
            >
            <Typography weight="semi-bold" color="white" variant="small-body">
                {left.title} <strong>{left.disabled ? 'Soon' : null}</strong>
            </Typography>
            </button>
            <button
            type="button"
            styleName={rightToggleStyles}
            disabled={right.disabled}
            onClick={this.onClick(right.value)}
            >
                {!right.disabled ?
                    <Typography weight="semi-bold" color="white" variant="small-body">
                        {right.title} 
                    </Typography>
                : 
                    <Typography weight="body" color="casper" variant="small-body">
                         {right.title} soon
                    </Typography>
                }
            </button>
        </div>
        );
    }
}
