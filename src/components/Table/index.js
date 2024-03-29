import React, { Component } from "react";
import {Typography } from "components";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {CopyText} from "../../copy";
import UserContext from "containers/App/UserContext";
import classNames from "classnames";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { getSkeletonColors, loadFakeBets, getApp } from "../../lib/helpers";
import delay from 'delay';

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
        const currency = (currencies.find(currency => currency._id == currencyId));
        const appWallet = getApp().wallet.find(w => w.currency._id === currencyId);

        if(!currency) return null;

        return (
            <img src={appWallet.image != null ? appWallet.image : currency.image} width={16} height={16}/>
        )
    }

    renderGameColumn(row, background) {
        return (
            <div styleName="image">
                <div styleName="icon" style={{ background: background ? 'url('+background+') center center / cover no-repeat' : 'none'}}><img styleName='image-icon' src={row.image_url}/></div>
                <div styleName='image-name'><Typography variant='x-small-body' color={"grey"}> {row.name} </Typography></div>
            </div>
        );
    }

    render() {
        let { isLoadingRow, rows } = this.state; 
        let { titles, fields, isLoading, onTableDetails, tag, ln} = this.props;
        const copy = CopyText.tableIndex[ln];

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
                                    rows.map( (row) => 
                                    <tr styleName={rowStyles}>
                                        {fields.map( (field, index) => {
                                            const styles = classNames("td-row", {
                                                'td-row-img': field.image,
                                                'td-row-currency': field.currency,
                                                'td-row-state': field.isStatus
                                            });

                                            const statusStyles = classNames("status");
                                        
                                            if(field.dependentColor){
                                                return (
                                                    <td styleName={styles} data-label={titles[index]}>
                                                        {onTableDetails 
                                                        ?
                                                            <a href="#" onClick={onTableDetails.bind(this, {titles, fields, row, tag})}>
                                                                <Typography variant='x-small-body' color={ row[field.condition] ? 'green' : "grey"}> {row[field.value]} </Typography>
                                                                {this.getCurrencyImage(field.currency, row['currency'])}
                                                            </a>
                                                        :
                                                            <div>
                                                                <Typography variant='x-small-body' color={ row[field.condition] ? 'green' : "grey"}> {row[field.value]} </Typography>
                                                                {this.getCurrencyImage(field.currency, row['currency'])}
                                                            </div>
                                                        }
                                                    </td>     
                                                )
                                            }else if(field.image){
                                                const background = row[field.value].hasOwnProperty("background_url") ? row[field.value].background_url : null;
                                                return (
                                                    <td styleName={styles} data-label={titles[index]}>
                                                        {onTableDetails 
                                                        ?
                                                            <a href="#" onClick={onTableDetails.bind(this, {titles, fields, row, tag})}>
                                                                {this.renderGameColumn(row[field.value], background)}
                                                            </a>
                                                        :
                                                            this.renderGameColumn(row[field.value], background)
                                                        }
                                                    </td>
                                                )
                                            }else if(field.isLink === true){
                                                return (
                                                    <td styleName={styles} data-label={titles[index]}>
                                                        <a href={row[field.linkField]} target={'_blank'}>
                                                            <Typography variant={'x-small-body'} color='white'>
                                                                {row[field.value]}
                                                            </Typography>
                                                        </a>
                                                    </td>     
                                                )
                                            }else if(field.isStatus === true){
                                                return (
                                                    <td styleName={styles} data-label={titles[index]}>
                                                        <div styleName={statusStyles}>
                                                            {onTableDetails 
                                                            ?
                                                                <a href="#" onClick={onTableDetails.bind(this, {titles, fields, row, tag})}>
                                                                    <Typography variant='x-small-body' color={"fixedwhite"} weight={"bold"}> {row[field.value].text} </Typography>
                                                                </a>
                                                            :
                                                                <div>
                                                                    <Typography variant='x-small-body' color={"fixedwhite"} weight={"bold"}> {row[field.value].text} </Typography>
                                                                </div>
                                                            }
                                                        </div>
                                                    </td>  
                                                )
                                            }
                                            else{
                                                return (
                                                    // Normal
                                                    <td styleName={styles} data-label={titles[index]}>
                                                        {onTableDetails 
                                                        ?
                                                            <a href="#" onClick={onTableDetails.bind(this, {titles, fields, row, tag})}>
                                                                <Typography variant='x-small-body' color={"white"}> {row[field.value]} </Typography>
                                                                {this.getCurrencyImage(field.currency, row['currency'])}
                                                            </a>
                                                        :
                                                            <div>
                                                                <Typography variant='x-small-body' color={"white"}> {row[field.value]} </Typography>
                                                                {this.getCurrencyImage(field.currency, row['currency'])}
                                                            </div>
                                                        }
                                                    </td>
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
                                    <Typography variant='small-body' color={"grey"}>{copy.TITLE}</Typography>
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


function mapStateToProps(state){
    return {
        ln : state.language,
    };
}

export default connect(mapStateToProps)(TableDefault);