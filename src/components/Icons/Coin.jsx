import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { toLower } from "lodash";
import "./coin.css";

export default class Coin extends Component {
  static propTypes = {
    value: PropTypes.string,
  };

  static defaultProps = {
    value: "1",
  };

  render() {
    const { value } = this.props;

    const rootStyles = classNames("root", {
      [`coin${toLower(value)}`]: true,
    });

    console.log(rootStyles);

    return (
      <svg
        styleName={rootStyles}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 30.59 30.59"
      >
        <g>
          <path d="M17.61,3.59V.19A16,16,0,0,0,15.3,0,15.88,15.88,0,0,0,13,.19v3.4Z" />
        </g>
        <g>
          <path d="M8.65,5.38,6.25,3a16.54,16.54,0,0,0-1.77,1.5A16.54,16.54,0,0,0,3,6.25l2.4,2.4Z" />
        </g>
        <g>
          <path d="M3.59,13H.19A15.88,15.88,0,0,0,0,15.3a16,16,0,0,0,.19,2.31h3.4Z" />
        </g>
        <g>
          <path d="M5.38,21.94,3,24.34a14.78,14.78,0,0,0,1.5,1.77,15.46,15.46,0,0,0,1.77,1.5l2.4-2.4Z" />
        </g>
        <g>
          <path d="M13,27V30.4a14.14,14.14,0,0,0,4.62,0V27Z" />
        </g>
        <g>
          <path d="M21.94,25.21l2.4,2.4a14.1,14.1,0,0,0,3.27-3.27l-2.4-2.4Z" />
        </g>
        <g>
          <path d="M27,17.61H30.4a14.14,14.14,0,0,0,0-4.62H27Z" />
        </g>
        <g>
          <path d="M25.21,8.65l2.4-2.4a15.46,15.46,0,0,0-1.5-1.77A14.78,14.78,0,0,0,24.34,3l-2.4,2.4Z" />
        </g>
      </svg>
    );
  }
}
