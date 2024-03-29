import React, { Component } from "react";
import { Typography, InfiniteCarousel, ThirdPartyGameCard, GameCounter } from 'components';
import { connect } from "react-redux";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { getProvidersGames } from "../../lib/api/app";
import { getSkeletonColors, getApp, getAppCustomization } from "../../lib/helpers";
import _ from 'lodash';
import { CopyText } from "../../copy";
import "./index.css";

class ThirdPartyGames extends Component {

    constructor(props){
        super(props);
        this.state = {
            providers: [],
            games: [],
            providerId: null,
            partnerId: null,
            isLoading: true,
            isLoadingGames: true,
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
        this.setState({ isLoading: true, isLoadingGames: true });

        const providers = getApp().casino_providers.filter(p => p.activated === true);
        const games = await getProvidersGames();
        
        this.formatGames(games);

        this.setState({ providers, isLoading: false, isLoadingGames: false });

    }

    formatGames(games) {
        let gameList = [];
        let { quantity } = this.state;

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
            else {
                this.setState({ isLoading: false, isLoadingGames: false });
            }
        });

        const total = gameList.length;

        this.setState({ games: gameList, total });
    }

    linkToGameListPage(id) {
        const url = id === null ? `/games/all` : `/games/${id}`;
        this.props.history.push(url);
    }

    onClickProvider = async (id) => {
        this.setState({ isLoadingGames: true });

        const games = await getProvidersGames({ providerEco: id });
        this.formatGames(games);
        
        this.setState({ providerId: id, isLoadingGames: false });
    }

    createSkeletonProviders = () => {
        let providers = []

        for (let i = 0; i < 6; i++) {
            providers.push(
                <div class={"col"} styleName="col">
                    <div styleName="root">
                        <a>
                            <div>
                                <Skeleton width={"175"} height={"70"}/>
                            </div>
                        </a>
                    </div>
                </div>
          );
        }

        return providers;
    }

    createSkeletonGames = () => {
        let games = []

        for (let i = 0; i < 12; i++) {
            games.push(
                <div class={"col"} styleName="col">
                    <div styleName="root-skeleton">
                        <div styleName="image-container">
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

    onLoadMoreGames = quantity => {
        this.setState({ quantity });
    };    

    render() {
        const { onHandleLoginOrRegister, history, ln } = this.props;
        const { providers, games, isLoading, isLoadingGames, total,  quantity, providerId } = this.state;
        const skin = getAppCustomization().skin.skin_type;
        const copy = CopyText.thirdPartyGamesIndex[ln];

        return (
            <div>
                <div styleName="container">
                {
                    isLoading == true ?
                        <SkeletonTheme color={ getSkeletonColors().color} highlightColor={ getSkeletonColors().highlightColor}>
                            <div style={{opacity : '0.5'}}> 
                                <div styleName="container-small carousel">
                                    {this.createSkeletonProviders()}
                                </div>
                            </div>
                        </SkeletonTheme>
                    :
                        providers.length > 0
                        ?
                            <div styleName="carousel">
                                <InfiniteCarousel
                                    breakpoints={[
                                    {
                                        breakpoint: 500,
                                        settings: {
                                            slidesToShow: 2,
                                            slidesToScroll: 1,
                                        },
                                    },
                                    {
                                        breakpoint: 768,
                                        settings: {
                                            slidesToShow: 3,
                                            slidesToScroll: 2,
                                        },
                                    },
                                    ]}
                                    dots={false}
                                    showSides={true}
                                    sidesOpacity={0.5}
                                    sideSize={0}
                                    slidesToScroll={2}
                                    slidesToShow={6}
                                    scrollOnDevice={true}
                                    title={skin == "digital" ? copy.TITLE : copy.TITLE}
                                    >
                                    {
                                        providers.map(p => {
                                            return(
                                                <div class={"col"} styleName="col">
                                                    <div styleName="root" onClick={() => this.onClickProvider(p.providerEco)}>
                                                        <a>
                                                            <div>
                                                                <img alt={p.name} src={p.logo} />
                                                            </div>
                                                        </a>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </InfiniteCarousel>
                            </div>
                        :
                            null
                }
                </div>
                <div styleName="container">
                {
                    isLoadingGames == true ?
                        <SkeletonTheme color={ getSkeletonColors().color} highlightColor={ getSkeletonColors().highlightColor}>
                            <div style={{opacity : '0.5'}}> 
                                <div styleName="container-small">
                                    {this.createSkeletonGames()}
                                </div>
                            </div>
                        </SkeletonTheme>
                    :
                    providers.length > 0
                    ?
                        <div>
                            <div styleName="show" onClick={() => this.linkToGameListPage(providerId)}>
                                <Typography variant="small-body" color="white">
                                    {`${copy.ALL} (${total})`}
                                </Typography>
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
                    : 
                        null
                }
                <GameCounter
                    total={total}
                    label={CopyText.gameCounter[ln].DESCRIPTION}
                    buttonLabel={CopyText.gameCounter[ln].BUTTON}
                    factorBase={18}
                    onMore={this.onLoadMoreGames}
                />
                </div>
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

export default connect(mapStateToProps)(ThirdPartyGames);
