import React, { Component } from "react";
import {Typography } from "components";
import { getBet } from "../../lib/api/app";
import DiceDetails from './Game/DiceDetails';
import FlipDetails from './Game/FlipDetails';
import RouletteDetails from './Game/RouletteDetails';
import WheelDetails from './Game/WheelDetails';
import PlinkoDetails from './Game/PlinkoDetails';


import "./index.css";

class BetDetails extends Component {

    
    constructor(props){
        super(props);
        this.state = {
            component: null,
            clientSeed: null,
            serverHashedSeed: null,
            serverSeed: null,
            timestamp: null,
            winAmount: null,
            betAmount: null,
            game: null
        };
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        const { betId } = props;
        let component = null; 

        const response = await getBet({ betId });
        const game = response.game;

        switch (game.metaName) {
            case 'linear_dice_simple':
                component = <DiceDetails response={response}/>;
                break;
            case 'coinflip_simple':
                component = <FlipDetails response={response}/>;
                break;
            case 'european_roulette_simple':
                component = <RouletteDetails response={response}/>;
                break;
            case 'wheel_simple':
                component = <WheelDetails response={response}/>;
                break;
             case 'wheel_variation_1':
                component = <WheelDetails response={response}/>;
                break;
            case 'plinko_variation_1':
                component = <PlinkoDetails response={response}/>;
                break;
            case 'keno':
                component = <DiceDetails response={response}/>;
                break;
        }
             
        this.setState({
            component,
            clientSeed: response.clientSeed,
            serverHashedSeed: response.serverHashedSeed,
            serverSeed: response.serverSeed,
            timestamp: response.timestamp,
            winAmount: response.winAmount,
            betAmount: response.betAmount,
            game 
        });
        console.log(response)
    }
    
    render() {
        const { component, clientSeed, serverHashedSeed, serverSeed, timestamp, winAmount, betAmount, game } = this.state;

        if (component === null) { return null };

        return (
            <div styleName="root">
                <div styleName="game">
                    {component}
                </div>
                <div styleName="seed">
                    <div>
                        <div styleName='label'>
                            <Typography variant={'x-small-body'} color={`white`}>
                                Semente do Servidor
                            </Typography>
                        </div>
                        <div styleName='text'>
                            <Typography variant={'x-small-body'} color={`casper`}>
                                {serverSeed}
                            </Typography>
                        </div>
                    </div>
                    <div>
                        <div styleName='label'>
                            <Typography variant={'x-small-body'} color={`white`}>
                                Semente do Servidor
                            </Typography>
                        </div>
                        <div styleName="element">
                            <div styleName='text'>
                                <Typography variant={'x-small-body'} color={`casper`}>
                                    {serverSeed}
                                </Typography>
                            </div>
                            <div>
                                <button onClick={this.copyToClipboard} styleName='text-seed'>
                                    <Typography variant={'small-body'} color={'white'}>
                                        Copiar
                                    </Typography>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}



export default BetDetails;