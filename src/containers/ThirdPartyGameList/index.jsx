import React, { Component } from "react";
import { Typography, ThirdPartyGameCard, ThirdPartyProviderSelector, Button } from 'components';
import { connect } from "react-redux";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { getProvidersGames } from "../../lib/api/app";
import { getSkeletonColors, getApp } from "../../lib/helpers";
import { LinearProgress } from '@material-ui/core';
import queryString from 'query-string';
import _ from 'lodash';
import "./index.css";

class ThirdPartyGameList extends Component {

    constructor(props){
        super(props);
        this.state = {
            games: [],
            providers: [],
            providerId: null,
            isLoading: true,
            total: 0,
            quantity: 0
        };
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        const { params } = props.match;

        let providerId = String(params.providerGameId);
        this.changeProvider(providerId);
        const providers = getApp().casino_providers.filter(p => p.activated === true);

        this.setState({ providerId, providers });
    }

    formatGames(games) {
        let { quantity } = this.state;
        let gameList = [];

        games.map( p => {
            const url = p.api_url;
            const provider = p.name;
            const partnerId = p.partner_id;

            if(typeof p.list.games != "undefined") {
                p.list.games.map( g => { 
                    const icon = url + g.icon;
                    const game = {
                        id: g.id,
                        url,
                        partnerId,
                        provider,
                        icon,
                        title: g.title
                    }
                    gameList.push(game);
                });
            }
        });

        const total = gameList.length;
        quantity = (quantity + 18) > total ? total : quantity + 18;

        this.setState({ games: gameList, total, quantity });
    }

    changeProvider = async (providerId) => {
        this.setState({ isLoading: true });

        const games = providerId === "all" ? await getProvidersGames() : await getProvidersGames({ providerEco: providerId });
        
        this.formatGames(games, providerId);

        this.setState({ isLoading: false, providerId });
    }

    createSkeletonGames = () => {
        let games = []

        for (let i = 0; i < 18; i++) {
            games.push(
                <div class={"col"} styleName="col">
                    <div styleName="root">
                        <div styleName="image-container dice-background-color">
                            <div styleName="icon">
                                <Skeleton width={"180"} height={"150"}/>
                            </div>
                        </div>
                        <div styleName="labels">
                            <div styleName="title">
                                <Skeleton width={"120"} height={"20"}/>
                            </div>
                            <div styleName='info-holder'>
                                <Skeleton width={"20"} height={"20"} circle={true}/> 
                            </div>
                        </div>
                        <div styleName="title">
                            <Skeleton width={"80"} height={"20"}/>
                        </div>
                    </div>
                </div>
          );
        }

        return games;
    }

    onLoadMoreGames = async (id) => {
        let { quantity, total } = this.state;

        quantity = (quantity + 18) > total ? total : quantity + 18;

        this.setState({ quantity });
    }


    render() {
        const { onHandleLoginOrRegister, history } = this.props;
        const { games, isLoading, total, quantity, providerId, providers } = this.state;

        return (
            <div styleName="container">
                {
                isLoading == true ?
                    <SkeletonTheme color={ getSkeletonColors().color} highlightColor={ getSkeletonColors().highlightColor}>
                        <div style={{opacity : '0.5'}}> 
                            <div styleName="container-small">
                                {this.createSkeletonGames()}
                            </div>
                        </div>
                    </SkeletonTheme>
                :
                <div>
                    <div styleName="provider">
                        <Typography variant="x-small-body" color="white">
                            Provider
                        </Typography>
                        <ThirdPartyProviderSelector providers={providers} providerId={providerId} onChangeProvider={this.changeProvider}/>  
                    </div>
                    <div styleName="container-small">
                        {games.slice(0, quantity).map(g => {
                            const game = {
                                id: g.id, 
                                partnerId: g.partnerId, 
                                url: g.url,
                                icon: g.icon,
                                title: g.title,
                                provider: g.provider
                            };
                            return (
                                <ThirdPartyGameCard game={game} onHandleLoginOrRegister={onHandleLoginOrRegister} history={history}/>
                            )
                        })}
                    </div>
                </div>
                }
                {
                    quantity < total
                    ?
                        <div styleName="progress">
                            <div styleName="line">
                                <LinearProgress variant="determinate" value={(quantity / total) * 100} />
                            </div>
                            <div styleName="text">
                                <Typography variant="x-small-body" color="white">
                                    {`Displaying ${quantity} of ${total} games`}
                                </Typography>
                            </div>
                            <Button size={'x-small'} theme={'action'} onClick={() => this.onLoadMoreGames()}>
                                <Typography color={'white'} variant={'small-body'}>Load More</Typography>
                            </Button>
                        </div>
                    :
                        null
                }
            </div>
        );
    }
}


function mapStateToProps(state){
    return {
        profile: state.profile,
        ln : state.language
    };
}

export default connect(mapStateToProps)(ThirdPartyGameList);

