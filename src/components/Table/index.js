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
                                            <div styleName="image">
                                                <div><img styleName='image-icon' src={row[field.value].image_url}/></div>
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
        );
    }
}



export default TableDefault;