import React, { Component } from "react";
import {Typography } from "components";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";
import classNames from "classnames";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { getSkeletonColors, loadFakeBets, getApp } from "../../lib/helpers";

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
        const { showRealTimeLoading } = this.props;

        if(showRealTimeLoading) {
            this.intervalID = setInterval( async () => {
                this.setState({ isLoadingRow : false });
                this.addRow();
            }, 6000);
        }
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
            rows = loadFakeBets(rows, games, size);
            this.setState({ rows, isLoadingRow : true });
        }
    }

    createSkeletonRows = () => {
        let tabs = []

        for (let i = 0; i < 10; i++) {
          tabs.push(<div styleName="skeleton-row"><Skeleton height={30} /></div>);
        }

        return tabs
    }

    getCurrencyImage(isCurrency, currencyId) {
        if(!isCurrency) return null;

        const currencies = getApp().currencies;
        const currenncy = (currencies.find(currency => currency._id == currencyId));

        if(!currenncy) return null;

        return (
            <img src={currenncy.image} width={16} />
        )
    }

    render() {
        let { isLoadingRow, rows } = this.state; 
        let { titles, fields, isLoading, onTableDetails } = this.props;

        const rowStyles = classNames("tr-row", {
            addRow: isLoadingRow
        });

        return (
            <div>
                {isLoading ?
                    <SkeletonTheme color={ getSkeletonColors().color} highlightColor={ getSkeletonColors().highlightColor}>
                        <div style={{opacity : '0.5'}}> 
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
                                            <Typography variant='x-small-body' color="grey" weight="bold"> {text} </Typography>
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    rows.map( (row, index) => 
                                    <tr styleName={rowStyles}>
                                        {fields.map( (field) => {
                                            const styles = classNames("th-row", {
                                                'th-row-img': field.image,
                                                'th-row-currency': field.currency
                                            });
                                            if(field.dependentColor){
                                                return (
                                                    <th styleName={styles}>
                                                        {onTableDetails 
                                                        ?
                                                            <a href="#" onClick={onTableDetails.bind(this, {titles, fields, row})}>
                                                                <Typography variant='x-small-body' color={ row[field.condition] ? 'green' : "grey"}> {row[field.value]} </Typography>
                                                                {this.getCurrencyImage(field.currency, row['currency'])}
                                                            </a>
                                                        :
                                                            <div>
                                                                <Typography variant='x-small-body' color={ row[field.condition] ? 'green' : "grey"}> {row[field.value]} </Typography>
                                                                {this.getCurrencyImage(field.currency, row['currency'])}
                                                            </div>
                                                        }
                                                    </th>     
                                                )
                                            }else if(field.image){
                                                const background = row[field.value].hasOwnProperty("background_url") ? row[field.value].background_url : null;
                                                return (
                                                    <th styleName={styles}>
                                                        {onTableDetails 
                                                        ?
                                                            <a href="#" onClick={onTableDetails.bind(this, {titles, fields, row})}>
                                                                <div styleName="image">
                                                                    <div styleName="icon" style={{ background: background ? 'url('+background+') center center / cover no-repeat' : 'none'}}><img styleName='image-icon' src={row[field.value].image_url}/></div>
                                                                    <div styleName='image-name'><Typography variant='x-small-body' color={"grey"}> {row[field.value].name} </Typography></div>
                                                                </div>
                                                            </a>
                                                        :
                                                            <div styleName="image">
                                                                <div styleName="icon" style={{ background: background ? 'url('+background+') center center / cover no-repeat' : 'none'}}><img styleName='image-icon' src={row[field.value].image_url}/></div>
                                                                <div styleName='image-name'><Typography variant='x-small-body' color={"grey"}> {row[field.value].name} </Typography></div>
                                                            </div>
                                                        }
                                                    </th>
                                                )
                                            }else if(field.isLink === true){
                                                return (
                                                    <th styleName={styles}>
                                                        <a href={row[field.linkField]} target={'_blank'}>
                                                            <Typography variant={'x-small-body'} color='white'>
                                                                {row[field.value]}
                                                            </Typography>
                                                        </a>
                                                    </th>     
                                                )
                                            }
                                            else{
                                                return (
                                                    // Normal
                                                    <th styleName={styles}>
                                                        {onTableDetails 
                                                        ?
                                                            <a href="#" onClick={onTableDetails.bind(this, {titles, fields, row})}>
                                                                <Typography variant='x-small-body' color={"white"}> {row[field.value]} </Typography>
                                                                {this.getCurrencyImage(field.currency, row['currency'])}
                                                            </a>
                                                        :
                                                            <div>
                                                                <Typography variant='x-small-body' color={"white"}> {row[field.value]} </Typography>
                                                                {this.getCurrencyImage(field.currency, row['currency'])}
                                                            </div>
                                                        }
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