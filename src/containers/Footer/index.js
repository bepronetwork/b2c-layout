import React, { Component } from "react";
import UserContext from "containers/App/UserContext";
import { Row, Col} from 'reactstrap';
import { Typography, LanguagePicker } from 'components';
import logo from "assets/logo.png";
import { Link } from 'react-dom';
import "./index.css";

const footer = {
    info : {
        text : 'If you reside in a location where lottery, gambling, or betting over the internet is illegal, please do not click on anything related to these activities on this site. You must be 21 years of age to click on any gambling related items even if it is legal to do so in your location. Recognising that the laws and regulations involving online gaming are different everywhere, players are advised to check with the laws that exist within their own jurisdiction or region to ascertain the legality of the activities which are covered. The games provided by TKN are based on blockchain, fair, and transparency. When you start playing these games, please take note that online gambling and lottery is an entertainment vehicle and that it carries with it a certain degree of financial risk. Players should be aware of these risks and govern themselves accordingly.',
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
                    image : logo,
                    width : 150
                },
                {
                    type : 'text',
                    text : '@2019 TKN',
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
            items : [
                {
                    type : 'link',
                    text : 'Afilliate',
                    href : '/account',
                    size : "small-body",
                    color : 'casper',
                },
                {
                    type : 'link',
                    text : 'Provably Fair',
                    href : 'https://cryptogambling.org',
                    size : "small-body",
                    color : 'casper',
                },
                {
                    type : 'link',
                    text : 'Guides',
                    href : 'https://medium.com/@tkn.dapp/deposit-withdrawal-on-tkn-com-b524e40feb26',
                    size : "small-body",
                    color : 'casper',
                },
                {
                    type : 'link',
                    text : 'Terms of Service',
                    href : 'https://storage.googleapis.com/tkn-betprotocol/terms-of-service.pdf',
                    size : "small-body",
                    color : 'casper',
                }
            ]
        },
        { 
            col : 4,
            align : 'left',
            title : {
                color : 'white',
                text : 'Community',
                size : "body"
            },
            items : [
                {
                    type : 'link',
                    text : 'Blog',
                    href : 'https://medium.com/@tkn.dapp',
                    size : "small-body",
                    color : 'casper',
                },
                {
                    type : 'link',
                    text : 'Telegram',
                    href : 'https://t.me/tkn_com',
                    size : "small-body",
                    color : 'casper',
                },
                {
                    type : 'link',
                    text : 'Discord',
                    href : '#',
                    size : "small-body",
                    color : 'casper',
                },
                {
                    type : 'link',
                    text : 'Safe Gambling',
                    href : 'https://www.begambleaware.org/',
                    size : "small-body",
                    color : 'casper',
                }
            ]
        }
    ]
}

export default class Footer extends Component {

    render() {
        return (
            <div styleName="container">
                <div styleName="footer">
                    <Row>
                        {footer.tabs.map( tab =>  {
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
                            weight={footer.info.size}
                            color={footer.info.color}
                        > {footer.info.text}</Typography>
                    </div>
                </div>
            </div>

        );
    }
}
