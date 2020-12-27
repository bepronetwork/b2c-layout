import React, { Component } from "react";
import { connect } from "react-redux";
import {Typography } from "components";
import { getGames as getVideoGames } from "controllers/Esports/EsportsUser";
import Match from './Match';
import { formatCurrency } from "../../../utils/numberFormatation";
import { getApp, getSkeletonColors } from "../../../lib/helpers";
import { CopyText } from "../../../copy";
import classNames from "classnames";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import _ from 'lodash';
import "./index.css";

const stateOptions = Object.freeze({
    won: { text: "Won", color: "green" },
    lost: { text: "Lost", color: "red" },
    pending: { text: "Pending", color: "primaryLight" }
});


const typeOptions = Object.freeze({
    simple: { text: "Simple", color: "primaryLight" },
    multiple: { text: "Multiple", color: "primaryDark" }
});
class EsportsDetails extends Component {
   
    constructor(props){
        super(props);
        this.state = {
            matches: [],
            created_at: null,
            winAmount: null,
            betAmount: null,
            game: null,
            userName: null,
            isWon: true,
            currencyImage: null,
            type: null,
            resolved: false,
            isLoading: true
        };
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    UNSAFE_componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        const { bet } = props;
        const { matches } = this.state;

        if (!_.isEmpty(bet)) {
            for (let index = 0; index < bet.result.length; index++) {
                const match = bet.result[index].data_external_match;
                match = {...match, status: bet.result[index].status, odd: bet.result[index].odd}
                matches.push(match);
            }

            const images = require.context('assets/esports', true);
            const games = await getVideoGames();
            let videogame = bet.result.map(r => {
                const game = games.find(g => r.match.videogame === g._id);
                return {
                    id: game._id,
                    name: game.name,
                    image_url: images('./' + game.slug + '-ico.png')
                }
            });
            videogame = videogame.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);

            const currenncy = (getApp().currencies.find(currency => currency._id === bet.currency));
                
            this.setState({
                matches,
                created_at: bet.created_at.replace('Z', ' ').replace('T', ' '),
                winAmount: formatCurrency(bet.winAmount),
                betAmount: formatCurrency(bet.betAmount),
                userName: bet.user.username,
                isWon: bet.isWon,
                currencyImage: currenncy.image,
                game: videogame,
                type: bet.type,
                resolved: bet.resolved,
                isLoading: false
            });
        }

    }
    
    render() {
        const { ln, bet } = this.props;
        const { matches, created_at, winAmount, betAmount, game, userName, isWon, currencyImage, type, resolved, isLoading } = this.state;
        const copy = CopyText.betsdetailspage[ln];
        let totalMultipleOdd = 1;

        if(!_.isEmpty(bet)) {
            bet.result.map(b => {
                totalMultipleOdd = totalMultipleOdd * b.odd;
            });
        }

        const typeOption = type === "multiple" ? typeOptions.multiple : typeOptions.simple;
        const typeStyles = classNames("status", [typeOption.color]);
        const stateOption = resolved === false ? stateOptions.pending : isWon === true ? stateOptions.won : stateOptions.lost;
        const stateStyles = classNames("status", [stateOption.color]);

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
                                        <div>
                                            <div styleName='label'>
                                                <Skeleton width={100} height={50}/>
                                            </div>
                                        </div>
                                        <div styleName="win">  
                                            <div styleName='label'>
                                                <Skeleton width={100} height={50}/>
                                            </div>
                                        </div>
                                        <div>  
                                            <div styleName='label'>
                                                <Skeleton width={100} height={50}/>
                                            </div>
                                        </div>
                                        <div styleName="win">  
                                            <div styleName='label'>
                                                <Skeleton width={100} height={50}/>
                                            </div>
                                        </div>
                                        <div>  
                                            <div styleName='label'>
                                                <Skeleton width={100} height={50}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Skeleton width={300} height={50}/>
                                    </div>
                                </div>
                                <div styleName="matches">
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
                                <div styleName="games">
                                {
                                    game.map(g => {
                                        return (
                                            <h1 styleName="rule-h1">
                                                <img styleName="image-icon" src={g.image_url} alt="Game" /> 
                                                <Typography variant='small-body' color={"grey"} weight={"bold"}> {g.name} </Typography>
                                            </h1>
                                        )
                                    })
                                }
                                </div>
                                <div>
                                    <div styleName='label'>
                                        <Typography variant={'x-small-body'} color={`casper`}>
                                            {copy.TEXT[0]}: {userName}
                                        </Typography>
                                    </div>
                                    <div styleName='bet-text'>
                                        <Typography variant={'x-small-body'} color={`white`}>
                                            {created_at}
                                        </Typography>
                                    </div>
                                </div>
                                <div styleName="bet">
                                    <div>
                                        <div styleName='label'>
                                            <Typography variant={'x-small-body'} color={`casper`}>
                                                {copy.TEXT[1]}
                                            </Typography>
                                        </div>
                                        <div styleName='bet-text'>
                                            <Typography variant={'x-small-body'} color={`white`}>
                                                {betAmount}
                                            </Typography>
                                            <img src={currencyImage} width={16} height={16} alt="Currency"/>
                                        </div>
                                    </div>
                                    <div styleName="win">  
                                        <div styleName='label'>
                                            <Typography variant={'x-small-body'} color={`casper`}>
                                                {copy.TEXT[2]}
                                            </Typography>
                                        </div>
                                        <div styleName='bet-text'>
                                            <Typography variant={'x-small-body'} color={isWon === true ? `green` : `white`}>
                                                {winAmount}
                                            </Typography>
                                            <img src={currencyImage} width={16} height={16} alt="Currency"/>
                                        </div>
                                    </div>
                                    <div styleName="top">  
                                        <div styleName='label'>
                                            <Typography variant={'x-small-body'} color={`casper`}>
                                                Type
                                            </Typography>
                                        </div>
                                        <div styleName='bet-text'>
                                            <div styleName={typeStyles}>
                                                <Typography variant={'x-small-body'} color={`fixedwhite`} weight={"bold"}>
                                                    {typeOption.text}
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>
                                    <div styleName="win top">   
                                        <div styleName='label'>
                                            <Typography variant={'x-small-body'} color={`casper`}>
                                                Odds
                                            </Typography>
                                        </div>
                                        <div styleName='bet-text'>
                                            <Typography variant={'x-small-body'} color={`white`}>
                                                {totalMultipleOdd.toFixed(2)}
                                            </Typography>
                                        </div>
                                    </div>
                                    <div styleName="top">  
                                        <div styleName='label'>
                                            <Typography variant={'x-small-body'} color={`casper`}>
                                                Status
                                            </Typography>
                                        </div>
                                        <div styleName='bet-text'>
                                            <div styleName={stateStyles}>
                                                <Typography variant={'x-small-body'} color={`fixedwhite`} weight={"bold"}>
                                                    {stateOption.text}
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div styleName="matches">
                                {
                                    matches.map(m => {
                                        return (
                                            <div styleName="match">
                                                <Match bet={bet} match={m} />
                                            </div>
                                        )
                                    })
                                }
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

export default connect(mapStateToProps)(EsportsDetails);