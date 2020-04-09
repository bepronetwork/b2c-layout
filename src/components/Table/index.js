import React, { Component } from "react";
import {Typography } from "components";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";
import faker from 'faker';
import classNames from "classnames";
import { formatCurrency } from "../../utils/numberFormatation";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import "./index.css";

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
        }, 5000);
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

    addRow() {
        let { rows } = this.state; 
        const { showRealTimeLoading, size, games } = this.props;

        if(showRealTimeLoading) {
            setTimeout(() => {

                /* fake random value */
                var game = games[Math.floor(Math.random() * games.length)];
                var row = rows[Math.floor(Math.random() * rows.length)];
                let ticker = row ? row.ticker : 'ETH';
                let fakeUserName = faker.internet.userName();
                let randomArray = [];
                let lostValue = {isWon : false, payout : '0.000000', winAmount : '0.000000'};
                var i = 0; do { i++; randomArray.push(lostValue) } while (i < 4);
                var i = 0; do { 
                    i++; 
                    const winValue =  {isWon : true, payout : formatCurrency(Math.random() * (2.000000 - 0.050000) + 0.050000), winAmount : formatCurrency(Math.random() * (2.000000 - 0.050000) + 0.050000)};
                    randomArray.push(winValue) 
                } while (i < 6);
                var randomValue = randomArray[Math.floor(Math.random() * randomArray.length)];

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
        
                this.setState({ rows, isLoadingRow : true });

            }, 500);
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
                    <SkeletonTheme color="#0f0e1d" highlightColor="#17162d">
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
                                        <Typography variant='small-body' color="casper" weight="bold"> {text || <Skeleton />} </Typography>
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
                                                    <Typography variant='small-body' color={ row[field.condition] ? 'green' : "grey"}> {row[field.value] || <Skeleton />} </Typography>
                                                </th>
                                                
                                            )
                                        }else if(field.image){
                                            const imageStyles = classNames("th-row", "th-row-img");
                                            const background = row[field.value].background_url;
                                            return (
                                                <th styleName={imageStyles}>
                                                    <div styleName="image">
                                                        <div styleName="icon" style={{ background: background ? 'url('+background+') center center / cover no-repeat' : 'none'}}><img styleName='image-icon' src={row[field.value].image_url}/></div>
                                                        <div styleName='image-name'><Typography variant='x-small-body' color={"grey"}> {row[field.value].name || <Skeleton circle={true} /> } </Typography></div>
                                                    </div>
                                                </th>
                                            )
                                        }else{
                                            return (
                                                // Normal
                                                <th styleName='th-row'>
                                                    <Typography variant='small-body' color={"white"}> {row[field.value] || <Skeleton />} </Typography>
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