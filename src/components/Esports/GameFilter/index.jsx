import React, { Component } from "react";
import { Typography } from 'components';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import CloseIcon from "components/Icons/CloseCross";
import { Shield } from "components/Esports";
import { connect } from 'react-redux';
import classNames from "classnames";
import { getSkeletonColors } from "../../../lib/helpers";
import _ from 'lodash';
import "./index.css";


class GameFilter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gameFilter: []
        };
    }

    handlerGameFilterClick = async (id) => {
        const { onGameFilter } = this.props;
        let { gameFilter } = this.state;
        const exist = gameFilter.some(el => el === id); 

        if(exist) {
            const index = gameFilter.indexOf(id);
            gameFilter.splice(index, 1);
        }
        else {
            gameFilter.push(id);
        }

        this.setState({ gameFilter });

        onGameFilter(gameFilter);
    }

    handlerCleanGameFilterClick = async () => {
        const { onCleanGameFilter } = this.props;
        const { gameFilter } = this.state;

        gameFilter.splice(0, gameFilter.length);

        this.setState({ gameFilter });

        onCleanGameFilter(gameFilter);
    }

    createSkeletonRows = () => {
        let rows = []

        for (let i = 0; i < 6; i++) {
            rows.push(
                <li styleName="skeleton-filter-match">
                    <Skeleton height={40} width={100}/>
                </li>
            );
        }

        return rows
    }


    render() {
        const { gameFilter } = this.state;
        const { games, isLoading } = this.props;

        return (
            <div styleName="filter-matches">
                <div styleName="all" onClick={() => this.handlerCleanGameFilterClick()}>
                    <Typography variant={'x-small-body'} color={'white'}>All Games</Typography>
                    {
                        gameFilter.length 
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
                                {this.createSkeletonRows()}
                            </div>
                        </SkeletonTheme>
                    :
                        games.map(game => {
                            const exist = gameFilter.some(el => el === game.external_id);
                            const styles = classNames("filter-match", {
                                selected: exist,
                                "not-selected": gameFilter.length && !exist
                            });
                            return (
                                
                                <li styleName={styles} onClick={() => this.handlerGameFilterClick(game.external_id)} key={game.external_id}>
                                    <Shield image={game.image} size={"small"} tooltip={game.name} isFull={true} />
                                    <div styleName="match-name">
                                        <Typography variant={'x-small-body'} color={'white'}>{game.name}</Typography>
                                    </div>
                                </li>
                            )
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

export default connect(mapStateToProps)(GameFilter);