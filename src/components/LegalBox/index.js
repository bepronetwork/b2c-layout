import React, { Component } from "react";
import "./index.css";

class LegalBox extends Component {
    componentDidMount(){
        if(this.props.licenseID){
            window['ceg_'+this.props.licenseID.replace(/-/g, '_')].init();
        }
    }

    render() {
        const { licenseID } = this.props;
        return (
            <div styleName="root">
                <div id={`ceg-` + licenseID} data-ceg-seal-id={licenseID} data-ceg-image-size="72" data-ceg-image-type="basic-small"></div>
            </div>
        );
    }
}

export default LegalBox;
