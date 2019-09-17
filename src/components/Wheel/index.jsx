import React, { Component } from "react";
import PropTypes from "prop-types";
import Sound from "react-sound";
import rouletteSound from "assets/roulette-sound.mp3";
import ballSound from "assets/ball-stop-sound.mp3";
import pointer from "assets/wheel-pointer.png";
import classNames from "classnames";
import "./index.css";

const intervalAngle = 12;
const mobileBreakpoint = 768;
let anim = null;
let endAnim = null;

const ANIMATION_INTERVAL = 20;
const TOTAL_ANIMATION_TIME = 4*1000;

const WHEEL_SPACES_END = [
    22,
    21,
    20,
    19,
    18,
    17,
    16,
    15,
    14,
    13,
    12,
    11,
    10,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    1,
    0,
    29,
    20,
    28,
    27,
    26,
    25,
    24,
    23,
]
export default class Wheel extends Component {
    static propTypes = {
        result: PropTypes.number,
        bet: PropTypes.bool,
        onAnimation: PropTypes.func.isRequired
    };

    static defaultProps = {
        result: null,
        bet: false
    };

    constructor(props){
        super(props);
        this.state = {
            ballStop: false
        }
      
    }

    componentDidMount() { 
        this.startAngle = 0;
        this.arc = Math.PI / 15;
        this.spinTimeout = null;
        this.acc = 0;
        this.spinArcStart = 0;
        this.spinTime = 0;
        this.spinTimeTotal = 0;
        this.offset = 0;
        this.current_user_status = {};
        this.spinMovement = null;
        this.spin_results = null;
        this.spinAngleStart = null;
        this.wheel = null;
        this.counter = null;
        this.tt = null;
        this.drawSpinnerWheel(this.props);
    }

    componentWillReceiveProps(props){
        this.drawSpinnerWheel(props);
    }


    drawSpinnerWheel(props) {
        this.options = props.options;
        var canvas = document.getElementById("canvas");
        if(this.options.length < 1){return null}
        if (canvas.getContext) {
            var outsideRadius = 500;
            var textRadius = 1;
            var insideRadius = 450;

            this.wheel = canvas.getContext("2d");
            this.wheel.clearRect(0, 0, 1000, 1000);
    
            this.wheel.lineWidth = 5;

            for (var i = 0; i < 30; i++) {
               
                var angle = this.startAngle + i * this.arc;
                let place = this.options.find(opt => {
                    let placing = opt.placings.find( placing => {
                        return placing == i
                    })
                    if(placing != null){return opt}
                });
                
                this.wheel.fillStyle = place.color;
                this.wheel.beginPath();
                this.wheel.arc(500, 500, outsideRadius, angle, angle + this.arc, false);
                this.wheel.arc(500, 500, insideRadius, angle + this.arc, angle, true);
                this.wheel.stroke();
                this.wheel.fill();

                this.wheel.save();
                this.wheel.shadowBlur = 0;
                this.wheel.shadowColor = "rgb(220,220,220)";
                this.wheel.fillStyle = "green";
                //this.wheel.translate(500 + Math.cos(angle + this.arc / 2) * textRadius, 500 + Math.sin(angle + this.arc / 2) * textRadius);
                //this.wheel.rotate(angle * Math.PI/180);
                this.wheel.restore();
            }

            //Arrow
            this.wheel.beginPath();
            this.wheel.fill();
        }
    }



    spin() {
        const { result } = this.props;
        const ONE_ARC_ANGLE = 12/49.5;
        const ONE_SPIN = 360/49.5;

        let SPINS =  3*ONE_SPIN; // Represents the AMount of 49.5 Angules
        this.desiredSpin = 360;
        this.spinAngleStart = SPINS + WHEEL_SPACES_END[result]*ONE_ARC_ANGLE - this.offset*ONE_ARC_ANGLE;

        this.offset = WHEEL_SPACES_END[result];
        this.spinTime = 0;
        this.acc = 0;
        /* miliseconds of Spin Time */
        this.spinTimeTotal = TOTAL_ANIMATION_TIME;
        this.rotateWheel();
    }

    rotateWheel() {
        this.spinTime += ANIMATION_INTERVAL;
        if (this.spinTime >= this.spinTimeTotal) {
            this.stopRotateWheel();
            return;
        }
        var spinAngle = this.spinAngleStart - this.easeOut(this.spinTime, 0, this.spinAngleStart, this.spinTimeTotal);
        this.acc = this.acc + spinAngle;
        this.startAngle += (spinAngle * Math.PI / 180);
        this.drawSpinnerWheel(this.props);
        this.spinTimeout = setTimeout(() => this.rotateWheel(), ANIMATION_INTERVAL);
    }

    stopRotateWheel() {
        const { stopAnimation } = this.props;
        clearTimeout(this.spinTimeout);
        this.wheel.save();
        //this.wheel.fillText(text, 250 - this.wheel.measureText(text).width / 2, 250 + 10);
        this.wheel.restore();
        this.counter = 15;
        stopAnimation(false);
    }

    easeOut(t, b, c, d) {
        var ts = (t /= d) * t;
        var tc = ts * t;
        return b + c * (tc + -3 * ts + 3 * t);
    }


    /** */

    componentDidUpdate(prevProps) {
        const { result, bet } = this.props;

        if (!bet) {
            return;
        }

        if (result !== prevProps.result) {
            this.spin();
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

    renderResult = () => {
        const { result, rotating, game, inResultAnimation, options} = this.props;
        if(!result || !game.resultSpace || inResultAnimation){return null}

        const resultStyles = classNames("result", {
        green: result === 0 && !rotating,
        picked:
            result && result !== 0 && !rotating
        });

        let multiplier = game.resultSpace[result].multiplier;
        let colorMultiplier = options.find(opt => opt.multiplier == multiplier).index;
        
        return (
            <div styleName="result-container">
                <div styleName={resultStyles} onTransitionEnd={this.handleAnimationEnd}>
                <h6 styleName={`multiplier-${new String(colorMultiplier).toString()}`}>{game.resultSpace[result].multiplier}x</h6>
                </div>
            </div>
        );
    };

    render() {
        return (
            <div  styleName="root" >
                <img src={pointer} styleName={'wheel-pointer'}/>
                {this.renderResult()}
                <div
                    styleName="container"
                    id="container"
                />
                {/* Canvas */}
                    <span 
                        ref={el => {this.el = el;}} 
                        id={`spin`}
                    >
                        <canvas id="canvas" width="1000" height="1000"></canvas>
                        
                    </span>
                {this.renderSound()}
                {this.renderBallStopSound()}
            </div>
        );
    }
}
