import React, { Component } from "react";
import { World, Engine, Events, Body, Bodies } from 'matter-js';
import Particle from './Components/particle';
import Plinko from './Components/plinko';
import VerticalWall from './Components/wall';
import {PARTICLE} from './Components/bodies';
import { Row, Col } from 'reactstrap';
import {PEG0, PEG1, PEG2, PEG3, PEG4, PEG5, PEG6, PEG7, PEG8, PEG9} from './Components/bars';
import loseSound from "assets/lose-sound.mp3";
import Sound from "react-sound";
import "./index.css";
import Typography from "../Typography";

const MS_IN_SECOND = 2000;
const FPS = 60;

class PlinkoGameCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ROWS : props.game.resultSpace.length-1,
            game : props.game,
            plinkoradius : 5,
            particleradius:7,
            ROW_ADJUSTMENT: 0.9,
            COL_ADJUSTMENT: 0.8,
            CANVAS_WIDTH: 760,
            CANVAS_HEIGHT: 440,
            CANVAS_COLOR: '',
            TIMESTEP: MS_IN_SECOND / FPS,
            PARTICLE: PARTICLE
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
        this.projectData(this.props);
        this.createCanvas()
        this.init(this.state.ROWS,this.state.plinkoradius);
    
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    createCanvas = () => {

        this.engine = Engine.create(document.getElementById('techvr'));
        this.engine.world.gravity.y = 1;
        this.engine.render.canvas.height = this.state.CANVAS_HEIGHT;
        this.engine.render.canvas.width = this.state.CANVAS_WIDTH;
        this.engine.render.options.wireframes = false;
        this.engine.render.options.background = this.state.CANVAS_COLOR;
        Engine.run(this.engine);
    }

    createBallPath(result) {
        switch(result){
            case 0 : {
                this.createBars(PEG0);
                break;
            };
            case 1 : {
                this.createBars(PEG1);
                break;
            };
            case 2 : {
                this.createBars(PEG2);
                break;
            };
            case 3 : {
                this.createBars(PEG3);
                break;
            };
            case 4 : {
                this.createBars(PEG4);
                break;
            };
            case 5 : {
                this.createBars(PEG5);
                break;
            };
            case 6 : {
                this.createBars(PEG6);
                break;
            };
            case 7 : {
                this.createBars(PEG7);
                break;
            };
            case 8 : {
                this.createBars(PEG8);
                break;
            };
            case 9 : {
                this.createBars(PEG9);
                break;
            };
        }
    }

    createBars(pegBars) {
        pegBars.map((el) => {
            this.createBar(el.x, el.y, el.w, el.a, 'bar');
        })
    }

    createBar(x, y, w, angle, label) {
        const r = this.state.particleradius;

        let body = Bodies.rectangle(x, y, 2, w, { 
            isStatic: true,
            label: label
        });

        body.render.opacity = 0;
        Body.setAngle(body, angle);

        World.add(this.engine.world, body);

        return body;
    }

    _createParticle = (result) => {
        this.engine.world.bodies.filter(el => el.label === "bar").map((el, i) => {
            World.remove(this.engine.world, el);
        });

        this.createBallPath(result);

        const id = this.lastParticleaId++ % 255;
        const x = (result < 8) ? 345 : 400;
        const y = 62;
        const r = this.state.particleradius;

        if(!this.engine.world.bodies.filter(el => el.label === "particle").length) {
            let particle = new Particle({ id, x, y, r});
            particle.recentlyDropped = true;
            this.particles[String(id)] = particle;
            particle.addToEngine(this.engine.world);
            Engine.update(this.engine, this.state.TIMESTEP);    
        
            let checkParticleStatus = setInterval(() => {
                this.engine.world.bodies.forEach(dt => {
                    if (dt.label === 'particle' && dt.position.y > this.state.CANVAS_HEIGHT - 5 - this.state.particleradius) {
                        const particle = dt.parentObject
                        let newARr = []
                        let count = 0;
                        let arr = this.engine.world.bodies.filter(el => el.label === "plinko")
                        for (let i = arr.length - 1; i >= 0; i--) {
                            count = count + 1
                
                            if (count <= this.state.ROWS + 2) {
                                newARr.push(arr[i])
                            }
                        }
                        let index = null
                        
                        newARr.reverse().filter((el, i) => {
                        
                            if (el.position.x > particle.body.position.x) {
                                if (index === null) {
                                    index = i
                                    return el
                                }
                            }

                            if(index !== null){
                                // End of Animation
                                let pgd = `peg${index}`;
                                this.setState({
                                    [pgd]:true
                                },()=>{
                                        setTimeout(() => {
                                            this.setState({
                                                [pgd]:false
                                            })
                                    }, 100);
                                })
                            }
                        })

                        World.remove(this.engine.world, particle.body)
                        let checkParticle = this.engine.world.bodies.filter(el => el.label === 'particle')
                        setTimeout(() => {
                            if (checkParticle.length === 0) {
                                this.props.onResultAnimation();
                                clearInterval(checkParticleStatus)
                            }
                        }, 10);
                    }
                })
        
            }, this.state.TIMESTEP);
        }
    }
    
    
    onCollisionStart = (event) => {
        const pairs = event.pairs;
    
        for (let i = 0; i < pairs.length; i++) {
          const pair = pairs[i];
          const bodyA = pair.bodyA;
          const bodyB = pair.bodyB;
    
          if (bodyA.label === 'plinko' && bodyB.label === 'particle') {
            this.renderCollisionSound();
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
        this.setState({ COL_SPACING,particleradius:COL_SPACING/4.4 })
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
        this.engine.world.bodies.filter(el => el.label === "wall").forEach((dt,i) => {
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

    renderCollisionSound = () => {
        return (
            <Sound volume={100} url={loseSound} playStatus="PLAYING" autoLoad />
        );
    };

    projectData(props){
        let result = null;
        let nextProps = props;
        let prevState = this.state;
        const { rollNumber } = this.props;
        if (nextProps.result && nextProps.result !== prevState.result) {
            let history = localStorage.getItem("plinkoHistory");

            history = history ? JSON.parse(history) : [];
            history.unshift({ value: nextProps.result });
            localStorage.setItem("plinkoHistory", JSON.stringify(history));
            result = nextProps.result;
            this.setState({...this.state, 
                result
            });
        }else{
            this.setState({
                edge : props.game.edge
            });
        }
    }
      
    render() {
        const { game } = this.state;

        return (
            <div styleName="root">
                <Row>
                    <Col span={18} push={6} gutter={16}>
                    <div styleName="canvas-container">
                        <div id="techvr" />
                        <div styleName={`pegs rows${game.resultSpace.length-1}`}>
                            <div styleName="pegs_wrapper" >
                                {game.resultSpace.map((el, i) => {
                                    let className;
                                    if(el.multiplier < 1){
                                        className = 'peg10'
                                    }else if(el.multiplier < 2){
                                        className = 'peg7'
                                    }else{
                                        className = 'peg1'
                                    };
                                    const hasAnimationClass = this.state[`peg${i+1}`] ? 'peg-animated' : '';

                                    return (
                                        <div styleName={`peg ${className} ${hasAnimationClass}`} >
                                            <Typography variant={'small-body'} color={'pickled-bluewood'} >{el.multiplier}x</Typography>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    </Col>
                </Row>
            </div>
        )
      }
}


export default PlinkoGameCard;