import React, { Component } from "react";
import { World, Engine, Render, Events, Body, Bodies } from 'matter-js';
import Particle from './Components/particle';
import Plinko from './Components/plinko';
import VerticalWall from './Components/wall';
import {PARTICLE} from './Components/bodies';
import { Row, Col } from 'reactstrap';
import "./index.css";
import Typography from "../Typography";

const MS_IN_SECOND = 2000;
const FPS = 60;
const BOXES  = [{x: 370, y: 62}, {x: 418, y: 42}, {x: 419, y: 42}, {x: 418, y: 52}, {x: 411, y: 42},
                {x: 362, y: 52}, {x: 370, y: 62}, {x: 407, y: 62}, {x: 419, y: 42}, {x: 387, y: 32}];


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
        this.createCanvas()
        this.init(this.state.ROWS,this.state.plinkoradius);
    
    }

    createCanvas = () => {
        this.engine = Engine.create(document.getElementById('techvr'));
        this.engine.world.gravity.y = 1.5;
        this.engine.render.canvas.height = this.state.CANVAS_HEIGHT;
        this.engine.render.canvas.width = this.state.CANVAS_WIDTH;
        this.engine.render.options.wireframes = false;
        this.engine.render.options.background = this.state.CANVAS_COLOR;
        Engine.run(this.engine);
    }



    _createParticle = (result) => {
        const id = this.lastParticleId++ % 255;
        let box = {};
        BOXES.filter( (o, index) => {
            if(index == result)
                box = BOXES[index];
        })
        const x = box.x;
        const y = box.y;
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
        const leftWall = new VerticalWall({x: 210, y: 310});
        const rightWall = new VerticalWall({x: 555, y: 310});
        [leftWall, rightWall].forEach(wall => wall.addToEngine(this.engine.world));
        this.engine.world.bodies.filter(el => el.label === "wall").forEach((dt,i) => {
            dt.render.opacity = 0
            if(dt.position.x < 250){
                Body.rotate( dt.parent, 0.48);
            }
            else{
                Body.rotate( dt.parent, -0.48);
            }
        })
    }

    createEnvironment(ROWS,r) {
        this._createPlinkos(ROWS,r);
        this._createWalls();
        Events.on(this.engine, 'collisionStart', this.onCollisionStart);
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