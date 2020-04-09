import React, { Component } from "react";
import { Row, Col} from 'reactstrap';
import { Typography, LanguagePicker, LegalBox } from 'components';
import { Link } from 'react-dom';
import { connect } from "react-redux";
import "./index.css";
import { getAppCustomization, getApp } from "../../lib/helpers";
import {CopyText} from "../../copy";

const footerStaticOutput = ({props, supportLinks, communityLinks}) => {
    const { logo } = getAppCustomization();
    const info = getApp();
    console.log(info);
    const {ln} = props;
    const copy = CopyText.homepage[ln];

    return {
        info : {
            text : copy.CONTAINERS.FOOTER.INFO.TEXT[0](info.name),
            size : "x-small-body",
            color : 'grey',
        },
        tabs : [
            { 
                col : 4,
                align : 'left',
                show : info.name,
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
                show : info.isValid,
                return :  <LegalBox licenseID={info.licenseID}/> 
            },               
            { 
                col : 2,
                align : 'left',
                show : (supportLinks.length > 0),
                title : {
                    color : 'white',
                    text : copy.CONTAINERS.FOOTER.INFO.SUPPORT,
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
                col : 2,
                align : 'left',
                show : (communityLinks.length > 0),
                title : {
                    color : 'white',
                    text : copy.CONTAINERS.FOOTER.INFO.COMMUNITY,
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
        const props = this.props;
        let footerInfo = footerStaticOutput({props, supportLinks, communityLinks});

        return (
            <div styleName="container">
                <div styleName="footer">
                    <Row>
                        {footerInfo.tabs.map( tab =>  {
                            /* If not Data don´t show */
                            if(!tab.show){return null}

                            /* If there is an object to return */
                            if(tab.return){
                                return(
                                    <Col md={tab.col}>
                                        {tab.return}
                                    </Col>
                                )
                            }

                            /* If normal List of links */
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

