import React from "react";

import Line from "components/SlotsLines";
import styles from "../SlotsGame/index.css";

const funcHandle = (
  arrTest,
  insert1,
  insert2,
  insert3,
  insert4,
  insert5,
  numb1,
  numb2,
  numb3,
  numb4,
  numb5
) => {
  const option4 =
    insert1 === numb1 &&
    insert2 === numb2 &&
    insert3 === numb3 &&
    insert4 === numb4 &&
    insert5 === numb5;

  return option4;
};

const HandleLines = ({
  arrayResult,
  insertion1,
  insertion2,
  insertion3,
  insertion4,
  insertion5
}) => {
  return (
    <div className={styles.lineTest}>
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        18,
        19,
        20,
        19,
        18
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 15,  49.6  92, 82 15"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        19,
        19,
        18,
        18,
        18
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 55, 33 55,  49.6  15, 65.5 15, 82 15"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        19,
        19,
        19,
        18,
        18
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 55, 33 55, 49.6 15, 65.5 15, 82 15"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        19,
        19,
        18,
        19,
        18
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 55, 33 55,  49.6  15, 65.5 55, 82 15"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        19,
        19,
        19,
        19,
        19
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 55,  49.6  55, 82 55"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        19,
        18,
        18,
        18,
        18
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 55, 18 55, 33 15, 82 15"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        19,
        18,
        18,
        18,
        19
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 55, 18 55, 33 15, 65.5 15, 82 55"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        19,
        18,
        19,
        19,
        19
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 55, 33 15,  49.6  55, 65.5 55, 82 55"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        19,
        18,
        19,
        19,
        18
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 55, 33 15,  49.6  55, 65.5 55, 82 15"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        19,
        18,
        19,
        18,
        19
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 55, 33 15,  49.6  55, 65.5 15, 82 55"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        19,
        18,
        18,
        19,
        18
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 55, 33 15,  49.6  15, 65.5 55, 82 15"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        19,
        18,
        18,
        19,
        19
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 55, 33 15,  49.6  15, 65.5 55, 82 55"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        19,
        19,
        18,
        18,
        19
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 55, 33 55,  49.6  15, 65.5 15, 82 55"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        19,
        19,
        18,
        19,
        19
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 55, 33 55,  49.6  15, 65.5 55, 82 55"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        19,
        18,
        19,
        18,
        18
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 55, 33 15,  49.6  55, 65.5 15, 82 15"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        19,
        19,
        19,
        18,
        19
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 55, 33 55, 48.4 55, 65.5 15, 82 55"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        19,
        19,
        19,
        19,
        18
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 55, 33 55,  49.6  55, 65.5 55, 82 15"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        18,
        18,
        18,
        18,
        18
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 15,  49.6  15, 82 15"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        18,
        18,
        18,
        18,
        19
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 15, 33 15,  49.6  15, 64 15, 82 55"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        18,
        18,
        19,
        19,
        18
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 15, 33 15,  49.6  55, 64 55, 82 15"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        18,
        18,
        19,
        19,
        19
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 15, 33 15,  49.6  55, 64 55, 82 55"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        20,
        20,
        20,
        20,
        20
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 90, 18 90, 33 90, 82 90"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        18,
        19,
        19,
        19,
        19
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 15, 33 55, 33 55, 82 55"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        18,
        19,
        19,
        19,
        18
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 15, 33 55,  49.6  55, 65.5 55, 82 15"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        18,
        19,
        19,
        18,
        18
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 15, 33 55,  49.6  55, 65.5 15, 82 15"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        18,
        19,
        19,
        18,
        19
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 15, 33 55,  49.6  55, 65.5 15, 82 55"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        18,
        19,
        18,
        19,
        18
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 15, 33 55, 33 55,  49.6  15, 65.5 55, 82 15"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        18,
        19,
        18,
        18,
        18
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 15, 33 55,  49.6  15, 65.5 15, 82 15"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        18,
        19,
        18,
        19,
        19
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 15, 33 55, 33 55,  49.6  15, 65.5 55, 82 55"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        18,
        19,
        18,
        18,
        19
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 15, 33 55, 33 55,  49.6  15, 65.5 15, 82 55"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        18,
        18,
        18,
        19,
        19
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 15, 33 15, 49.6 15, 65.5 55, 82 55"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        18,
        18,
        19,
        18,
        18
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 15, 33 15, 49.6 55, 65.5 15, 82 15"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        18,
        18,
        19,
        18,
        19
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 15, 33 15, 49.6 55, 65.5 15, 82 55"
          viewBox="0 5 100 100"
        />
      ) : null}
      {funcHandle(
        arrayResult,
        insertion1,
        insertion2,
        insertion3,
        insertion4,
        insertion5,
        18,
        18,
        18,
        19,
        18
      ) ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="18 15, 33 15, 49.6 15, 65.5 55, 82 15"
          viewBox="0 5 100 100"
        />
      ) : null}
    </div>
  );
};

export default HandleLines;
