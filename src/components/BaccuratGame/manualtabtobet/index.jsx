import React, { Component } from 'react';
import {Input,Button, Divider,Checkbox} from 'antd';
import SliderChips from '../sliderchips';
class ManualTabToBet extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
      
        return ( 
            <div className="manual_tab">
                <>
                <label>Chip Value ({this.props.selectedchipvalue})</label>
                <SliderChips {...this.props}/>
                </>
                <>
                <label>Total Bet</label>
                <div className="total_bet">
                <Input value={this.props.totalBetAmount} size={'large'} readOnly={true}/>
                <Button size={'large'} onClick={this.props.handleCoin.bind(this,'half')} disabled={this.props.gameRunning}>½</Button>
                <Divider type={"vertical"} /> 
                <Button size={'large'} onClick={this.props.handleCoin.bind(this,'double')} disabled={this.props.gameRunning}>2×</Button>        
                </div>
                </>
                <>
                <div className="squeeze">
                <Checkbox
                checked={this.props.squeezechecked}
                disabled={this.props.gameRunning}
                onChange={this.props.handlesqueezechecked.bind(this,'manual')}
                     >
                Enable Squeeze
                </Checkbox>
                </div>
                </>
                <>
                <Button className="bet-btn" block size={'large'} disabled={this.props.manual_tab_bet_button} onClick={this.props.handleBet.bind(this,'handleManualBet')}>Bet</Button>
                </>
            </div>
         );
    }
}
 
export default ManualTabToBet;