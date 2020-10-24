import React, { Component } from "react";
import Carousel from 'react-bootstrap/Carousel'
import { Typography, Button } from "components";
import { connect } from "react-redux";
import { getAppCustomization } from "../../lib/helpers";
import classNames from 'classnames';
import _ from 'lodash';
import "./index.css";

class Banners extends Component {

    constructor(props) {
        super(props);
        this.state = {
            banners : [],
            index : 0,
            isFullWidth : false
        }
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        const { ln } = props;
        let { banners } = getAppCustomization();

        banners = banners.languages.find(b => b.language.isActivated === true && b.language.prefix === ln.toUpperCase());

        this.setState({ 
            banners : !_.isEmpty(banners) ? banners.ids : null,
            isFullWidth : !_.isEmpty(banners) ? banners.fullWidth : false
        })
    }

    handleSelect(selectedIndex, e) {
        this.setState({index : selectedIndex});
    }
    
    handleClick(url) {
        window.location.assign(url);
    }

    render() {
        const { banners, index, isFullWidth } = this.state;
        
        if(_.isEmpty(banners)) { return null; }

        const skin = getAppCustomization().skin.skin_type;
        const bannersStyles = classNames("banners", {
            "banners-full-width": isFullWidth
        });

        return (
            <div styleName={bannersStyles}>
              <Carousel activeIndex={index} onSelect={this.handleSelect.bind(this)} pause="hover">
                    {banners.map(banner => {
                        const styles = classNames("text-image", {"text-image-show": !(banner.title || banner.subtitle)});
                        const bannerStyles = classNames("banner", { "banner-full": isFullWidth });
                        const textStyles = classNames("text", { "text-full": isFullWidth, "no-text": isFullWidth && !banner.title && !banner.subtitle });
                        return (
                            <Carousel.Item>
                                <div styleName={!banner.title && !banner.subtitle ?"banner-without-text" : bannerStyles } style={{background: isFullWidth == true || (isFullWidth == false && !banner.title && !banner.subtitle) ? "url("+banner.image_url+") center center / cover no-repeat" : null}}>
                                    <div styleName={textStyles}>
                                        {
                                            banner.title || banner.subtitle || banner.button_text ?
                                                <div styleName="banner-content">
                                                    <div styleName="fields">
                                                        <Typography color={'white'} variant={'h3'} weight={'bold'}>{banner.title}</Typography>
                                                    </div>

                                                    <div styleName="fields fields-text">
                                                        <Typography color={'white'} variant={'small-body'}>{banner.subtitle}</Typography>
                                                    </div>
                                                    
                                                    {banner.button_text &&  banner.link_url ?
                                                    <div className="button-with-div">
                                                        <Button  onClick={() => this.handleClick(banner.link_url)} theme="action">
                                                            <Typography color={skin == "digital" ? "secondary" : "fixedwhite"} variant={'small-body'}>{banner.button_text}</Typography>
                                                        </Button>
                                                    </div>
                                                    : 
                                                        null
                                                    }
                                                </div>
                                            :
                                                <div/>
                                        }
                                    </div>
                                </div>
                            </Carousel.Item>
                        )
                    })}
                </Carousel>
            </div>
        );
      }
    
}

function mapStateToProps(state){
    return {
        profile: state.profile,
        ln: state.language
    };
}

export default connect(mapStateToProps)(Banners);
