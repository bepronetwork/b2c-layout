import React from "react";
import { World, Engine, Events, Body, Bodies } from 'matter-js';
import Plinko from './Components/plinko';
import VerticalWall from './Components/wall';
import { Row, Col } from 'reactstrap';
import {PEG0, PEG1, PEG2, PEG3, PEG4, PEG5, PEG6, PEG7, PEG8, PEG9} from './Components/bars';
import plockSound from "assets/plock.mp3";
import Pegs from "./Components/Pegs";
import "./index.css";

const plock = new Audio(plockSound);

class PlinkoGameCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ROWS : props.game.resultSpace.length-1,
            game : props.game,
            plinkoradius : 5,
            ROW_ADJUSTMENT: 0.9,
            COL_ADJUSTMENT: 0.8,
            CANVAS_WIDTH: 760,
            CANVAS_HEIGHT: 440,
            CANVAS_COLOR: '',
        }
    
    }

    init(ROWS,r) {
        this.particles = {};
        this.plinkos = {};
        this.lastParticleId = 0;
        this.walls={};
        this.isRunning = false;
        this.createEnvironment(ROWS,r);
    }

    componentDidMount() {
        this.createCanvas();
        this.init(this.state.ROWS,this.state.plinkoradius);
    
    }

    createCanvas = () => {
        this.engine = Engine.create(document.getElementById('techvr'));
        this.engine.world.gravity.y = 1;
        this.engine.render.canvas.height = this.state.CANVAS_HEIGHT;
        this.engine.render.canvas.width = this.state.CANVAS_WIDTH;
        this.engine.render.canvas.id = 'plinkoCanvas';
        this.engine.render.options.wireframes = false;
        this.engine.render.options.background = this.state.CANVAS_COLOR;
        Engine.run(this.engine);
    }

    createBallPath(result) {
        switch(result){
            case 0 : 
                this.createBars(PEG0);
                break;
            case 1 :
                this.createBars(PEG1);
                break;
            case 2 : 
                this.createBars(PEG2);
                break;
            case 3 :
                this.createBars(PEG3);
                break;
            case 4 : 
                this.createBars(PEG4);
                break;
            case 5 : 
                this.createBars(PEG5);
                break;
            case 6 : 
                this.createBars(PEG6);
                break;
            case 7 : 
                this.createBars(PEG7);
                break;
            case 8 : 
                this.createBars(PEG8);
                break;
            case 9 : 
                this.createBars(PEG9);
                break;
            default:
                break;
        }
    }

    createBars(pegBars) {
        pegBars.map((el) => {
            this.createBar(el.x, el.y, el.w, el.a, 'bar');

            return null;
        })
    }

    createBar(x, y, w, angle, label) {
        let body = Bodies.rectangle(x, y, 2, w, { 
            isStatic: true,
            label: label
        });

        body.render.opacity = 0;
        Body.setAngle(body, angle);

        World.add(this.engine.world, body);

        return body;
    }

    onCollisionStart = (event) => {
        const pairs = event.pairs;
    
        for (let i = 0; i < pairs.length; i++) {
          const pair = pairs[i];
          const bodyA = pair.bodyA;
          const bodyB = pair.bodyB;
    
          if (bodyA.label === 'plinko' && bodyB.label === 'particle') {
            this.playSound(plock, 100);
          }
    
          if (bodyA.label === 'plinko') {
            
            bodyA.render.lineWidth = 15
            setTimeout(() => {
                bodyA.render.lineWidth = 0
            }, 90);
          }
        }
    }

    _createPlinkos = (ROWS,r) => {
 
        let ROW_SPACING = this.state.CANVAS_HEIGHT / ROWS * this.state.ROW_ADJUSTMENT;
        let COL_SPACING = this.state.CANVAS_WIDTH / (ROWS + 2) * this.state.COL_ADJUSTMENT;
        const VERTICAL_MARGIN = ROW_SPACING * 1.5;
        const HORIZONTAL_OFFSET = COL_SPACING / 2;
        let id = 0;
        let row = 2
        for (row; row < ROWS + 2; row++) {
            let differ = ((((ROWS + 2) - row) * HORIZONTAL_OFFSET) + this.state.COL_ADJUSTMENT * 90)+4
        
            for (let col = 0; col <= row; col++) {
                let x = (col * COL_SPACING) + differ;
                let y = VERTICAL_MARGIN + ROWS + ((row - 2) * ROW_SPACING);
                const plinko = new Plinko({ id, x, y, r });
                this.plinkos[id] = plinko;
                plinko.addToEngine(this.engine.world);  
                id++;
            }
        }
    }

    _createWalls=()=> {
        const leftWall = new VerticalWall({x: 178, y: 310});
        const rightWall = new VerticalWall({x: 582, y: 310});
        [leftWall, rightWall].forEach(wall => wall.addToEngine(this.engine.world));
        this.engine.world.bodies.filter(el => el.label === "wall").forEach((dt) => {
            dt.render.opacity = 0
            if(dt.position.x < 250){
                Body.rotate( dt.parent, 0.56);
            }
            else{
                Body.rotate( dt.parent, -0.56);
            }
        })
    }

    createEnvironment(ROWS,r) {
        this._createPlinkos(ROWS,r);
        this._createWalls();
        Events.on(this.engine, 'collisionStart', this.onCollisionStart);
    }

    playSound = (sound, timeout) => {
        const soundConfig = localStorage.getItem("sound");
        const playPromise = sound.play();

        if (soundConfig !== "on") {
            return null;
        }

        if (playPromise !== undefined) {
            playPromise.then(() => {
                setTimeout(() => {
                    sound.pause();
                    sound.currentTime = 0;
                }, timeout);
            });
        }

        return null;
    };

    renderResult = () => {
        const { result } = this.props;

        if(!result || !result.multiplier){return null};

        return (
            <h6>{result.multiplier}x</h6>
        );
    };
      
    render() {
        const { game, peg1, peg2, peg3, peg4, peg5, peg6, peg7, peg8, peg9, peg10 } = this.state;

        return (
            <div styleName="root">
                <Row style={{margin:-10}}>
                    <Col span={18} push={6} gutter={16}>
                    <div styleName="canvas-container">
                        <div id="techvr" styleName="canvas"/>
                        <Pegs 
                            game={game} 
                            peg1={peg1}
                            peg2={peg2}
                            peg3={peg3}
                            peg4={peg4}
                            peg5={peg5}
                            peg6={peg6}
                            peg7={peg7}
                            peg8={peg8}
                            peg9={peg9}
                            peg10={peg10}
                        />
                        <div styleName="result">
                            {this.renderResult()}
                        </div>
                    </div>
                    </Col>
                </Row>
            </div>
        )
      }
}


export default PlinkoGameCard;