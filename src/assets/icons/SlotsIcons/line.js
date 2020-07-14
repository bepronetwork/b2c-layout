import React from "react";
import PropTypes from "prop-types";

const slotsLine = ({ svgClass, polylineClass, points, viewBox }) => {
  return (
    <svg viewBox={viewBox} preserveAspectRatio="none" className={svgClass}>
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
  points: PropTypes.string.isRequired,
  viewBox: PropTypes.string.isRequired
};

export default slotsLine;
