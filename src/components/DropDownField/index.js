


import React from 'react';
import { TextField } from '@material-ui/core';
import _ from 'lodash';

class DropDownField extends React.Component{

    constructor(props){
        super(props);
        this.state = {}
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props)
    }

    projectData = (props) => {
        if(props.value){
            this.setState({...this.state, value : props.value})
        }
    }
 
    onChange = e => {
        this.setState({...this.state, value : e.target.value})
        this.props.onChange({
            type : this.props.type,
            value : e.target.value
        })
    }

    render = () => {
        return ( 
            <TextField
                disabled={this.props.disabled}
                id={this.props.id} 
                style={{width : '80%', height : 60, marginTop : 20}} 
                className={this.props.className} 
                select
                margin="normal"
                value={this.state.value}
                onChange={this.onChange}           
                helperText={this.props.helperText}
                >
                    {this.props.children}
             </TextField>
        )
    }

}


export default DropDownField;