import React from 'react';
import { TextField } from '@material-ui/core';

class DropDownField extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            value : props.value 
        };
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props)
    }

    projectData = (props) => {
        if(props.value){
            this.setState({ value : props.value})
        }
    }
 
    onChange = e => {
        this.setState({ value : e.target.value})
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
                style={{width : this.props.width ? this.props.width : '80%', height : this.props.height ? this.props.height : 60, marginTop : 20}} 
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