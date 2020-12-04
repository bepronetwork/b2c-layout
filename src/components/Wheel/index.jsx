import React, { Component } from "react";
import PropTypes from "prop-types";
import Sound from "react-sound";
import { getAppCustomization } from "../../lib/helpers";
import rouletteSound from "assets/roulette-sound.mp3";
import ballSound from "assets/coin-board-sound.mp3";
import pointer from "assets/wheel-pointer.png";
import classNames from "classnames";
import "./index.css";
import { WHEEL_SIMPLE, WHEEL_CLASSIC } from "./types";

let endAnim = null;
const TOTAL_SPACES = 30;
const ANIMATION_INTERVAL = 20;
const TOTAL_ANIMATION_TIME = 4*1000;
let volume = 100

export default class Wheel extends Component {
    static propTypes = {
        result: PropTypes.number,
        bet: PropTypes.bool,
        onAnimation: PropTypes.func.isRequired,
        metaName: PropTypes.string
    };

    constructor(props){
        super(props);
        this.state = {
            ballStop: false,
            metaName: props.game ? props.game.metaName : null,
            anim: false
        }
      
    }

    componentDidMount() { 
      
        this.startAngle = 0;
        this.arc = Math.PI / (TOTAL_SPACES/2);
        this.spinTimeout = null;
        this.acc = 0;
        this.spinArcStart = 0;
        this.spinTime = 0;
        this.isFirstRotation = true;
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

    componentDidUpdate(prevProps) {
        const { result, bet } = this.props;

        if (!bet) {
            return;
        }

        if (result !== prevProps.result) {
            this.spin();
        }
    }

    componentWillReceiveProps(props){
        
        this.drawSpinnerWheel(props);
    }


    drawSpinnerWheel(props) {
        const { options, game } = props;
        const { metaName } = game;
        
        switch(metaName){
            case 'wheel_variation_1' : {
                this.wheel_draw = WHEEL_CLASSIC.DRAW;
                this.initialRotation = WHEEL_CLASSIC.INITIAL_OFFSET_ROTATION;
                this.classicDraw(options);
                break;
            }
            case 'wheel_simple' : {
                this.wheel_draw = WHEEL_SIMPLE.DRAW;
                this.initialRotation = WHEEL_SIMPLE.INITIAL_OFFSET_ROTATION;
                this.simpleDraw(options);
                break;
            }
        }
       
    }

    

    /**
     *
     * @method Draw Methods
     * @memberof Wheel
     */

    spin() {
        let { result } = this.props;
        const ONE_ARC_ANGLE = 12/49.5;
        const ONE_SPIN = 360/49.5;
        let SPINS =  3*ONE_SPIN;
        this.desiredSpin = 360;
        let indexPlace = this.wheel_draw.findIndex( (e, i) => e == result);
        this.spinAngleStart = -SPINS - indexPlace*ONE_ARC_ANGLE + this.offset*ONE_ARC_ANGLE;
        this.offset = indexPlace;
        this.spinTime = 0;
        this.acc = 0;
        this.spinTimeTotal = TOTAL_ANIMATION_TIME;
        this.rotateWheel();
    }

    rotateWheel() {
        this.setState({ anim : true });
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
        this.setState({ anim : false, ballStop : true });
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

   

    /** DRAW TYPES */

    /**
     *
     * @type Draws  
     * @memberof Wheel
     */

    classicDraw(options){
        var canvas = document.getElementById("canvas");
        if(options.length < 1){return null}
        if (canvas.getContext) {
            var outsideRadius = 500;
            var insideRadius = 442;
            this.wheel = canvas.getContext("2d");
            this.wheel.clearRect(0, 0, 1000, 1000);
            
            this.wheel.lineWidth = 5;
            for (var i = 0; i < TOTAL_SPACES; i++) {    
                let placeWheel = this.wheel_draw[i];
                var angle;
                if(this.isFirstRotation){
                    angle = this.startAngle + i * this.arc + this.initialRotation*this.arc;
                }else{
                    angle = this.startAngle + i * this.arc;
                }

                let place = options.find(opt => {
                    let placing = opt.placings.find( placing => {
                        return placing == placeWheel;
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
                this.wheel.restore();
            }

            this.wheel.beginPath();
            this.wheel.fill();
        }
    }


    simpleDraw(options){
        var canvas = document.getElementById("canvas");

        if(options.length < 1){return null}

        if (canvas.getContext) {
            var outsideRadius = 500;
            var insideRadius = 442;
            this.wheel = canvas.getContext("2d");
            this.wheel.clearRect(0, 0, 1000, 1000);

            this.wheel.lineWidth = 5;
            
            for (var i = 0; i < 30; i++) {
                var angle = this.startAngle + i * this.arc;
                let place = options.find(opt => {
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
                this.wheel.restore();
            }

            this.wheel.beginPath();
            this.wheel.fill();
        }
    }


    /**
     *
     * @type Renders  
     * @memberof Wheel
     */

    renderSound = () => {
        const { anim } = this.state;
        const soundConfig = localStorage.getItem("sound");

        if (soundConfig !== "on" || !anim) {
        return null;
        }

        volume = volume - 0.8;
        return (
            <Sound volume={volume} url={rouletteSound} playStatus="PLAYING" autoLoad />
        );
    };

    renderBallStopSound = () => {
        const soundConfig = localStorage.getItem("sound");
        const { ballStop, anim } = this.state;

        if (soundConfig !== "on" || anim || !ballStop) {
        return null;
        }
        volume = 100;
        return <Sound volume={100} url={ballSound} playStatus="PLAYING" autoLoad />;
    };

    renderResult = () => {
        const { result, rotating, game, inResultAnimation, options} = this.props;
        const { metaName } = this.state;
        const isLight = getAppCustomization().theme === "light";
        const containerStyles = classNames("result-container",
            {
                resultContainerSimple: metaName === 'wheel_simple' || metaName === 'wheel_variation_1'
            }
        )
        if(!result || !game.resultSpace || inResultAnimation){return <div styleName={containerStyles}/>}

        let multiplier = game.resultSpace[result].multiplier;
        let colorMultiplier = options.find(opt => opt.multiplier == multiplier).index;
        let styleName = `multiplier-${new String(colorMultiplier).toString().trim()}`;
        styleName += isLight ? ` multiplier-${new String(colorMultiplier).toString().trim()}-light` : '';

        return (
            <div styleName={containerStyles}>
                <h6 styleName={styleName}>{game.resultSpace[result].multiplier}x</h6>
            </div>
        );
    };

    render() {
        const styles = classNames("outer-circle",{
            "outer-circle-light": getAppCustomization().theme === "light"
        });

        return (
            <div  styleName="root" >
                <div>
                    <div styleName={styles}>
                        <img src={pointer} styleName={'wheel-pointer'}/>
                        <div styleName={'circle'}>
                            {this.renderResult()}
                        </div>
                    </div>
                </div>
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




