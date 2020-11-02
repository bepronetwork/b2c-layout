import React from "react";
import PropTypes from "prop-types";

const slotsLine = ({ svgClass, polylineClass, points, viewBox }) => {
  return (
    <svg viewBox={viewBox} preserveAspectRatio="none" className={svgClass}>
      <polyline
        points={points}
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
  viewBox: PropTypes.string.isRequired,
};

export default slotsLine;
