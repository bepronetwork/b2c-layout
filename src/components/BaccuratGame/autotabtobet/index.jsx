import React, { Component } from 'react';
import {Input,Radio,Button, Divider} from 'antd';
import SliderChips from '../sliderchips';
class AutoTabToBet extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div className="auto_tab manual_tab">
                 <>
                <label>Chip Value ({this.props.selectedchipvalue}) {this.props.gameRunning ? 'active' : 'inactive'}</label>
                <SliderChips {...this.props}/>
                </>
                <>
                <label>Total Bet</label>
                <div className="total_bet">
                <Input value={this.props.totalBetAmount} size={'large'} readOnly={true}/>
                <Button disabled={this.props.gameRunning} size={'large'} onClick={this.props.handleCoin.bind(this,'half')}>½</Button>
                <Divider type={"vertical"} /> 
                <Button disabled={this.props.gameRunning} size={'large'} onClick={this.props.handleCoin.bind(this,'double')}>2×</Button>        
                </div>
                </>
                <>
                <label>Number of Bets</label>
                <div className="total_bet">
                <Input readOnly={this.props.gameRunning} onChange={this.props.handleAutobetInput} value={this.props.numberofbets} size={'large'} type='number'/>       
                </div>
                </>
                <>
                <label>On Win</label>
                <div className="total_bet">
                <Radio.Group onChange={this.props.on_change_win} defaultValue="reset">
                    <Radio.Button disabled={this.props.gameRunning} value="reset">Reset</Radio.Button>
                    <Radio.Button disabled={this.props.gameRunning} value="increase by">Increase by:</Radio.Button>
                </Radio.Group>
                <Input readOnly={this.props.gameRunning} defaultValue="0" size={'large'} type='number' addonAfter={'%'}/>       
                </div>
                </>
                <>
                <label>On Loss</label>
                <div className="total_bet">
                <Radio.Group onChange={this.props.on_change_loss} defaultValue="reset">
                    <Radio.Button disabled={this.props.gameRunning} value="reset">Reset</Radio.Button>
                    <Radio.Button disabled={this.props.gameRunning} value="increase by">Increase by:</Radio.Button>
                </Radio.Group>
                <Input defaultValue="0" readOnly={this.props.gameRunning} size={'large'} type='number' addonAfter={'%'}/>       
                </div>
                </>
                <>
                <label>Stop on Profit</label>
                <div className="total_bet">
                <Input readOnly={this.props.gameRunning} defaultValue="0.0000000" size={'large'} type='number'/>       
                </div>
                </>
                <>
                <label>Stop on Loss</label>
                <div className="total_bet">
                <Input readOnly={this.props.gameRunning} defaultValue="0.0000000" size={'large'} type='number'/>       
                </div>
                </>
                <>
                {this.props.auto_tab_bet_button_text === "Start Autobet" && <Button 
                className="bet-btn" 
                block 
                size={'large'} 
                disabled={this.props.auto_tab_bet_button} 
                onClick={this.props.handleBet.bind(this,'handleautobet','startgame')}
                >{this.props.auto_tab_bet_button_text}</Button>}
                {this.props.auto_tab_bet_button_text === "Stop Autobet" && <Button 
                className="bet-btn" 
                block 
                size={'large'}
                onClick={this.props.handleBet.bind(this,'stopAutobet')}
                >{this.props.auto_tab_bet_button_text}</Button>}
                {this.props.auto_tab_bet_button_text === "Finishing Bet" && <Button 
                className="bet-btn" 
                block 
                size={'large'}
                disabled={true}
                >{this.props.auto_tab_bet_button_text}</Button>}
                
                </>
            </div>
         );
    }
}
export default AutoTabToBet;