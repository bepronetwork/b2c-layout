import React, { Component } from "react";
import {Typography } from "components";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";
import faker from 'faker';
import classNames from "classnames";
import { formatCurrency } from "../../utils/numberFormatation";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { getSkeletonColors, getApp } from "../../lib/helpers";

import "./index.css";

const delay = ms => new Promise(res => setTimeout(res, ms));

class TableDefault extends Component {
    intervalID = 0;
    static contextType = UserContext;

    static propTypes = {
        onHandleLoginOrRegister: PropTypes.func.isRequired
    };
    
    constructor(props){
        super(props);
        this.state = { 
            rows : [],
            isLoadingRow : false
         };
    }

    componentDidMount(){
        this.projectData(this.props);

        this.intervalID = setInterval( async () => {
            this.setState({ isLoadingRow : false });
            this.addRow();
        }, 6000);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    projectData = async (props) => {
        this.setState({ rows : props.rows});
    }

    addRow = async () =>  {
        let { rows } = this.state; 
        const { showRealTimeLoading, size, games } = this.props;

        if(showRealTimeLoading) {
            await delay(1000);
            /* fake random value */
            let ticker = row ? row.ticker : 'ETH';
            const virtual = getApp().virtual;
            if (virtual === true) {
                let currencies = getApp().currencies;
                ticker = currencies.find(c => c.virtual === true).ticker;
            }
            var game = games[Math.floor(Math.random() * games.length)];
            var row = rows[Math.floor(Math.random() * rows.length)];
            let fakeUserName = faker.internet.userName();
            let randomArray = [];
            let lostValue = {isWon : false, payout : '0.000000', winAmount : '0.000000'};
            var i = 0; do { i++; randomArray.push(lostValue) } while (i < 4);
            var i = 0; do { 
                i++; 
                let payout = Math.random() * (2.000000 - 0.050000) + 0.050000;
                let winAmount = Math.random() * (2.000000 - 0.050000) + 0.050000;
                payout = virtual === true ? payout * 10 : payout;
                winAmount = virtual === true ? winAmount * 10 : winAmount;
                const winValue =  { isWon : true, payout : formatCurrency(payout), winAmount : formatCurrency(winAmount)};
                randomArray.push(winValue) 
            } while (i < 6);
            var randomValue = randomArray[Math.floor(Math.random() * randomArray.length)];

            if(game) {
                const newRow = {
                    game : game,
                    isWon: randomValue.isWon,
                    payout: randomValue.payout + 'x',
                    timestamp: "a few seconds ago",
                    username: fakeUserName.length > 10 ? fakeUserName.substring(0, 4)+'...'+fakeUserName.substring(fakeUserName.length-3, fakeUserName.length) : fakeUserName,
                    winAmount: randomValue.winAmount + ' ' + ticker,
                    ticker
                }
        
                rows.unshift(newRow);

                if(rows.length >= size) {
                    rows.pop();
                }
            }
    
            this.setState({ rows, isLoadingRow : true });

        }
    }

    createSkeletonRows = () => {
        let tabs = []

        for (let i = 0; i < 5; i++) {
          tabs.push(<div styleName="skeleton-row"><Skeleton height={30} /></div>);
        }

        return tabs
    }
    
    render() {
        let { isLoadingRow, rows } = this.state; 
        let { titles, fields, isLoading } = this.props;

        const rowStyles = classNames("tr-row", {
            addRow: isLoadingRow
        });

        return (
            <div>
                {isLoading ?
                    <SkeletonTheme color={ getSkeletonColors().color} highlightColor={ getSkeletonColors().highlightColor}>
                        <div style={{opacity : '0.3'}}> 
                            {this.createSkeletonRows()}
                        </div>
                    </SkeletonTheme>
                :
                    <div>
                        <table styleName='table-row'>
                            <thead styleName='table-head'>
                                <tr styleName='tr-row'>
                                    {titles.map( text => 
                                        <th styleName='th-row'>
                                            <Typography variant='small-body' color="casper" weight="bold"> {text} </Typography>
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    rows.map( (row, index) => 
                                    <tr styleName={rowStyles}>
                                        {fields.map( (field) => {
                                            if(field.dependentColor){
                                                return (
                                                    <th styleName='th-row'>
                                                        <Typography variant='small-body' color={ row[field.condition] ? 'green' : "grey"}> {row[field.value]} </Typography>
                                                    </th>
                                                    
                                                )
                                            }else if(field.image){
                                                const imageStyles = classNames("th-row", "th-row-img");
                                                const background = row[field.value].hasOwnProperty("background_url") ? row[field.value].background_url : null;
                                                return (
                                                    <th styleName={imageStyles}>
                                                        <div styleName="image">
                                                            <div styleName="icon" style={{ background: background ? 'url('+background+') center center / cover no-repeat' : 'none'}}><img styleName='image-icon' src={row[field.value].image_url}/></div>
                                                            <div styleName='image-name'><Typography variant='x-small-body' color={"grey"}> {row[field.value].name} </Typography></div>
                                                        </div>
                                                    </th>
                                                )
                                            }else{
                                                return (
                                                    // Normal
                                                    <th styleName='th-row'>
                                                        <Typography variant='small-body' color={"white"}> {row[field.value]} </Typography>
                                                    </th>
                                                )
                                            
                                            }
                                            
                                        })}
                                    </tr>)
                                }
                            </tbody>
                        </table>
                        {
                            !rows.length ?
                                <div styleName="no-info">
                                    <Typography variant='small-body' color={"grey"}> No Information </Typography>
                                </div>
                            :
                                null
                        }

                    </div>
                }
            </div>
        );
    }
}



export default TableDefault;