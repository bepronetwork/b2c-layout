import React, { Component } from "react";
import { Typography } from 'components';
import CloseIcon from "components/Icons/CloseCross";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { getSkeletonColors } from "../../../lib/helpers";
import { Shield } from "components/Esports";
import { connect } from 'react-redux';
import classNames from "classnames";
import _ from 'lodash';
import "./index.css";


class SerieFilter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            serieFilter: []
        };
    }

    handlerSerieFilterClick = async (id) => {
        const { onSerieFilter } = this.props;
        const { serieFilter } = this.state;
        const exist = serieFilter.some(el => el === id); 

        if(exist) {
            const index = serieFilter.indexOf(id);
            serieFilter.splice(index, 1);
        }
        else {
            serieFilter.push(id);
        }

        this.setState({ serieFilter });

        onSerieFilter(serieFilter);
    }

    handlerCleanSerieFilterClick = async () => {
        const { onCleanSerieFilter } = this.props;
        const { serieFilter } = this.state;

        serieFilter.splice(0, serieFilter.length);

        this.setState({ serieFilter });

        onCleanSerieFilter(serieFilter);
    }


    render() {
        const { serieFilter } = this.state;
        const { games, isLoading } = this.props;

        return (
            <div styleName="filter-tournaments">
                <div styleName="all" onClick={() => this.handlerCleanSerieFilterClick()}>
                        <Typography variant={'x-small-body'} color={'white'}>All Tournaments</Typography>
                        {
                        serieFilter.length 
                        ?
                            <span styleName="all-selected"><CloseIcon /></span>
                        :
                            null
                        }
                </div>
                <ul>
                    {isLoading ?
                        <SkeletonTheme color={ getSkeletonColors().color} highlightColor={ getSkeletonColors().highlightColor}>
                            <div style={{opacity : '0.5'}}> 
                                <li styleName="tournament">
                                    <Skeleton circle={true} height={30} width={30}/>
                                    <Skeleton height={20} width={180}/>
                                </li>
                                <li styleName="tournament">
                                    <Skeleton circle={true} height={30} width={30}/>
                                    <Skeleton height={20} width={80}/>
                                </li>
                                <li styleName="tournament">
                                    <Skeleton circle={true} height={30} width={30}/>
                                    <Skeleton height={20} width={100}/>
                                </li>
                                <li styleName="tournament">
                                    <Skeleton circle={true} height={30} width={30}/>
                                    <Skeleton height={20} width={120}/>
                                </li>
                            </div>
                        </SkeletonTheme>
                    :
                        games.slice(0, 5).map(game => {
                            if(!_.isEmpty(game.series)) {
                                const exist = serieFilter.some(el => el === game.series[0].id);
                                const styles = classNames("tournament", {
                                    tourSelected: exist
                                });
                                return (
                                    <li styleName={styles} onClick={() => this.handlerSerieFilterClick(game.series[0].id)} key={game.series[0].id}>
                                        <Shield image={game.image} size={"small"} />
                                        <div styleName="tournament-name">
                                            <Typography variant={'x-small-body'} color={'white'}>{`${game.series[0].league.name} - ${game.series[0].full_name}`}</Typography>
                                        </div>
                                    </li>
                                )
                            }
                        })
                    }
                </ul>
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

export default connect(mapStateToProps)(SerieFilter);