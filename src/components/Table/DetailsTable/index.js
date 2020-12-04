import React, { Component } from "react";
import {Typography } from "components";
import "./index.css";

class DetailsTable extends Component {

    
    constructor(props){
        super(props);
        this.state = {
         };
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
    }
    
    render() {
        const { tableDetails } = this.props;
        const { fields, row, titles } = tableDetails;

        return (
            <div styleName='box'>
                {fields.map( (field, index) => {
                    const name = titles[index];
                    const value = field.image ? row[field.value].name : row[field.value];

                    return (
                        <div styleName="field">
                            <div styleName='label'>
                                <Typography variant={'small-body'} color={'casper'}>{name}</Typography>
                            </div>
                            <div styleName='value'>
                                <Typography variant={'small-body'} color={'white'}>{value}</Typography>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}



export default DetailsTable;