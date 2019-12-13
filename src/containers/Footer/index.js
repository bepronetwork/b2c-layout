import React, { Component } from "react";
import { Row, Col} from 'reactstrap';
import { Typography, LanguagePicker } from 'components';
import { Link } from 'react-dom';
import { connect } from "react-redux";
import "./index.css";
import { getAppCustomization, getApp } from "../../lib/helpers";

const footerStaticOutput = ({supportLinks, communityLinks}) => {
    const { logo } = getAppCustomization();
    const info = getApp();
    return {
        info : {
            text : `If you reside in a location where lottery, gambling, or betting over the internet is illegal, please do not click on anything related to these activities on this site. You must be 21 years of age to click on any gambling related items even if it is legal to do so in your location. Recognising that the laws and regulations involving online gaming are different everywhere, players are advised to check with the laws that exist within their own jurisdiction or region to ascertain the legality of the activities which are covered. The games provided by ${info.name} are based on blockchain, fair, and transparency. When you start playing these games, please take note that online gambling and lottery is an entertainment vehicle and that it carries with it a certain degree of financial risk. Players should be aware of these risks and govern themselves accordingly.`,
            size : "x-small-body",
            color : 'grey',
        },
        tabs : [
            { 
                col : 4,
                align : 'left',
                items : [
                    {
                        type : 'image',
                        image : logo.id,
                        width : 150
                    },
                    {
                        type : 'text',
                        text : `@2019 ${info.name}`,
                        size : "x-small-body",
                        color : 'casper',
                    },
                    {
                        type : 'text',
                        text : 'All Rights Reserved',
                        size : "x-small-body",
                        color : 'white',
                    }
                ]
            },
            { 
                col : 4,
                align : 'left',
                title : {
                    color : 'white',
                    text : 'Support',
                    size : "body"
                },
                items : supportLinks.map( s => {
                    return {
                        type : 'link',
                        text : s.name,
                        href : s.href,
                        size : "small-body",
                        color : 'casper',
                    }
                })
            },
            { 
                col : 4,
                align : 'left',
                title : {
                    color : 'white',
                    text : 'Community',
                    size : "body"
                },
                items : communityLinks.map( s => {
                    return {
                        type : 'link',
                        text : s.name,
                        href : s.href,
                        size : "small-body",
                        color : 'casper',
                    }
                })
            }
        ]
    }
    
} 
class Footer extends Component {

    constructor(props){
        super(props);
        this.state = {
            supportLinks : [],
            communityLinks : []
        };
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }


    projectData = async () => {
        const { footer } = getAppCustomization();
        this.setState({supportLinks : footer.supportLinks, communityLinks : footer.communityLinks})
    }

    render() {
        const { supportLinks, communityLinks } = this.state;
        let footerInfo = footerStaticOutput({supportLinks, communityLinks});

        return (
            <div styleName="container">
                <div styleName="footer">
                    <Row>
                        {footerInfo.tabs.map( tab =>  {
                            return(
                                <Col md={tab.col}>
                                    <div styleName={tab.align}>
                                        {/* Title */}
                                        {tab.title ? 
                                            <div styleName='title'>
                                                <Typography
                                                    weight={tab.title.size}
                                                    color={tab.title.color} 
                                                >   
                                                    {tab.title.text}
                                                </Typography>
                                            </div>
                                        : null}

                                        {/* Text */}
                                        {tab.items.map( col => {
                                            switch(col.type){
                                                case 'link' : {
                                                    return (
                                                        <a styleName='item' href={col.href} target={'_blank'}>
                                                            <Typography
                                                                weight={col.size}
                                                                color={col.color}
                                                            > {col.text}</Typography>
                                                        </a>
                                                    )
                                                };
                                                case 'image' : {
                                                    return (
                                                        <img src={col.image} style={{width : col.width}}/>
                                                    )
                                                };
                                                case 'text' : {
                                                    return (
                                                        <div styleName='no-hover-item'>
                                                            <Typography
                                                                weight={col.size}
                                                                color={col.color}
                                                            > {col.text}</Typography>
                                                        </div>
                                                    )
                                                };
                                                case 'route' : {
                                                    return (
                                                        <Link to={col.href} styleName='item'>
                                                            <Typography
                                                                weight={col.size}
                                                                color={col.color}
                                                            > {col.text}</Typography>
                                                        </Link>
                                                    )
                                                };

                                            }
                                        })}
                                    </div>
                                </Col>
                            )}
                        )}
                    </Row>
                    <div styleName='footer-language-picker'>
                        <LanguagePicker/>
                    </div>
                    <div styleName='footer-info'>
                        <Typography
                            weight={footerInfo.info.size}
                            color={footerInfo.info.color}
                        > {footerInfo.info.text}</Typography>
                    </div>
                </div>
            </div>

        );
    }
}



function mapStateToProps(state){
    return {
        profile: state.profile,
        ln : state.language
    };
}

export default connect(mapStateToProps)(Footer);

