import React, { Component } from 'react'
import { Typography } from 'components';
import "./index.css";
import {CopyText} from "../../copy";
import { connect } from "react-redux";

class Media extends Component {

    render() {

        const {ln} = this.props;
        const copy = CopyText.mediaIndex[ln];


        return (
            <div styleName='media-section'>
                <Typography variant='h3' color='white' weight='bold'> 
                    {copy.INDEX.TYPOGRAPHY.TEXT[0]}
                </Typography>
                <div styleName='container'>
                   {/* Media */}
                </div>
            </div>
        )
    } 
}
function mapStateToProps(state){
    return {
        profile : state.profile,
        ln: state.language
    };
}

export default connect(mapStateToProps)(Media);