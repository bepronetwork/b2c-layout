import React, { Component } from "react";
import Carousel from 'react-bootstrap/Carousel'
import { Typography, Button } from "components";
import { connect } from "react-redux";
import { getAppCustomization } from "../../lib/helpers";
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
                    {banners.map(banner => (
                        <Carousel.Item>
                            <div styleName="banner">
                                <div styleName="text">
                                    <div styleName="fields">
                                        <Typography color={'grey'} variant={'h4'}>{banner.title}</Typography>
                                    </div>

                                    <div styleName="fields">
                                        <Typography color={'grey'} variant={'small-body'}>{banner.subtitle}</Typography>
                                    </div>
                                    
                                    <Button  onClick={() => this.handleClick(banner.link_url)} theme="action">
                                        <Typography color={'white'} variant={'small-body'}>{banner.button_text}</Typography>
                                    </Button>
                                </div>
                                <div styleName="image" style={{background: "url("+banner.image_url+") center center / cover no-repeat"}}>
                                    <div styleName="text-image">
                                        <div styleName="fields">
                                            <Typography color={'white'} variant={'h3'}>{banner.title}</Typography>
                                        </div>

                                        <div styleName="fields">
                                            <Typography color={'white'} variant={'body'}>{banner.subtitle}</Typography>
                                        </div>
                                        
                                        <Button  onClick={() => this.handleClick(banner.link_url)} theme="action" size={'x-small'}>
                                            <Typography color={'white'} variant={'body'}>{banner.button_text}</Typography>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Carousel.Item>
                    ))}
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
