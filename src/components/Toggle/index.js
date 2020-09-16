import React from "react";
import { Typography } from "components";
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import classNames from "classnames";
import { getAppCustomization } from "../../lib/helpers";
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
        const skin = getAppCustomization().skin.skin_type;
        
        const stylesOn = classNames("toggle", {
            toggleOn: checked && skin == "digital"
        });
        const stylesTextOff = classNames("toggle-text", {
            tOff: !checked
        });
        const stylesTextOn = classNames("toggle-text", {
            tOn: checked
        });

        return (
            <div styleName={stylesOn}>
                <div styleName={stylesTextOff}>
                    <Typography variant={'x-small-body'} color={'fixedwhite'} weight={'semi-bold'}>{skin == "digital" ? 'OFF' : checked === true ? 'ON' : 'OFF'}</Typography>
                </div>
                <BootstrapSwitchButton
                    checked={checked} 
                    id={id}  
                    onChange={onChange ? onChange : null} 
                    onstyle="dark" 
                    offstyle="secondary" 
                    size="xs" 
                    width={6} 
                    onlabel=" " 
                    offlabel=" "
                    disabled={disabled === true ? true : false}/>
                {
                    skin == "digital"
                    ?
                        <div styleName={stylesTextOn}>
                            <Typography variant={'x-small-body'} color={'fixedwhite'} weight={'semi-bold'}>{'ON'}</Typography>
                        </div>
                    :
                        null
                }
            </div>
        )
    }
}

export default Toggle;