import React from "react";
import PropTypes from "prop-types";

const slotsLine = ({ svgClass, polylineClass, points }) => {
  return (
    <svg viewBox="0 10 150 100" preserveAspectRatio="none" className={svgClass}>
      <polyline
        points={points}
        // points="12 15, 31 15, 50 50, 69 85, 87 50, 100 42"
        shapeRendering="geometricPrecision"
        className={polylineClass}
      />
    </svg>
  );
};

slotsLine.propTypes = {
  svgClass: PropTypes.string.isRequired,
  polylineClass: PropTypes.string.isRequired,
  points: PropTypes.string.isRequired
};

export default slotsLine;
