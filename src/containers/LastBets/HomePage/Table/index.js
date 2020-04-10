import React, { Component } from "react";
import {Typography } from "components";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";
import classNames from "classnames";
import faker from 'faker';

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
        const { view } = this.props;

        if(rows.length && view == "all_bets") {
            setTimeout(() => {
                var row = rows[Math.floor(Math.random() * rows.length)];

                const newRow = {
                    betAmount: row.betAmount,
                    game : row.game,
                    id: row.id,
                    isWon: row.isWon,
                    payout: row.payout,
                    timestamp: "a few seconds ago",
                    username: faker.internet.userName(),
                    winAmount: row.winAmount
                }
        
                rows.unshift(newRow);
                rows.pop();
        
                this.setState({ rows, isLoadingRow : true });

            }, 3000);
        }
    }
    
    render() {
        let { isLoadingRow, rows } = this.state; 
        let { titles, fields } = this.props;

        const rowStyles = classNames("tr-row", {
            addRow: isLoadingRow
        });

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
                    {rows.map( (row, index) => 
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
                        </tr>
                        )}
                </tbody>
            </table>
        );
    }
}



export default TableDefault;