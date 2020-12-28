import React from "react";
import './index.css';

class Checkbox extends React.Component{
    render(){
        const { id, isSet, onClick } = this.props;

        return (
            <li styleName="tg-list-item">
                <input onClick={onClick} checked={isSet} styleName="tgl tgl-flat" id={id} type="checkbox"/>
                <label styleName="tgl-btn" htmlFor={id}></label>
            </li>
        )
    }
}

export default Checkbox;