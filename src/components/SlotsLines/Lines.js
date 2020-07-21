import React from "react";
import PropTypes from "prop-types";

import Line from "components/SlotsLines";
import styles from "../SlotsGame/index.css";

const HandleLines = ({ insertion1, insertion2 }) => {
  return (
    <div className={styles.lineTest}>
      {insertion1 === 18 && insertion2 === 19 ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 15, 47.4 92, 76 15"
          viewBox="0 5 100 100"
        />
      ) : null}
      {insertion1 === 18 && insertion2 === 19 ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 15, 18 25, 47.4 50, 76 15"
          viewBox="0 5 100 100"
        />
      ) : null}
      {insertion1 === 19 && insertion2 === 19 ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 50, 47.4 50, 76 50"
          viewBox="0 5 100 100"
        />
      ) : null}
      {insertion1 === 19 && insertion2 === 18 ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 50, 18 50, 33 15, 76 15"
          viewBox="0 5 100 100"
        />
      ) : null}
      {insertion1 === 18 && insertion2 === 18 ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 15, 47.4 15, 76 15"
          viewBox="0 5 100 100"
        />
      ) : null}
    </div>
  );
};

HandleLines.propTypes = {
  insertion1: PropTypes.number.isRequired,
  insertion2: PropTypes.number.isRequired
};

export default HandleLines;
