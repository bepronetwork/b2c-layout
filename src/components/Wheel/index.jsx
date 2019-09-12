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
        this.spinArcStart = 10;
        this.spinTime = 0;
        this.spinTimeTotal = 0;
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
        this.colors = props.colors;
        var canvas = document.getElementById("canvas");
        
        if (canvas.getContext) {
            var outsideRadius = 500;
            var textRadius = 1;
            var insideRadius = 450;

            this.wheel = canvas.getContext("2d");
            this.wheel.clearRect(0, 0, 1000, 1000);
    
            this.wheel.lineWidth = 5;

            for (var i = 0; i < 30; i++) {
               
                var angle = this.startAngle + i * this.arc;
                this.wheel.fillStyle = this.colors[i];
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
        let SPINS = parseInt(Math.floor(Math.random() * (10 - 4 + 1)) + 4);
        this.desiredSpin = 260;
        this.totalSpin = SPINS+this.desiredSpin;
        this.spinMovement = 20; //+ intervalAngle*result;
        this.spinAngleStart = this.totalSpin + this.spinMovement;
        this.spinTime = 0;
        this.acc = 0;
        /* miliseconds of Spin Time */
        this.spinTimeTotal = SPINS*20*360/this.desiredSpin;//Math.floor(Math.random() * 4) * Math.floor(Math.random() * 6) + Math.floor(Math.random() * 8) * Math.floor(Math.random() * 2000) + 2000;
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
        console.log(parseInt(this.acc));
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
        const { result, rotating, game, inResultAnimation, colors} = this.props;
        if(!result || !game.resultSpace || inResultAnimation){return null}

        const resultStyles = classNames("result", {
        green: result === 0 && !rotating,
        picked:
            result && result !== 0 && !rotating
        });
        
        return (
            <div styleName="result-container">
                <div styleName={resultStyles} onTransitionEnd={this.handleAnimationEnd}>
                <h6 styleName={`multiplier-${new String(parseInt(game.resultSpace[result].multiplier))}`}>{game.resultSpace[result].multiplier}x</h6>
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
