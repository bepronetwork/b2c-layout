import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./index.css";

const Undo = ({ color }) => {
  const styles = classNames("undo", {
    [color]: true
  });

  return (
    <svg id="icon-undo" viewBox="0 0 32 32" width="100%" height="100%">
      <path
        styleName={styles}
        d="M 0.23 15.135 l 7.5 -7.5 c 0.141 -0.14 0.335 -0.227 0.55 -0.227 c 0.43 0 0.778 0.347 0.78 0.777 v 2.315 h 13.205 c 5.08 0 9.5 3.885 9.725 8.965 c 0.005 0.113 0.008 0.245 0.008 0.377 c 0 1.531 -0.369 2.976 -1.022 4.25 l 0.024 -0.053 c -0.177 0.332 -0.521 0.555 -0.917 0.555 c -0.386 0 -0.723 -0.211 -0.901 -0.524 l -0.003 -0.005 c -1.642 -2.843 -4.666 -4.726 -8.129 -4.73 h -12.001 v 3.85 c 0 0.001 0 0.001 0 0.002 c 0 0.431 -0.349 0.78 -0.78 0.78 c -0.215 0 -0.409 -0.087 -0.55 -0.227 l -7.5 -7.5 c -0.139 -0.141 -0.224 -0.334 -0.224 -0.548 c 0 -0.218 0.09 -0.416 0.234 -0.557 l 0 0 Z"
      />
    </svg>
  );
};

Undo.propTypes = {
  color: PropTypes.oneOf(["casper", "pickled-bluewood"])
};

Undo.defaultProps = {
  color: "casper"
};

export default Undo;
