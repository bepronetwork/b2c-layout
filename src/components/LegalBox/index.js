import React, { Component } from "react";
import { connect } from "react-redux";

import "./index.css";

class LegalBox extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
        const cegKey = `ceg_${this.props.licenseID.replace(/-/g, "_")}`;

        if (
          this.props.licenseID &&
          Object.prototype.hasOwnProperty.call(window, cegKey)
        ) {
          window[cegKey].init();
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


function mapStateToProps(state){
    return {
        ln : state.language
    };
}

export default connect(mapStateToProps)(LegalBox);
