import React, { Component } from "react";
import { Typography } from 'components';
import { Shield, Opponents, Status } from "components/Esports";
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { formatToSimpleDate, getSkeletonColors } from "../../../lib/helpers";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import _ from 'lodash';
import "./index.css";

import LockTwoToneIcon from '@material-ui/icons/LockTwoTone';

class Matches extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    createSkeletonRows = (size) => {
        let rows = []

        for (let i = 0; i < size; i++) {
            rows.push(
                <div styleName="skeleton-match">
                    <div styleName="skeleton-match-tour">
                        <div styleName="tour-name">
                            <Skeleton circle={true} height={30} width={30}/>
                            <div styleName="match-name">
                                <Skeleton height={20} width={150}/>
                            </div>
                        </div>
                    </div>
                    <Skeleton height={30} width={150}/>
                    <div styleName="skeleton-opponent">
                        <Skeleton height={20} width={20}/>
                    </div>
                    <Skeleton height={30} width={150}/>
                    <div styleName="skeleton-date">
                        <Skeleton height={20} width={100}/>
                    </div>
                </div>
            );
        }

        return rows
    }

    goToMatch(slug, id) {
        this.props.history.push(`/esports/${slug}-${id}`);
    }

    renderMatch(match, beginDate) {
        const { games } = this.props;
        const game = games.find(g => g.external_id === match.videogame.id);
        if(!game){return null};
        const gameImage = game.image;

        const activeMarket = match.market ? match.market.status === 'active' : false;

        return (
            <div>
                {
                    
                    beginDate != formatToSimpleDate(match.begin_at)
                    ?
                        <div styleName="date">
                            <Typography variant={'x-small-body'} color={'grey'}>{formatToSimpleDate(match.begin_at)}</Typography>
                        </div>
                    :
                        null
                }
                <div styleName="match" onClick={() => this.goToMatch(match.slug, match.id)}>
                    <div styleName="match-tour">
                        <div styleName="tour-name">
                            <Shield image={gameImage} size={"small"} isFull={true} />
                            <div styleName="match-name">
                                <Typography variant={'x-small-body'} color={'white'}> {match.league.name}</Typography>
                                <span>
                                    <Typography variant={'x-small-body'} color={'grey'}>{match.serie.full_name}</Typography>
                                </span>
                            </div>
                        </div>
                        <Status 
                            status={match.status} 
                            date={match.begin_at} 
                            isMobile={true} 
                            hasLiveTransmition={!_.isEmpty(match.live_embed_url)} 
                        />
                    </div>
                    { !activeMarket && <div styleName="lock-icon-background">
                        <LockTwoToneIcon style={{ color: 'white' }} fontSize="inherit"/>
                    </div> }
                    <Opponents 
                        gameImage={gameImage} 
                        isScoreBoard={match.status == "finished" || match.status == "settled" ? true : false}
                        match={match}
                    />
                    <Status 
                        status={match.status} 
                        date={match.begin_at} 
                        isMobile={false}
                        hasLiveTransmition={!_.isEmpty(match.live_embed_url)} 
                    />
                </div>
            </div>
        );
    }

    render() {
        const { matches, onFetchMoreData, size, showInfiniteScroll=false, isLoading } = this.props;

        let beginDate = null;

        return (
            <div>
                {isLoading ?
                    <SkeletonTheme color={ getSkeletonColors().color} highlightColor={ getSkeletonColors().highlightColor}>
                        <div style={{opacity : '0.5'}}> 
                            {this.createSkeletonRows(10)}
                        </div>
                    </SkeletonTheme>
                :
                    matches.length > 0
                    ?
                        showInfiniteScroll == true
                        ?
                            <InfiniteScroll
                                dataLength={matches.length}
                                next={onFetchMoreData}
                                hasMore={matches.length % size === 0}
                                loader={(
                                    <SkeletonTheme color={ getSkeletonColors().color} highlightColor={ getSkeletonColors().highlightColor}>
                                        <div style={{opacity : '0.5'}}> 
                                            {this.createSkeletonRows(3)}
                                        </div>
                                    </SkeletonTheme>
                                )}
                                >   
                                { 
                                    matches.map(match => {
                                        const renderMatch =  this.renderMatch(match, beginDate);
                                        beginDate = formatToSimpleDate(match.begin_at);
                                        return renderMatch;
                                    })
                                }            
                            </InfiniteScroll>
                        :
                            matches.map(match => {
                                const renderMatch =  this.renderMatch(match, beginDate);
                                beginDate = formatToSimpleDate(match.begin_at);
                                return renderMatch;
                            })
                    :
                        <div styleName="empty">
                            <Typography color={'white'} variant={'small-body'}>Sorry, we couldn't find any matches in your search.</Typography>
                        </div>
                }
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        profile : state.profile,
        ln: state.language
    };
}

export default connect(mapStateToProps)(Matches);
