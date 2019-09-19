import React, { Component } from 'react'
// import Carousel from './Carousel/Carousel';

import image_1 from 'assets/media/chinese-media.png';
import image_2 from 'assets/media/yahoo.png';
import image_3 from 'assets/media/tech-crunch.png';
import image_4 from 'assets/media/cnbc.png';
import image_5 from 'assets/media/coinspectator.png';

import { Typography } from 'components';
import "./index.css";


class Media extends Component {

    render() {
        return (
            <div>
                <Typography variant='body' color='white'> 
                    Media Coverage 
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



export default Media;
