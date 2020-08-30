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
            index : 0
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

        this.setState({ banners : !_.isEmpty(banners) ? banners.ids : null })
    }

    handleSelect(selectedIndex, e) {
        this.setState({index : selectedIndex});
    }
    
    handleClick(url) {
        window.location.assign(url);
    }

    render() {
        const { banners, index } = this.state;
        
        if(_.isEmpty(banners)) { return null; }

        return (
            <div styleName='banners'>
              <Carousel activeIndex={index} onSelect={this.handleSelect.bind(this)} pause="hover">
                    {banners.map(banner => {
                        const styles = classNames("text-image", {"text-image-show": !(banner.title || banner.subtitle || banner.button_text)});

                        return (
                            <Carousel.Item>
                                <div styleName="banner">
                                    <div styleName="text">
                                        {
                                            banner.title || banner.subtitle || banner.button_text ?
                                                <div style={{marginTop: isFullWidth == true ? "auto" : null}}>
                                                    <div styleName="fields">
                                                        <Typography color={'white'} variant={'h3'} weight={'bold'}>{banner.title}</Typography>
                                                    </div>

                                                    <div styleName="fields fields-text">
                                                        <Typography color={'white'} variant={'small-body'}>{banner.subtitle}</Typography>
                                                    </div>
                                                    
                                                    {banner.button_text &&  banner.link_url ?
                                                        <Button  onClick={() => this.handleClick(banner.link_url)} theme="action">
                                                            <Typography color={'fixedwhite'} variant={'small-body'}>{banner.button_text}</Typography>
                                                        </Button>
                                                    : 
                                                        null
                                                    }
                                                </div>
                                            :
                                                <div/>
                                        }
                                    </div>
                                    <div styleName="image" style={{background: "url("+banner.image_url+") center center / cover no-repeat"}}>
                                        <div styleName={styles}>
                                            {
                                                banner.title || banner.subtitle || banner.button_text ?
                                                    <div>
                                                        <div styleName="fields">
                                                            <Typography color={'fixedwhite'} variant={'h3'} weight={'bold'}>{banner.title}</Typography>
                                                        </div>

                                                        <div styleName="fields fields-text">
                                                            <Typography color={'fixedwhite'} variant={'body'}>{banner.subtitle}</Typography>
                                                        </div>
                                                        
                                                        {banner.button_text &&  banner.link_url ?
                                                            <Button  onClick={() => this.handleClick(banner.link_url)} theme="action" size={'x-small'}>
                                                                <Typography color={'fixedwhite'} variant={'body'}>{banner.button_text}</Typography>
                                                            </Button>
                                                            : 
                                                            null
                                                        }
                                                    </div>
                                                :
                                                    <div/>
                                            }
                                        </div>
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
    };
}

export default connect(mapStateToProps)(Banners);
