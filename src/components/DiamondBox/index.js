import React, { Component } from "react";
import { connect } from "react-redux";
import Diamond from "../../assets/DiamondIcons/diamond";
import DiamondFill from "../../assets/DiamondIcons/diamond-fill";
import DiamondWithBorder from "../../assets/DiamondIcons/diamond-with-border";
import handleCardResult from "../DiamondGame/resultCard";
import "./index.css";

class DiamondBox extends Component {
  state = {
    isHover: false,
    isHover1: false,
    isHover2: false,
    isHover3: false,
    isHover4: false,
    isHover5: false,
    isHover6: false
  };

  componentDidMount() {
    this.setActiveHover();
  }

  setActiveHover = () => {
    const { resultBack } = this.props;
    console.log(resultBack);
    switch (resultBack) {
      case 0:
        return this.setState({
          isHover6: true
        });
      case 1:
        return this.setState({
          isHover5: true,
          isHover6: false
        });
      case 2:
        return this.setState({
          isHover4: true,
          isHover6: false
        });
      case 3:
        return this.setState({
          isHover3: true,
          isHover6: false
        });
      case 4:
        return this.setState({
          isHover2: true,
          isHover6: false
        });
      case 5:
        return this.setState({
          isHover1: true,
          isHover6: false
        });
      case 6:
        return this.setState({
          isHover: true,
          isHover6: false
        });
      default:
        break;
    }
  };

