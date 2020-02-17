import React from "react";
import { Row, Col } from 'reactstrap';
import { Typography } from 'components';
import { connect } from "react-redux";
import './index.css';
import affiliate from 'assets/affiliate-background.png';
import { getApp } from "../../lib/helpers";
const info = getApp();

const arr = window.location.href.split("/");
const url = arr[0] + "//" + arr[2];
const URL_REF = url + `?ref=`;

class AffiliateLinkContainer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            checked : false,
            closed : false
        }
    }


    copyToClipboard = (e) => {
        const { link } = this.props;
        var textField = document.createElement('textarea')
        textField.innerText = URL_REF + link;
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()
    };

    render(){
        const { 
            link,
            percentageOnLevelOne
        } = this.props;


        return (
            <div styleName={`root`}>
                <img src={affiliate} styleName='affiliate-image'/>
                <div styleName='content'>
                    <div styleName={'text-description'}>
                        <Typography variant={'body'} color={`white`}>
                            Share and take a profit in {info.name} affiliate program!
                        </Typography>
                        <div styleName='subtitle-text'>
                            <Typography variant={'x-small-body'} color={`grey`}>
                                Get at least {percentageOnLevelOne*100}% whenever the house wins for each user registered with this link
                            </Typography>
                        </div>
                    </div>
        
                    <div styleName='text-container'>
                        <Row>
                            <Col xs={12} md={9}>
                                <div styleName='link-text-container'>
                                    <Typography variant={'small-body'} color={`casper`}>
                                        {URL_REF + link}
                                    </Typography>
                                </div>
                            </Col>
                            <Col xs={12} md={3}>
                                <button onClick={this.copyToClipboard} styleName='text-copy-container'>
                                    <Typography variant={'small-body'} color={'white'}>
                                        Copy
                                    </Typography>
                                </button>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        )
    }
}


function mapStateToProps(state){
    return {
        profile : state.profile
    };
}

export default connect(mapStateToProps)(AffiliateLinkContainer);
