import React, { Component } from "react";
import { Button, SubtleButton, Typography, UserMenu, AnimationNumber, LanguagePicker } from "components";
import ImageGallery from 'react-image-gallery';
import { connect } from "react-redux";
import _ from 'lodash';
import "./index.css";
import image_1 from 'assets/home-page/carousel-1.jpg';
import image_2 from 'assets/home-page/carousel-2.jpg';


const images = [
    {
        srcSet: image_1,
        sizes : 200
    },
    {
        srcSet: image_2,       
        sizes : 200
    }
]

class CarousselContainer extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ImageGallery 
            showNav={false} 
            showFullscreenButton={false} 
            showPlayButton={false}
            showThumbnails={false}
            showBullets={true} 
            showPlayButton={false} items={images} />
        );
      }
    
}

function mapStateToProps(state){
    return {
        profile: state.profile,
    };
}

export default connect(mapStateToProps)(CarousselContainer);
