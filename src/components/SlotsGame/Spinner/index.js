import React from 'react';

// import { Container } from './styles';

const Spinner = () => {
  return (
    <div className={styles.spinnerContainer}>
    <div
      width="600px"
      height="300px"
      style={{ border: "1px solid #d3d3d3;" }}
      className={styles.lineTest}
    >
      {testBol[58] ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="9 13,12 14, 80 14"
          viewBox="0 3 100 100"
        />
      ) : null}

      {/* 1 */}
      {/* <Line
        svgClass={styles.classLine}
        polylineClass={styles.classSvg}
        points="9 10,12 15, 18 15, 47.4 92, 76 10"
        viewBox="0 5 100 100"
      /> */}

      {/* 3 */}
      {/* <Line
        svgClass={styles.classLine}
        polylineClass={styles.classSvg}
        points="9 20,12 15, 18 15, 33 55, 76 55"
        viewBox="0 5 100 100"
      /> */}

      {/* 5 */}
      {testBol[59] ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="9 55,12 55, 18 55, 33 55, 76 55"
          viewBox="0 5 100 100"
        />
      ) : null}

      {testBol[60] ? (
        <Line
          svgClass={styles.classLine}
          polylineClass={styles.classSvg}
          points="10 97,12 94, 18 94, 33 94, 76 94"
          viewBox="0 5 100 100"
        />
      ) : null}
    </div>
    {testBol[58] ||
    testBol[59] ||
    testBol[60] ||
    testBol[61] === true ? (
      <div className={styles.backgroundTransparence} />
    ) : null}
    {winner === true ? (
      <div className={styles.resultCard}>
        <div className={styles.columnContainer}>
          <p className={styles.resultCardText}>0,25x</p>
          <p className={styles.resultCardText}>0,0000000</p>
        </div>
      </div>
    ) : null}
    <div id="columnItem" className={styles.columnSpinner}>
      {concatResult.slice(0, 40).map((num, index) => {
        return (
          <img
            src={images[num]}
            alt=""
            className={
              testBol[index] === true ? styles.icon : styles.iconStatic
            }
          />
        );
      })}
    </div>
    <div className={styles.separatedLine} />
    <div id="columnItem2" className={styles.columnSpinner}>
      {concatResult.slice(40, 80).map((num, index) => {
        return (
          <img
            src={images[num]}
            alt=""
            className={
              testBol[index + 40] === true
                ? styles.icon
                : styles.iconStatic
            }
          />
        );
      })}
    </div>
    <div className={styles.separatedLine} />
    <div id="columnItem3" className={styles.columnSpinner}>
      {concatResult.slice(80, 120).map((num, index) => {
        return (
          <img
            src={images[num]}
            alt=""
            className={
              testBol[index + 80] === true
                ? styles.icon
                : styles.iconStatic
            }
          />
        );
      })}
    </div>
    <div className={styles.separatedLine} />
    <div id="columnItem4" className={styles.columnSpinner}>
      {concatResult.slice(120, 160).map((num, index) => {
        return (
          <img
            src={images[num]}
            alt=""
            className={
              testBol[index + 120] === true
                ? styles.icon
                : styles.iconStatic
            }
          />
        );
      })}
    </div>
    <div className={styles.separatedLine} />
    <div id="columnItem5" className={styles.columnSpinner}>
      {concatResult.slice(160, 200).map((num, index) => {
        return (
          <img
            src={images[num]}
            alt=""
            className={
              testBol[index + 160] === true
                ? styles.icon
                : styles.iconStatic
            }
          />
        );
      })}
    </div>
    </div>
  );
}

export default Spinner;