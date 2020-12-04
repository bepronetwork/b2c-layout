import React, { Component } from "react";
import { connect } from "react-redux";
import {Typography } from "components";
import DiceDetails from './Game/DiceDetails';
import FlipDetails from './Game/FlipDetails';
import RouletteDetails from './Game/RouletteDetails';
import WheelDetails from './Game/WheelDetails';
import PlinkoDetails from './Game/PlinkoDetails';
import KenoDetails from './Game/KenoDetails';
import { formatCurrency } from "../../../utils/numberFormatation";
import { getApp, getSkeletonColors } from "../../../lib/helpers";
import { CopyText } from "../../../copy";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import _ from 'lodash';
import "./index.css";

class CasinoDetails extends Component {

    
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
            game: null,
            userName: null,
            isWon: true,
            currencyImage: null
        };
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        const { bet } = props;
        let component = null; 

        if (!_.isEmpty(bet)) {
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
            }
    
            const currenncy = (getApp().currencies.find(currency => currency._id == bet.currency._id));
                
            this.setState({
                component,
                clientSeed: bet.clientSeed,
                serverHashedSeed: bet.serverHashedSeed,
                serverSeed: bet.serverSeed,
                timestamp: bet.timestamp.replace('Z', ' ').replace('T', ' '),
                winAmount: formatCurrency(bet.winAmount),
                betAmount: formatCurrency(bet.betAmount),
                userName: bet.user.username,
                isWon: bet.isWon,
                currencyImage: currenncy.image,
                game
            });
        }

    }
    
    render() {
        const { ln, isLoading } = this.props;
        const { component, clientSeed, serverHashedSeed, serverSeed, timestamp, winAmount, betAmount, game, userName, isWon, currencyImage } = this.state;
        const copy = CopyText.betsdetailspage[ln];

        return (
            <div>
                {isLoading 
                    ?
                        <SkeletonTheme color={ getSkeletonColors().color} highlightColor={ getSkeletonColors().highlightColor}>
                            <div styleName="root" style={{opacity : '0.5'}}>
                                <div styleName="game">
                                    <div>
                                        <h1 styleName="rule-h1">
                                            <Skeleton width={60} height={60} circle={true}/>
                                        </h1>
                                    </div>
                                    <div>
                                        <div styleName='label'>
                                            <Skeleton width={100} height={30}/>
                                        </div>
                                    </div>
                                    <div styleName="bet">
                                        <div styleName="amount">
                                            <div styleName='label'>
                                                <Skeleton width={100} height={50}/>
                                            </div>
                                        </div>
                                        <div styleName="win">  
                                            <div styleName='label'>
                                                <Skeleton width={100} height={50}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Skeleton width={300} height={50}/>
                                    </div>
                                </div>
                                <div styleName="seed">
                                    <div styleName="client">
                                        <div>
                                            <div styleName='label'>
                                                <Skeleton width={150} height={30}/>
                                            </div>
                                        </div>
                                        <div>
                                            <div styleName='label'>
                                                <Skeleton width={150} height={30}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div styleName='label'>
                                            <Skeleton width={300} height={30}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SkeletonTheme>
                    :
                    <div>
                        <div styleName="root">
                            <div styleName="game">
                                <div>
                                    <h1 styleName="rule-h1">
                                        <img styleName="image-icon" src={game.image_url}/> 
                                        <Typography variant='small-body' color={"grey"} weight={"bold"}> {game.name} </Typography>
                                    </h1>
                                </div>
                                <div>
                                    <div styleName='label'>
                                        <Typography variant={'x-small-body'} color={`casper`}>
                                            {copy.TEXT[0]}: {userName}
                                        </Typography>
                                    </div>
                                    <div styleName='bet-text'>
                                        <Typography variant={'x-small-body'} color={`white`}>
                                            {timestamp}
                                        </Typography>
                                    </div>
                                </div>
                                <div styleName="bet">
                                    <div styleName="amount">
                                        <div styleName='label'>
                                            <Typography variant={'x-small-body'} color={`casper`}>
                                                {copy.TEXT[1]}
                                            </Typography>
                                        </div>
                                        <div styleName='bet-text'>
                                            <Typography variant={'x-small-body'} color={`white`}>
                                                {betAmount}
                                            </Typography>
                                            <img src={currencyImage} width={16} height={16}/>
                                        </div>
                                    </div>
                                    <div styleName="win">  
                                        <div styleName='label'>
                                            <Typography variant={'x-small-body'} color={`casper`}>
                                                {copy.TEXT[2]}
                                            </Typography>
                                        </div>
                                        <div styleName='bet-text'>
                                            <Typography variant={'x-small-body'} color={isWon == true ? `green` : `white`}>
                                                {winAmount}
                                            </Typography>
                                            <img src={currencyImage} width={16} height={16}/>
                                        </div>
                                    </div>
                                </div>
                                {component}
                            </div>
                            <div styleName="seed">
                                <div styleName="client">
                                    <div>
                                        <div styleName='label'>
                                            <Typography variant={'x-small-body'} color={`casper`}>
                                                {copy.TEXT[3]}
                                            </Typography>
                                        </div>
                                        <div styleName='text'>
                                            <Typography variant={'x-small-body'} color={`white`}>
                                                {serverSeed}
                                            </Typography>
                                        </div>
                                    </div>
                                    <div>
                                        <div styleName='label'>
                                            <Typography variant={'x-small-body'} color={`casper`}>
                                                {copy.TEXT[4]}
                                            </Typography>
                                        </div>
                                        <div styleName='text'>
                                            <Typography variant={'x-small-body'} color={`white`}>
                                                {clientSeed}
                                            </Typography>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div styleName='label'>
                                        <Typography variant={'x-small-body'} color={`casper`}>
                                            {copy.TEXT[5]}
                                        </Typography>
                                    </div>
                                    <div styleName='text'>
                                        <Typography variant={'x-small-body'} color={`white`}>
                                            {serverHashedSeed}
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>   
                }
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        profile : state.profile,
        ln : state.language
    };
}

export default connect(mapStateToProps)(CasinoDetails);