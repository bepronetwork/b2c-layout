import React, { Component } from "react";
import {Typography } from "components";
import { getBet } from "../../lib/api/app";
import DiceDetails from './Game/DiceDetails';
import FlipDetails from './Game/FlipDetails';
import RouletteDetails from './Game/RouletteDetails';
import WheelDetails from './Game/WheelDetails';


import "./index.css";

class BetDetails extends Component {

    
    constructor(props){
        super(props);
        this.state = {
            component: null
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
                component = <DiceDetails response={response}/>;
                break;
            case 'keno':
                component = <DiceDetails response={response}/>;
                break;
        }
             
        this.setState({
            component
        });
        console.log(response)
    }
    
    render() {
        const { component } = this.state;

        if (component === null) { return null };

        return (
            <div>
                {component}
            </div>
        )
    }
}



export default BetDetails;