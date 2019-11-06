import React, { Component } from "react";
import { Button, SubtleButton, Typography, UserMenu, AnimationNumber, LanguagePicker } from "components";
import ImageGallery from 'react-image-gallery';
import { connect } from "react-redux";
import _ from 'lodash';
import "./index.css";
import { getAppCustomization } from "../../lib/helpers";

class CarousselContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            images : []
        }
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        const { banners } = getAppCustomization();
        const images = banners.ids.map( id => {
            return {
                srcSet: id,
                sizes : 200
            }
        })
        this.setState({images : images})
    }

    render() {
        const { images } = this.state;

        return (
            <ImageGallery 
                showNav={false} 
                showFullscreenButton={false} 
                showPlayButton={false}
                showThumbnails={false}
                showBullets={true} 
                showPlayButton={false} items={images} 
            />
        );
      }
    
}

function mapStateToProps(state){
    return {
        profile: state.profile,
    };
}

export default connect(mapStateToProps)(CarousselContainer);
