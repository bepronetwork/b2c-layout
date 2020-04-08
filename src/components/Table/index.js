import React, { Component } from "react";
import {Typography } from "components";
import PropTypes from "prop-types";
import UserContext from "containers/App/UserContext";
import faker from 'faker';
import classNames from "classnames";

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
        const { showRealTimeLoading, size } = this.props;

        if(rows.length && showRealTimeLoading) {
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

                if(rows.length >= size) {
                    rows.pop();
                }
        
                this.setState({ rows, isLoadingRow : true });

            }, 500);
        }
    }
    
    render() {
        let { isLoadingRow, rows } = this.state; 
        let { titles, fields } = this.props;

        const rowStyles = classNames("tr-row", {
            addRow: isLoadingRow
        });

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
                                            <div styleName="image">
                                                <div styleName="icon"><img styleName='image-icon' src={row[field.value].image_url}/></div>
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