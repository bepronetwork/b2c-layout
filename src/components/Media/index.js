import React, { Component } from 'react'
// import Carousel from './Carousel/Carousel';

import image_1 from 'assets/media/chinese-media.png';
import image_2 from 'assets/media/yahoo.png';
import image_3 from 'assets/media/tech-crunch.png';
import image_4 from 'assets/media/cnbc.png';
import image_5 from 'assets/media/coinspectator.png';

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
                    <img styleName='partner-img' src={image_5}/>
                    <img styleName='partner-img' src={image_2}/>
                    <img styleName='partner-img' src={image_3}/>
                    <img styleName='partner-img' src={image_4}/>
                </div>
                <img styleName='img-partner-full' src={image_1}/>
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