import React, { Component } from "react";
import {Typography } from "components";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";

import "./index.css";

function isOdd(num) { return num % 2;}

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
                                <Typography variant='small-body' color="white"> {text} </Typography>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {rows.map( (row, index) => 
                        <tr styleName={isOdd(index) ? 'tr-row' : 'tr-row-odd'}>
                            {fields.map( (field) => {
                                if(field.dependentColor){
                                    return (
                                        <th styleName='th-row'>
                                            <Typography variant='small-body' color={ row[field.condition] ? 'green' : "grey"}> {row[field.value]} </Typography>
                                        </th>
                                        
                                    )
                                }else if(field.image){
                                    return (
                                        <th styleName='th-row'>
                                            <img styleName='image-icon' src={row[field.value].image_url}/>
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
                        </tr>
                        )}
                </tbody>
            </table>
        );
    }
}



export default TableDefault;