import React, { Component } from "react";
import { Typography, Button } from "components";
import { connect } from "react-redux";
import {CopyText} from "../../copy";
import UserContext from "containers/App/UserContext";
import classNames from "classnames";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { getSkeletonColors, loadFakeBets, getApp } from "../../lib/helpers";
import delay from 'delay';
import "./index.css";
import { uniqueId } from "lodash";

class TableDefault extends Component {
    intervalID = 0;
    static contextType = UserContext;

    constructor(props){
        super(props);
        this.state = { 
            rows : [],
            isLoadingRow : false
         };
        this._isMounted = false;
    }

    componentDidMount(){
        this.projectData(this.props);
        const { showRealTimeLoading } = this.props;

        this._isMounted = true;

        if (this._isMounted && showRealTimeLoading) {
            this.intervalID = setInterval(async () => {
                this.setState({ isLoadingRow: false });
                this.addRow();
            }, 6000);
        }
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
        this._isMounted = false;
    }

    UNSAFE_componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        this.setState({ rows : props.rows});
    }

    addRow = async () =>  {
        let { rows } = this.state; 
        const { showRealTimeLoading, size, games } = this.props;

        if(this._isMounted && showRealTimeLoading) {
            await delay(1000);
            rows = loadFakeBets(rows, games, size);
            this.setState({ rows, isLoadingRow : true });
        }
    }

    createSkeletonRows = () => {
        let tabs = []

        for (let i = 0; i < 10; i++) {
          tabs.push(<div styleName="skeleton-row" key={uniqueId("skeleton-row-")}><Skeleton height={30} /></div>);
        }

        return tabs
    }

    getCurrencyImage(isCurrency, currencyId) {
        if(!isCurrency) return null;

        const currencies = getApp().currencies;
        const currency = (currencies.find(currency => currency._id === currencyId));
        const appWallet = getApp().wallet.find(w => w.currency._id === currencyId);

        if(!currency) return null;

        return (
            <img src={appWallet.image !== null ? appWallet.image : currency.image} width={16} height={16} alt="App Wallet" />
        )
    }

    renderGameColumn(row, background) {
        return (
            <div styleName="image">
                <div styleName="icon" style={{ background: background ? 'url('+background+') center center / cover no-repeat' : 'none'}}><img styleName='image-icon' src={row.image_url} alt={row.name} /></div>
                <div styleName='image-name'><Typography variant='x-small-body' color={"grey"}> {row.name} </Typography></div>
            </div>
        );
    }

    render() {
        let { isLoadingRow, rows } = this.state; 
        let { titles, fields, isLoading, onTableDetails, tag, ln} = this.props;
        const copy = CopyText.tableIndex[ln];

        if (isLoading) {
            return (
                <SkeletonTheme color={ getSkeletonColors().color} highlightColor={ getSkeletonColors().highlightColor}>
                    <div style={{opacity : '0.5'}}> 
                        {this.createSkeletonRows()}
                    </div>
                </SkeletonTheme>
            )
        }

        return (
            <>
                <table styleName='table-row'>
                    <thead styleName='table-head'>
                        <tr styleName='tr-row'>
                            {titles.map( text => 
                                <th styleName='th-row' key={text}>
                                    <Typography variant='x-small-body' color="grey" weight="bold"> {text} </Typography>
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            rows.map( (row) => 
                            <tr 
                                styleName={classNames("tr-row", {
                                    addRow: isLoadingRow
                                })} 
                                key={row.id}
                            >
                                {fields.map( (field, index) => {
                                    const styles = classNames("td-row", {
                                        'td-row-img': field.image,
                                        'td-row-currency': field.currency,
                                        'td-row-state': field.isStatus
                                    });
                                    const statusStyles = classNames("status", {
                                        [row[field.value].color]: field.isStatus === true
                                    });


                                    if(field.dependentColor){
                                        return (
                                            <td styleName={styles} data-label={titles[index]} key={uniqueId("table-default-column-")}>
                                                {onTableDetails 
                                                ?
                                                    <Button theme="link" onClick={onTableDetails.bind(this, {titles, fields, row, tag})}>
                                                        <Typography variant='x-small-body' color={ row[field.condition] ? 'green' : "grey"}> {row[field.value]} </Typography>
                                                        {this.getCurrencyImage(field.currency, row['currency'])}
                                                    </Button>
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
                                            <td styleName={styles} data-label={titles[index]} key={uniqueId("table-default-column-")}>
                                                {onTableDetails 
                                                ?
                                                    <Button theme="link" onClick={onTableDetails.bind(this, {titles, fields, row, tag})}>
                                                        {this.renderGameColumn(row[field.value], background)}
                                                    </Button>
                                                :
                                                    this.renderGameColumn(row[field.value], background)
                                                }
                                            </td>
                                        )
                                    }else if(field.isLink === true){
                                        return (
                                            <td styleName={styles} data-label={titles[index]} key={uniqueId("table-default-column-")}>
                                                <a href={row[field.linkField]} target={'_blank'}>
                                                    <Typography variant={'x-small-body'} color='white'>
                                                        {row[field.value]}
                                                    </Typography>
                                                </a>
                                            </td>     
                                        )
                                    }else if(field.isStatus === true){
                                        return (
                                            <td styleName={styles} data-label={titles[index]} key={uniqueId("table-default-column-")}>
                                                <div styleName={statusStyles}>
                                                    {onTableDetails 
                                                    ?
                                                        <Button theme="link" onClick={onTableDetails.bind(this, {titles, fields, row, tag})}>
                                                            <Typography variant='x-small-body' color={"fixedwhite"} weight={"bold"}> {row[field.value].text} </Typography>
                                                        </Button>
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
                                            <td styleName={styles} data-label={titles[index]} key={uniqueId("table-default-column-")}>
                                                {onTableDetails 
                                                ?
                                                    <Button theme="link" onClick={onTableDetails.bind(this, {titles, fields, row, tag})}>
                                                        <Typography variant='x-small-body' color={"white"}> {row[field.value]} </Typography>
                                                        {this.getCurrencyImage(field.currency, row['currency'])}
                                                    </Button>
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
            </>
        );
    }
}


function mapStateToProps(state){
    return {
        ln : state.language,
    };
}

export default connect(mapStateToProps)(TableDefault);