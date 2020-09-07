import React, { Component } from "react";
import { Typography, ThirdPartyGameCard, Button } from 'components';
import { connect } from "react-redux";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { getProvidersGames } from "../../lib/api/app";
import { getSkeletonColors } from "../../lib/helpers";
import { LinearProgress } from '@material-ui/core';
import queryString from 'query-string';
import _ from 'lodash';
import "./index.css";

class ThirdPartyGameList extends Component {

    constructor(props){
        super(props);
        this.state = {
            games: [],
            providerId: null,
            providerName: "All",
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
        this.setState({ isLoading: true });

        const queryParams = queryString.parse(this.props.location.search);
        const providerId = queryParams.providerGameId;

        const games = await getProvidersGames({ providerEco: providerId });
        
        this.formatGames(games, providerId);

        this.setState({ isLoading: false, providerId });
    }

    formatGames(games, providerId) {
        let { quantity } = this.state;
        let gameList = [];
        let providerName;

        games.map( p => {
            const url = p.api_url;
            const provider = p.name;
            const partnerId = p.partner_id;
            providerName = p.name;

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

        const total = gameList.length;
        quantity = (quantity + 16) > total ? total : quantity + 16;

        this.setState({ games: gameList, total, quantity, providerName: providerId ? providerName : "All" });
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

    onLoadMoreGames = async (id) => {
        let { quantity, total } = this.state;

        quantity = (quantity + 16) > total ? total : quantity + 16;

        this.setState({ quantity });
    }


    render() {
        const { onHandleLoginOrRegister, history } = this.props;
        const { games, isLoading, providerName, total, quantity } = this.state;
        console.log("total", total)
        console.log("quantity", quantity)

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
                        <Typography variant="small-body" color="white">
                            {`Provider: ${providerName}`}
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

