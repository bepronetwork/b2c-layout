import React, { Component } from "react";
import { World, Engine, Render, Events, Body, Bodies } from 'matter-js';
import Particle from './particle';
import Plinko from './plinko';
import VerticalWall from './wall';
import {PARTICLE} from './bodies';
import PropTypes from "prop-types";
import { InputNumber, Slider, ButtonIcon, Typography, AnimationNumber } from "components";
import { startCase } from "lodash";
import { Row, Col } from 'reactstrap';
import { find } from "lodash";

import { getPopularNumbers } from "../../lib/api/app";
import { Numbers } from "../../lib/ethereum/lib";
import "./index.css";

const MS_IN_SECOND = 2000;
const FPS = 60;

export default class PlinkoGameCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
          ROWS: 16,
          betdisabeled:false,
          betrowdisabeled:false,
          plinkoradius:5,
          particleradius:7,
          noofautobets:'0',
          footer: {
            a8: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
            a9: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            a10: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
            a11: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            a12: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
            a13: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'],
            a14: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
            a15: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'],
            a16: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17'],
          },
          ROW_ADJUSTMENT: 0.9,
          COL_ADJUSTMENT: 0.8,
          CANVAS_WIDTH: 760,
          CANVAS_HEIGHT: 570,
          CANVAS_COLOR: '',
          TIMESTEP: MS_IN_SECOND / FPS,
          PARTICLE: PARTICLE
        }
    
      }
      handleNoOFAutoBets = (e) =>{
          this.setState({
            noofautobets:e.target.value
          })
         
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
      dropChips = (e) => {
        if (e === 'manualbet' && !this.state.betdisabeled) {
          this._createParticle()
          this.setState({
            betdisabeled:true
          },()=>{
           setTimeout(() => {
            this.setState({
              betdisabeled:false
            })
           }, 1000);
          })
        }
        if (e === 'autobet' && !this.state.betdisabeled) {
        if(this.state.noofautobets !== '0' && this.state.noofautobets !==0){
         let ctr = setInterval(() => {
            this.setState({
              betdisabeled:true,
              noofautobets:this.state.noofautobets - 1
          },()=>{
            this._createParticle()
            if(this.state.noofautobets === 0){
              this.setState({
                betdisabeled:false,
              },()=>{
                clearInterval(ctr)
              })
             
            }
          })
          }, 1000);
          
        }else{
          this._createParticle()
             this.setState({
            betdisabeled:true
          },()=>{
           setTimeout(() => {
            this.setState({
              betdisabeled:false
            })
           }, 1000);
          })
        }
      
        }
      }
      changeRows = (e) => {
        
          document.getElementById('techvr').innerHTML = '';
          World.remove(this.engine.world, "composite")
          Render.stop(this.render);
          Engine.clear(this.engine);
          Events.off(this.engine, 'collisionStart', this.onCollisionStart);
          this.setState({
            ROWS: e
          },()=>{
            this.createCanvas()
            this.init(this.state.ROWS,this.state.plinkoradius);})
          
         
       
      }
    
    
    
      componentDidMount() {
        this.createCanvas()
        this.init(this.state.ROWS,this.state.plinkoradius);
    
      }
      init(ROWS,r) {
        this.particles = {};
        this.plinkos = {};
        this.lastParticleId = 0;
        this.walls={};
        this.isRunning = false;
        this.createEnvironment(ROWS,r);
    
      }
    
    
    
    
      _createParticle = () => {
        const id = this.lastParticleId++ % 255;
        const x = Math.floor(Math.random() * (400 - 350 + 1)) + 350;
        const y = 18;
        const r = this.state.particleradius;
        let particle = new Particle({ id, x, y, r});
        particle.recentlyDropped = true;
        this.particles[String(id)] = particle;
        particle.addToEngine(this.engine.world);
        this.setState({
          betrowdisabeled:true
        },()=>{
          Engine.update(this.engine, this.state.TIMESTEP);    
        })
     
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
                let pgd = `peg${index}`
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
                  clearInterval(checkParticleStatus)
                  this.setState({
                  betrowdisabeled:false
                  })
                }
              }, 10);
            }
          })
    
        }, this.state.TIMESTEP);
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
       }else{
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
    
        return (
          <Row>
            <Col className="main_section" span={18} push={6} gutter={16}>
              <div className="canvas-container">
                <div id="techvr" />
                <div className={`pegs rows${this.state.ROWS}`}>
                  <div className="pegs_wrapper" >
                    {this.state.footer[`a${this.state.ROWS}`].map((el, i) => {
                      return <div className={`peg peg${i + 1}`} style={{top:this.state[`peg${i+1}`] ? '10px' : '0px'}}><span className="pegtext">{el}</span></div>
                    })}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        )
      }
}
