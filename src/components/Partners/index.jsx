import React, { Component } from 'react'
// import Carousel from './Carousel/Carousel';

import image_1 from '../../assets/partners/cruise.png';
import image_2 from '../../assets/partners/genting.png';
import image_3 from '../../assets/partners/sands.png';
import image_4 from '../../assets/partners/waterfront.png';


import "./index.css";


class Partners extends Component {
  render() {

    return (
      <div styleName='container'>
        <img styleName='partner-img' src={image_1}/>
        <img styleName='partner-img' src={image_2}/>
        <img styleName='partner-img' src={image_3}/>
        <img styleName='partner-img' src={image_4}/>
      </div>
    )
  }
}



export default Partners;
