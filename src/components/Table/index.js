import React, { Component } from "react";
import {Typography } from "components";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";
import classNames from "classnames";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { getSkeletonColors, loadFakeBets } from "../../lib/helpers";

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
            
            rows = loadFakeBets(rows, games, size);
    
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