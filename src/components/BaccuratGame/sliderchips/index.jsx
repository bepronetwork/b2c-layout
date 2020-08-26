import React, { Component } from 'react';
import {Tabs} from 'antd';
import chipdot from '../../assets/images/chip_dot.svg';
import './index.css';

class SliderChips extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            chips:[{
                id:'chip_1',
                value:1,

            },{
                id:'chip_10',
                value:10,

            },
            {
                id:'chip_100',
                value:100,

            },
            {
                id:'chip_1k',
                value:'1k',

            },
            {
                id:'chip_10k',
                value:'10k',

            },
            {
                id:'chip_100k',
                value:'100k',

            },
            {
                id:'chip_1m',
                value:'1M',

            },
            {
                id:'chip_10m',
                value:'10M',

            },
            {
                id:'chip_100m',
                value:'100M',

            },
            {
                id:'chip_1b',
                value:'1B',

            },
            {
                id:'chip_10b',
                value:'10B',

            },
            {
                id:'chip_100B',
                value:'100B',

            },
            {
                id:'chip_1t',
                value:'1T',

            }]
         }
    }

    render() { 
        const {TabPane} = Tabs;      
        return ( 
            <Tabs onChange={this.props.handleChipClick} activeKey={this.props.activesliderchips.toString()} tabPosition={'top'} style={{ height: 220 }} className="slider_chips">
         
            {this.state.chips.map((el,i) => {
               return <TabPane disabled={this.props.gameRunning} tab={<div className="title" id={el.id} style={{backgroundImage:'url(' + chipdot + ')'}}><div className="chipvalue">{el.value}</div></div>} className="chip_" key={i+1}></TabPane>
                
             
            })}
        
        </Tabs>
         );
    }
}
 
export default SliderChips;