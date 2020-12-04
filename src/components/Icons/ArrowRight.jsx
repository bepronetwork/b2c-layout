import React, { Component } from "react";
import "./index.css";

export default class ArrowRight extends Component {
  render() {
    return (
      <svg
        transform="rotate(-90)"
        viewBox="0 0 32 32"
        width="14px"
        height="14px"
      >
        <path
          styleName="arrow"
          d="M16 16.118l-8.203-6.736-3.189 3.881 11.392 9.355 11.392-9.355-3.189-3.881-8.203 6.736z"
        />
      </svg>
    );
  }
}
