import React, { Component } from "react";
import { connect } from "react-redux";
import {Typography } from "components";
import { getBet } from "../../lib/api/app";
import CasinoDetails from "./CasinoDetails";
import EsportsDetails from "./EsportsDetails";
import DiceDetails from './CasinoDetails/Game/DiceDetails';
import FlipDetails from './CasinoDetails/Game/FlipDetails';
import RouletteDetails from './CasinoDetails/Game/RouletteDetails';
import WheelDetails from './CasinoDetails/Game/WheelDetails';
import PlinkoDetails from './CasinoDetails/Game/PlinkoDetails';
import KenoDetails from './CasinoDetails/Game/KenoDetails';
import DiamondDetails from './CasinoDetails/Game/DiamondDetails';
import SlotsDetails from './CasinoDetails/Game/SlotsDetails';
import "./index.css";

class BetDetails extends Component {

    
    constructor(props){
        super(props);
        this.state = {
            bet: null,
            isFake: false,
            tag: "casino",
            isLoading: true
        };
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        const { betId, tag } = props;
        let component = null; 

        this.setState({ tag });

        const response = await getBet({ betId, tag });

        if (response.status === 200) {
            if(tag === "esports") {
                const bet = response.message;

                this.setState({
                    isLoading: false,
                    bet
                });
            }
            else {
                const bet = response.message;
                const game = bet.game;
    
                switch (game.metaName) {
                    case 'linear_dice_simple':
                        component = <DiceDetails bet={bet}/>;
                        break;
                    case 'coinflip_simple':
                        component = <FlipDetails bet={bet}/>;
                        break;
                    case 'european_roulette_simple':
                        component = <RouletteDetails bet={bet}/>;
                        break;
                    case 'wheel_simple':
                        component = <WheelDetails bet={bet}/>;
                        break;
                    case 'wheel_variation_1':
                        component = <WheelDetails bet={bet}/>;
                        break;
                    case 'plinko_variation_1':
                        component = <PlinkoDetails bet={bet}/>;
                        break;
                    case 'keno_simple':
                        component = <KenoDetails bet={bet}/>;
                        break;
                    case 'diamonds_simple':
                        component = <DiamondDetails bet={bet}/>;
                        break;
                    case 'slots_simple':
                        component = <SlotsDetails bet={bet}/>;
                        break;
                }
    
                    
                this.setState({
                    isLoading: false,
                    bet
                });
            }
        }
        else {
            this.setState({ isFake: true, isLoading: false });
        }
    }
    
    render() {
        const { bet, isFake, tag, isLoading } = this.state;

        return (

            isFake == true
            ?
                <div styleName="restricted">
                    <Typography variant={'body'} color={`casper`}>
                            Restricted data
                    </Typography>
                </div>
            :
                tag == "casino"
                ?
                    <CasinoDetails bet={bet} isLoading={isLoading} />
                : 
                    <EsportsDetails bet={bet} isLoading={isLoading} />

        )
    }
}

function mapStateToProps(state){
    return {
        profile : state.profile,
        ln : state.language
    };
}

export default connect(mapStateToProps)(BetDetails);