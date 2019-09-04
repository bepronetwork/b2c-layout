import React, { Component } from "react";
import ImageGallery from 'react-image-gallery';

// import "./index.css";

import image_1 from 'assets/home-page/carousel-1.jpg';
import image_2 from 'assets/home-page/carousel-2.jpg';


const images = [
    {
        srcSet: image_1,
        sizes : 50
    },
    {
        srcSet: image_2,       
        sizes : 50
    }
]

class Caroussel extends Component {

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

export default Caroussel;