  render() {
    const { resultSpace, profitAmount } = this.props;
    const {
      isHover,
      isHover1,
      isHover2,
      isHover3,
      isHover4,
      isHover5,
      isHover6
    } = this.state;

    return (
      <div styleName="row-container">
        <div styleName="column-container result-grid-container">
          <div>
            <div
              styleName="result-container"
              style={
                isHover
                  ? { backgroundColor: "#3A3A83" }
                  : { backgroundColor: "rgb(29, 26, 55)" }
              }
            >
              <div>
                <DiamondFill
                  color={isHover ? "white" : "#3A3A83"}
                  width="18%"
                />
                <DiamondFill
                  color={isHover ? "white" : "#3A3A83"}
                  width="18%"
                />
                <DiamondFill
                  color={isHover ? "white" : "#3A3A83"}
                  width="18%"
                />
                <DiamondFill
                  color={isHover ? "white" : "#3A3A83"}
                  width="18%"
                />
                <DiamondFill
                  color={isHover ? "white" : "#3A3A83"}
                  width="18%"
                />
              </div>
              <p styleName="text-result">
                {`${resultSpace[6].multiplier.toFixed(2)}x`}
              </p>
            </div>
            <div
              styleName="result-container"
              color={
                isHover1
                  ? { backgroundColor: "#3A3A83" }
                  : { backgroundColor: "rgb(29, 26, 55)" }
              }
            >
              <div>
                <DiamondFill
                  color={isHover1 ? "white" : "#3A3A83"}
                  width="18%"
                />
                <DiamondFill
                  color={isHover1 ? "white" : "#3A3A83"}
                  width="18%"
                />
                <DiamondFill
                  color={isHover1 ? "white" : "#3A3A83"}
                  width="18%"
                />
                <DiamondFill
                  color={isHover1 ? "white" : "#3A3A83"}
                  width="18%"
                />
                <Diamond color="#0E0C1B" width="18%" />
              </div>

              <p styleName="text-result">
                {`${resultSpace[5].multiplier.toFixed(2)}x`}
              </p>
            </div>
            <div
              styleName="result-container"
              style={
                isHover2
                  ? { backgroundColor: "#3A3A83" }
                  : { backgroundColor: "rgb(29, 26, 55)" }
              }
            >
              <div>
                <DiamondFill
                  color={isHover2 ? "white" : "#3A3A83"}
                  width="18%"
                />
                <DiamondFill
                  color={isHover2 ? "white" : "#3A3A83"}
                  width="18%"
                />
                <DiamondFill
                  color={isHover2 ? "white" : "#3A3A83"}
                  width="18%"
                />
                <DiamondWithBorder
                  color={isHover2 ? "white" : "#3A3A83"}
                  width="18%"
                />
                <DiamondWithBorder
                  color={isHover2 ? "white" : "#3A3A83"}
                  width="18%"
                />
              </div>
              <p styleName="text-result">
                {`${resultSpace[4].multiplier.toFixed(2)}x`}
              </p>
            </div>
          </div>
          <div>
            <div
              styleName="result-container"
              style={
                isHover3
                  ? { backgroundColor: "#3A3A83" }
                  : { backgroundColor: "rgb(29, 26, 55)" }
              }
            >
              <div>
                <DiamondFill
                  color={isHover3 ? "white" : "#3A3A83"}
                  width="18%"
                />
                <DiamondFill
                  color={isHover3 ? "white" : "#3A3A83"}
                  width="18%"
                />
                <DiamondFill
                  color={isHover3 ? "white" : "#3A3A83"}
                  width="18%"
                />
                <Diamond color="#0E0C1B" width="18%" />
                <Diamond color="#0E0C1B" width="18%" />
              </div>

              <p styleName="text-result">
                {`${resultSpace[3].multiplier.toFixed(2)}x`}
              </p>
            </div>
            <div
              styleName="result-container"
              style={
                isHover4
                  ? { backgroundColor: "#3A3A83" }
                  : { backgroundColor: "rgb(29, 26, 55)" }
              }
            >
              <div>
                <DiamondFill
                  color={isHover4 ? "white" : "#3A3A83"}
                  width="18%"
                />
                <DiamondFill
                  color={isHover4 ? "white" : "#3A3A83"}
                  width="18%"
                />
                <DiamondWithBorder
                  color={isHover4 ? "white" : "#3A3A83"}
                  width="18%"
                />
                <DiamondWithBorder
                  color={isHover4 ? "white" : "#3A3A83"}
                  width="18%"
                />
                <Diamond color="#0E0C1B" width="18%" />
              </div>

              <p styleName="text-result">
                {`${resultSpace[2].multiplier.toFixed(2)}x`}
              </p>
            </div>
            <div
              styleName="result-container"
              style={
                isHover5
                  ? { backgroundColor: "#3A3A83" }
                  : { backgroundColor: "rgb(29, 26, 55)" }
              }
            >
              <div>
                <DiamondFill
                  color={isHover5 ? "white" : "#3A3A83"}
                  width="18%"
                />
                <DiamondFill
                  color={isHover5 ? "white" : "#3A3A83"}
                  width="18%"
                />
                <Diamond color="#0E0C1B" width="18%" />
                <Diamond color="#0E0C1B" width="18%" />
                <Diamond color="#0E0C1B" width="18%" />
              </div>

              <p styleName="text-result">
                {`${resultSpace[1].multiplier.toFixed(2)}x`}
              </p>
            </div>
          </div>
          <div
            styleName="result-container"
            style={
              isHover6
                ? { backgroundColor: "#3A3A83" }
                : { backgroundColor: "rgb(29, 26, 55)" }
            }
          >
            <div>
              <Diamond color="#0E0C1B" width="18%" />
              <Diamond color="#0E0C1B" width="18%" />
              <Diamond color="#0E0C1B" width="18%" />
              <Diamond color="#0E0C1B" width="18%" />
              <Diamond color="#0E0C1B" width="18%" />
            </div>
            <p styleName="text-result">
              {`${resultSpace[0].multiplier.toFixed(2)}x`}
            </p>
          </div>
        </div>
        {isHover
          ? handleCardResult(
              "0px",
              profitAmount,
              (resultSpace[6].probability * 100).toFixed(2)
            )
          : null}
        {isHover1
          ? handleCardResult(
              "40px",
              profitAmount,
              (resultSpace[5].probability * 100).toFixed(2)
            )
          : null}
        {isHover2
          ? handleCardResult(
              "80px",
              profitAmount,
              (resultSpace[4].probability * 100).toFixed(2)
            )
          : null}
        {isHover3
          ? handleCardResult(
              "120px",
              profitAmount,
              (resultSpace[3].probability * 100).toFixed(2)
            )
          : null}
        {isHover4
          ? handleCardResult(
              "160px",
              profitAmount,
              (resultSpace[2].probability * 100).toFixed(2)
            )
          : null}
        {isHover5
          ? handleCardResult(
              "180px",
              profitAmount,
              (resultSpace[1].probability * 100).toFixed(2)
            )
          : null}
        {isHover6
          ? handleCardResult(
              "190px",
              profitAmount,
              (resultSpace[0].probability * 100).toFixed(2)
            )
          : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ln: state.language
  };
}

export default connect(mapStateToProps)(DiamondBox);
