import React, { Component } from "react";
import ImageGallery from 'react-image-gallery';
import { connect } from "react-redux";
import _ from 'lodash';
import "./index.css";
import { getAppCustomization } from "../../lib/helpers";

var gallery = null;

class CarousselContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            images : [],
            links : []
        }
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async () => {
        const { banners } = getAppCustomization();
        const images = banners.ids.map( id => {
            return {
                srcSet: id.image_url
            }
        });
        const links = banners.ids.map( id => {
            return {
                url: id.link_url
            }
        });
        this.setState({images, links})
    }

    _onImageClick() {
        const { links } = this.state;
        var link = links[gallery.getCurrentIndex()];

        if(link.url) {
            window.open(link.url, "_blank");
        }
    }

    _onMouseOver() {
        gallery.pause();
    }

    _onMouseLeave() {
        gallery.play();
    }

    galleryRef = element => {
        gallery = element;
    };

    render() {
        const { images } = this.state;

        if(_.isEmpty(images)) { return null; }

        return (
            <div styleName='banners'>
                <ImageGallery 
                    ref={this.galleryRef}
                    showNav={false} 
                    showFullscreenButton={false} 
                    showThumbnails={false}
                    showBullets={true} 
                    autoPlay={true}
                    showPlayButton={false} 
                    items={images} 
                    onMouseOver={this._onMouseOver}
                    onMouseLeave={this._onMouseLeave}
                    onClick={this._onImageClick.bind(this)}
                />
            </div>
        );
      }
    
}

function mapStateToProps(state){
    return {
        profile: state.profile,
    };
}

export default connect(mapStateToProps)(CarousselContainer);
