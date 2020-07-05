import React, { Component } from "react";
import { Typography } from 'components';
import { Shield, Opponents, Status } from "components/Esports";
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import { formatToSimpleDate, getSkeletonColors } from "../../../lib/helpers";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import _ from 'lodash';
import "./index.css";
import loadingGif from 'assets/loading.gif';

class Matches extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    createSkeletonRows = () => {
        let rows = []

        for (let i = 0; i < 10; i++) {
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

    renderMatch(match, beginDate) {
        const { games } = this.props;
        const gameImage = games.find(g => g.external_id === match.videogame.id).image;

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

                <Link to={`/esports/${match.slug}-${match.id}`}>
                    <div styleName="match">
                        <div styleName="match-tour">
                            <div styleName="tour-name">
                                <Shield image={gameImage} size={"medium"} />
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
                        <Opponents 
                            opponents={match.opponents} 
                            results={match.results}
                            odds={match.odds}
                            gameImage={gameImage} 
                            isScoreBoard={match.status == "finished" || match.status == "settled" ? true : false}
                        />
                        <Status 
                            status={match.status} 
                            date={match.begin_at} 
                            isMobile={false}
                            hasLiveTransmition={!_.isEmpty(match.live_embed_url)} 
                        />
                    </div>
                </Link>
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
                            {this.createSkeletonRows()}
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
                                loader={<div styleName="loading-gif"><img src={loadingGif} /></div>}
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