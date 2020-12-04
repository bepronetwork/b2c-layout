import React, { Component } from "react";
import classNames from "classnames";
import "./index.css";

export default class Copy extends Component {
  render() {
    const { color } = this.props;

    const styles = classNames("sound", {
      [color]: true
    });

    return (
      <svg viewBox="0 0 32 32" width="16px" height="16px">
        <path styleName={styles} d="M30.1 9.845h-9.465v-7.905c0-1.071-0.869-1.94-1.94-1.94v0h-16.88c-1.071 0-1.94 0.869-1.94 1.94v0 16.88c0 1.071 0.869 1.94 1.94 1.94v0h7.905v9.465c0 0 0 0 0 0 0 0.98 0.795 1.775 1.775 1.775 0.002 0 0.004 0 0.005 0h18.6c0.98 0 1.775-0.795 1.775-1.775v0-18.605c0-0.98-0.795-1.775-1.775-1.775v0zM9.72 11.62v6.095h-6.795v-14.665h14.665v6.795h-6.090c-0.002 0-0.003 0-0.005 0-0.98 0-1.775 0.795-1.775 1.775 0 0 0 0 0 0v0zM28.825 28.95h-16.055v-16.055h16.055z" />
      </svg>
    );
  }
}
