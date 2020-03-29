import React, { Component } from "react";
import {Typography } from "components";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";
import classNames from "classnames";

import "./index.css";

class TableDefault extends Component {
    static contextType = UserContext;

    static propTypes = {
        onHandleLoginOrRegister: PropTypes.func.isRequired
    };
    
    constructor(props){
        super(props);
    }
    
    render() {
        let { titles, rows, fields } = this.props;
        return (
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
                        rows.length ?
                            rows.map( (row, index) => 
                            <tr styleName='tr-row'>
                                {fields.map( (field) => {
                                    if(field.dependentColor){
                                        return (
                                            <th styleName='th-row'>
                                                <Typography variant='small-body' color={ row[field.condition] ? 'green' : "grey"}> {row[field.value]} </Typography>
                                            </th>
                                            
                                        )
                                    }else if(field.image){
                                        const imageStyles = classNames("th-row", "th-row-img");
                                        return (
                                            <th styleName={imageStyles}>
                                                <img styleName='image-icon' src={row[field.value].image_url}/>
                                                <Typography variant='x-small-body' color={"grey"}> {row[field.value].name} </Typography>
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
                        :
                            <tr styleName='tr-row'>
                                <th styleName='th-row'>
                                    <Typography variant='small-body' color={"casper"}> No Information </Typography>
                                </th>
                            </tr>
                    }
                </tbody>
            </table>
        );
    }
}



export default TableDefault;