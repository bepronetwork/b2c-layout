import React, { Component } from "react";
import RouletteWheel from "assets/roulette-wheel.png";
import RouletteWheelLight from "assets/roulette-wheel-light.png";
import Konva from "konva";
import PropTypes from "prop-types";
import Sound from "react-sound";
import { getAppCustomization } from "../../lib/helpers";
import rouletteSound from "assets/roulette-sound.mp3";
import ballSound from "assets/ball-stop-sound.mp3";
import "./index.css";

const numberAngles = {
  0: 360,
  1: 224,
  2: 58,
  3: 340,
  4: 38,
  5: 185,
  6: 98,
  7: 301,
  8: 156,
  9: 262,
  10: 175,
  11: 136,
  12: 321,
  13: 116,
  14: 243,
  15: 19,
  16: 204,
  17: 78,
  18: 282,
  19: 29,
  20: 233,
  21: 48,
  22: 272,
  23: 166,
  24: 195,
  25: 68,
  26: 350,
  27: 107.5,
  28: 310,
  29: 291,
  30: 146,
  31: 252,
  32: 9,
  33: 214,
  34: 88,
  35: 330,
  36: 126
};
const mobileBreakpoint = 768;
let anim = null;
let endAnim = null;

export default class Roulette extends Component {
  static propTypes = {
    result: PropTypes.number,
    bet: PropTypes.bool,
    onAnimation: PropTypes.func.isRequired
  };

  static defaultProps = {
    result: null,
    bet: false
  };

  state = {
    ballStop: false
  };

  componentDidMount() {
    const stageSize = 270;

    const stage = new Konva.Stage({
      container: "container",
      width: stageSize,
      height: stageSize
    });

    const layer = new Konva.Layer();

    const ball = new Konva.Circle({
      x: stageSize / 2,
      y: stageSize / 2,
      width: 14,
      height: 14,
      fill: "white",
      offset: {
        x: 0,
        y: 84
      },
      opacity: 0
    });

    layer.add(ball);
    stage.add(layer);

    let angle = 0;

    endAnim = new Konva.Animation(() => {
      const { result, onAnimation } = this.props;

      ball.rotation(angle);

      angle += 3;

      if (angle >= 361) {
        angle = 0;
      }

      if (
        angle >= numberAngles[result] - 2 &&
        angle < numberAngles[result] + 2
      ) {
        endAnim.stop();
        this.setState({ ballStop: false });

        ball.rotation(numberAngles[result]);

        if (document.documentElement.clientWidth <= mobileBreakpoint) {
          setTimeout(() => {
            onAnimation(false);
          }, 1000);
        } else {
          onAnimation(false);
        }
      }
    }, layer);

    anim = new Konva.Animation(() => {
      ball.opacity(1);
      ball.rotation(angle);
      angle += 6;

      if (angle >= 361) {
        angle = 0;
      }
    }, layer);
  }

  componentDidUpdate(prevProps) {
        const { result, bet, onAnimation } = this.props;

        if (!bet) {
        return;
        }

        if (result !== prevProps.result) {
            anim.start();
            onAnimation(true);

            setTimeout(() => {
                anim.stop();
                endAnim.start();
                this.setState({ ballStop: true });
            }, 2000);
        }
  }

  renderSound = () => {
    const soundConfig = localStorage.getItem("sound");

    if (soundConfig !== "on" || !anim || !anim.isRunning()) {
      return null;
    }

    return (
      <Sound volume={100} url={rouletteSound} playStatus="PLAYING" autoLoad />
    );
  };

  renderBallStopSound = () => {
    const soundConfig = localStorage.getItem("sound");
    const { ballStop } = this.state;

    if (soundConfig !== "on" || !endAnim || !ballStop) {
      return null;
    }

    return <Sound volume={100} url={ballSound} playStatus="PLAYING" autoLoad />;
  };

  render() {
    const isLight = getAppCustomization().theme === "light";

    return (
      <div>
        <div
          styleName="container"
          id="container"
          style={{ backgroundImage: `url(${isLight ? RouletteWheelLight : RouletteWheel})` }}
        />
        {this.renderSound()}
        {this.renderBallStopSound()}
      </div>
    );
  }
}
