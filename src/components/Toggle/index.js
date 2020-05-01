import React from "react";
import { Typography } from "components";
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import classNames from "classnames";
import './index.css';

class Toggle extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            checked : false
        }
    }

    onClick = () => {

    }

    render(){
        const { checked, id, disabled, onChange } = this.props;
        const styles = classNames("toggle", {
            off: !checked
          });

        return (
            <div styleName={styles}>
                <div styleName="toggle-text">
                    <Typography variant={'small-body'} color={'white'} weight={'semi-bold'}>{checked === true ? 'ON' : 'OFF'}</Typography>
                </div>
                <BootstrapSwitchButton 
                    checked={checked} 
                    id={id}  
                    onChange={onChange ? onChange : null} 
                    onstyle="dark" 
                    offstyle="secondary" 
                    size="xs" 
                    width={10} 
                    onlabel=" " 
                    offlabel=" "
                    disabled={disabled === true ? true : false}/>
            </div>
        )
    }
}

export default Toggle;