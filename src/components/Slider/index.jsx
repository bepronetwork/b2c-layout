import React, { Component } from "react";
import PropTypes from "prop-types";
import RcSlider from "rc-slider";
import Typography from "components/Typography";
import Diamond from "components/Icons/Diamond";
import sliderSound from "assets/slider-change-sound.mp3";
import loseSound from "assets/lose-sound.mp3";
import winSound from "assets/win-sound.mp3";
import Sound from "react-sound";
import styled, { keyframes } from "styled-components";

import "./index.css";

const { Handle } = RcSlider;
const diamondwidth = 72;

export default class Slider extends Component {
  static propTypes = {
    value: PropTypes.number,
    roll: PropTypes.oneOf(["under", "over"]),
    onChange: PropTypes.func,
    result: PropTypes.number,
    disableControls: PropTypes.bool,
    onResultAnimation: PropTypes.func.isRequired
  };

  static defaultProps = {
    value: 0,
    roll: "over",
    onChange: null,
    result: null,
    disableControls: false
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      result: null,
      leftP: 0,
      bet : {},
      oldLeftP: 0,
      moving: false
    };
  }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.value !== prevState.value) {
            return { value: nextProps.value };
        }

        if (nextProps.result !== prevState.result) {
            let leftP = (prevState.container.clientWidth * nextProps.result) / 100;

            leftP -= diamondwidth * 0.5;

            let oldLeftP = (prevState.container.clientWidth * prevState.result) / 100;

            oldLeftP -= diamondwidth * 0.5;
            if (!nextProps.animating && (nextProps.bet.nonce != prevState.bet.nonce)) {
                return {
                    result: nextProps.result,
                    bet : nextProps.bet,
                    leftP,
                    oldLeftP
                };
            }else{
                return {
                    result: nextProps.result,
                    leftP
                }
            }

        }

        return {
            result: null,
            leftP: 0
        };
    }

  handleSlide = props => {
    const { value, ...restProps } = props;

    return <Handle value={value} {...restProps} />;
  };

  handleChange = type => value => {
    const { onChange } = this.props;

    this.setState({
      value,
      moving: type === "slider",
      result: null
    });

    if (onChange) onChange(value);
  };

  handleAfterChange = () => {
    this.setState({ moving: false });
  };

  handleRef = element => {
    const { container } = this.state;

    if (!container) {
      this.setState({ container: element });
    }
  };

  renderResult = () => {
    const { roll } = this.props;
    const { result, value, leftP, oldLeftP, moving } = this.state;
    if (!result || moving) return null;

    const slide = keyframes`
      10% {
        left: ${oldLeftP}px;

        z-index: -1;

        opacity: 1;

        transform: scale(0.5);
      }
      15% {
        left: ${leftP}px;

        z-index: 2;

        opacity: 1;

        transform: scale(1);
      }
      97% {
        left: ${leftP}px;

        z-index: 2;

        opacity: 1;

        transform: scale(1);
      }
      100% {
        left: ${leftP}px;

        z-index: -1;

        opacity: 1;

        transform: scale(0.5);
      }`;

    const Show = styled.div`
      position: absolute;
      top: ${-diamondwidth}px;
      left: 0;
      z-index: -1;

      width: ${diamondwidth}px;

      transform: scale(0.1);

      animation: ${slide} 2s linear;
    `;

    return (
      <Show id="animation-div" onAnimationEnd={this.handleAnimation}>
        {this.renderResultSound()}
        <Diamond value={value} result={result} roll={roll} />
      </Show>
    );
  };

  handleAnimation = () => {
    const { onResultAnimation } = this.props;

    onResultAnimation();
  };

  renderResultSound = () => {
    const { roll } = this.props;
    const { result, value } = this.state;
    const sound = localStorage.getItem("sound");

    if (sound !== "on") {
      return null;
    }

    return (
      <Sound
        volume={100}
        url={
          (result >= value && roll === "over") ||
          (result < value && roll === "under")
            ? winSound
            : loseSound
        }
        playStatus="PLAYING"
        autoLoad
      />
    );
  };

  renderSliderSound = () => {
    const sound = localStorage.getItem("sound");
    const { moving } = this.state;

    if (sound !== "on") {
      return null;
    }

    return (
      <Sound
        volume={100}
        url={sliderSound}
        playStatus={moving ? "PLAYING" : "STOPPED"}
        autoLoad
        playbackRate={1}
      />
    );
  };

  render() {
    const { roll, disableControls } = this.props;
    const { value } = this.state;

    return (
      <div styleName="root">
        {this.renderSliderSound()}

        <div styleName="container">
          <div styleName="slider-container" ref={this.handleRef}>
            {this.renderResult()}
            <div styleName="marker-0">
              <Typography weight="bold" variant="small-body" color="white">
                0
              </Typography>
              <div styleName="triangle" />
            </div>
            <div styleName="marker-25">
              <Typography weight="bold" variant="small-body" color="white">
                25
              </Typography>
              <div styleName="triangle" />
            </div>
            <div styleName="marker-50">
              <Typography weight="bold" variant="small-body" color="white">
                50
              </Typography>
              <div styleName="triangle" />
            </div>
            <div styleName="marker-75">
              <Typography weight="bold" variant="small-body" color="white">
                75
              </Typography>
              <div styleName="triangle" />
            </div>
            <div styleName="marker-100">
              <Typography weight="bold" variant="small-body" color="white">
                100
              </Typography>
              <div styleName="triangle" />
            </div>
            <div>
              <RcSlider
                className={roll === "under" ? "under" : null}
                min={2}
                max={98}
                value={value}
                step={1}
                handle={this.handleSlide}
                onChange={this.handleChange("slider")}
                onAfterChange={this.handleAfterChange}
                disabled={!!disableControls}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
