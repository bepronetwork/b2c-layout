import React, { Component } from "react";
import { Typography } from 'components';
import { connect } from "react-redux";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { getProvidersGames } from "../../lib/api/app";
import { getSkeletonColors, getApp } from "../../lib/helpers";
import InfiniteCarousel from 'react-leaf-carousel';
import _ from 'lodash';
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
            isLoadingGames: true
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

        games.map( p => {
            const url = p.api_url;
            const provider = p.name;
            const partnerId = p.partner_id;

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
        });

        this.setState({ games: gameList });
    }

    linkToGamePage({id, partnerId, url}) {
        const { profile, onHandleLoginOrRegister } = this.props;

        if (!profile || _.isEmpty(profile)) {
            return onHandleLoginOrRegister("login");
        }

        this.props.history.push(`/casino/${id}?partner_id=${partnerId}&url=${url}`);
    }

    onClickProvider = async (id) => {
        this.setState({ isLoadingGames: true });

        const games = await getProvidersGames({ providerEco: id });
        this.formatGames(games);
        
        this.setState({ providerId: id, isLoadingGames: false });
    }

    createSkeletonProviders = () => {
        let providers = []

        for (let i = 0; i < 4; i++) {
            providers.push(
                <div class={"col"} styleName="col">
                    <div styleName="root">
                        <a>
                            <div>
                                <Skeleton width={"175"} height={"100"}/>
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

        for (let i = 0; i < 8; i++) {
            games.push(
                <div class={"col"} styleName="col">
                    <div styleName="root">
                        <div styleName="image-container dice-background-color">
                            <div styleName="icon">
                                <Skeleton width={"250"} height={"150"}/>
                            </div>
                        </div>
                        <div styleName="labels">
                            <div styleName="title">
                                <Skeleton width={"150"} height={"30"}/>
                            </div>
                            <div styleName='info-holder'>
                                <Skeleton width={"60"} height={"20"}/> 
                            </div>
                        </div>
                    </div>
                </div>
          );
        }

        return games;
    }

    render() {
        const { providers, games, isLoading, isLoadingGames } = this.state;

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
                            sideSize={0.1}
                            slidesToScroll={2}
                            slidesToShow={4}
                            scrollOnDevice={true}
                            >
                            {
                                providers.map(p => {
                                    return(
                                        <div class={"col"} styleName="col">
                                            <div styleName="root" onClick={() => this.onClickProvider(p._id)}>
                                                <a>
                                                    <div>
                                                        <img width="175" height="70" alt={p.name} src={p.logo} />
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </InfiniteCarousel>
                    </div>
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
                    <div styleName="container-small">
                        {games.map(g => {
                            return (
                                <div class={"col"} styleName="col">
                                    <div styleName="root" onClick={() => this.linkToGamePage({id: g.id, partnerId: g.partnerId, url: g.url})}>
                                        <div styleName="image-container dice-background-color">
                                            <div styleName="icon">
                                                <img src={g.icon} styleName='game-icon'/>
                                            </div>
                                        </div>
                                        <div styleName="labels">
                                            <div styleName="title">
                                                <Typography variant="small-body" weight="semi-bold" color="white">
                                                    {g.title}
                                                </Typography>
                                            </div>
                                            <div styleName='info-holder'>
                                                <Typography variant={'x-small-body'} color={'grey'}>{g.provider}</Typography>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                }
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
