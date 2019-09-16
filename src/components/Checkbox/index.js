import React from "react";
import './index.css';

class Checkbox extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            checked : false
        }
    }

    onClick = () => {

    }

    render(){
        const { id, isSet } = this.props;

        return (
            <li styleName="tg-list-item">
                <input checked={isSet} styleName="tgl tgl-flat" id={id} type="checkbox"/>
                <label styleName="tgl-btn" for={id}></label>
            </li>
        )
    }
}

export default Checkbox;