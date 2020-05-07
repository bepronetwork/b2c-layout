import React, { Component } from "react";
import { Row, Col} from 'reactstrap';
import { Typography, LanguagePicker, LegalBox, LanguageSelector } from 'components';
import { Link } from 'react-dom';
import { connect } from "react-redux";
import "./index.css";
import { getAppCustomization, getApp } from "../../lib/helpers";
import {CopyText} from "../../copy";

import logoMadeByBepro from 'assets/media/logo-bepro.png';
import logobitgo from 'assets/partners/logo-bitgo-white.png';
import logobetprotocol from 'assets/partners/betprotocol_white_logo.png';
import logobitcoin from 'assets/partners/bitcoin-white.png';
import logoethereum from 'assets/partners/ethereum_logo.png';

const footerStaticOutput = ({props, supportLinks, communityLinks}) => {
    const info = getApp();
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
                col : 2,
                align : 'left',
                show : (supportLinks.length > 0),
                title : {
                    color : 'white',
                    text : copy.CONTAINERS.FOOTER.INFO.SUPPORT,
                    size : "small-body",
                    weight : 'semi-bold'
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
                    size : "small-body",
                    weight : 'semi-bold'
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
            ,               
            { 
                col : 2,
                align : 'left',
                show : true,
                title : {
                    color : 'white',
                    text : copy.CONTAINERS.FOOTER.INFO.LANGUAGE,
                    size : "small-body",
                    weight : 'semi-bold'
                },
                items : [{
                    type : 'component',
                    component: <LanguageSelector showArrow={true} expand="bottom" size="small-body" color="casper"/>
                }]     
            }
        ]
    }
    
} 
class Footer extends Component {

    constructor(props){
        super(props);
        this.state = {
            supportLinks : [],
            communityLinks : [],
            logo: null
        };
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }


    projectData = async () => {
        const info = getApp();
        const { footer, logo } = getAppCustomization();
        this.setState({supportLinks : footer.supportLinks, communityLinks : footer.communityLinks, logo, info})
    }

    render() {
        const { supportLinks, communityLinks, logo, info } = this.state;
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
                                                    variant={tab.title.size}
                                                    weight={tab.title.weight}
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
                                                case 'component' : {
                                                    return (
                                                        col.component
                                                    )
                                                };

                                            }
                                        })}
                                    </div>
                                </Col>
                            )}
                        )}
                    </Row>
                    <div styleName='footer-partners'>
                        <Row>
                            <div className="col-md-2" styleName="col">
                                <a href={'https://www.bitgo.com'} target={'_blank'}>
                                    <img src={logobitgo} style={{height : 64}}/>
                                </a>
                            </div>
                            <div className="col-md-3" styleName="col">
                                <a href={'https://betprotocol.com'} target={'_blank'}>
                                    <img src={logobetprotocol} style={{height : 80}}/>
                                </a>
                            </div>
                            <div className="col-md-3" styleName="col">
                                <a href={'https://bitcoin.org'} target={'_blank'}>
                                    <img src={logobitcoin} style={{height : 64}}/>
                                </a>
                            </div>
                            <div className="col-md-3" styleName="col">
                                <a href={'https://ethereum.org'} target={'_blank'}>
                                    <img src={logoethereum} style={{height : 34}}/>
                                </a>
                            </div>
                            <div className="col-md-1" styleName="col">
                                <Typography weight="bold" variant="h4" color="white"> 
                                    18+
                                </Typography>
                            </div>
                        </Row>
                    </div>
                    <div styleName='footer-info'>
                        <Typography
                            weight={footerInfo.info.size}
                            color={footerInfo.info.color}
                        > 
                            {footerInfo.info.text}
                        </Typography>
                    </div>
                    <div styleName='footer-info'>
                        <Row>
                            {logo && logo.id ?
                                    <div className="col-md-2" styleName="col">
                                        <img src={logo.id} style={{height : 50}}/>
                                    </div>
                                :
                                    null
                            }
                            <div className="col-md-2" styleName="col">
                                <Typography weight="bold" variant="small-body" color="grey">
                                    {info ?
                                        `@${new Date().getFullYear()} ${info.name}`             
                                    :
                                        null
                                    }
                                    <br/>All Rights Reserved
                                </Typography>
                            </div>
                            {info && info.licenseID && info.isValid ?
                                <div className="col-md-2" styleName="col">
                                    <LegalBox licenseID={info.licenseID}/>             
                                </div>
                                :
                                null
                            }
                            <div className="col-md-2" styleName="col">
                                <a href={'https://betprotocol.com'} target={'_blank'}>
                                    <img src={logoMadeByBepro} styleName='bepro-made-by-logo'/>
                                </a>
                            </div>
                        </Row>
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

