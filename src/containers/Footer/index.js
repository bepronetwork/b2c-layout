import React, { Component } from "react";
import UserContext from "containers/App/UserContext";
import { Row, Col} from 'reactstrap';
import { Typography } from 'components';
import logo from "assets/logo.png";

import "./index.css";

const footer = {
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
                    type : 'link',
                    text : '@2019 TKN',
                    href : '#',
                    size : "x-small-body",
                    color : 'casper',
                },
                {
                    type : 'link',
                    text : 'All Rights Reserved',
                    href : '#',
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
                    href : '#',
                    size : "small-body",
                    color : 'casper',
                },
                {
                    type : 'link',
                    text : 'Provably Fair',
                    href : '#',
                    size : "small-body",
                    color : 'casper',
                },
                {
                    type : 'link',
                    text : 'Guides',
                    href : '#',
                    size : "small-body",
                    color : 'casper',
                },
                {
                    type : 'link',
                    text : 'Terms of Service',
                    href : '#',
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
                    href : '#',
                    size : "small-body",
                    color : 'casper',
                },
                {
                    type : 'link',
                    text : 'Telegram',
                    href : '#',
                    size : "small-body",
                    color : 'casper',
                },
                {
                    type : 'link',
                    text : 'KakaoTalk',
                    href : '#',
                    size : "small-body",
                    color : 'casper',
                },
                {
                    type : 'link',
                    text : 'Discord',
                    href : '#',
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
                                        return (
                                            col.type == 'link' ? 
                                                <a styleName='item' href={col.href} target={'_blank'}>
                                                    <Typography
                                                        weight={col.size}
                                                        color={col.color}
                                                    > {col.text}</Typography>
                                                </a>
                                            : col.type == 'image' ? 
                                                <img src={col.image} style={{width : col.width}}/>
                                            : 
                                                null 
                                        )
                                    })}
                                </div>
                            </Col>
                        )}
                    )}
                </Row>
            </div>
        );
    }
}
