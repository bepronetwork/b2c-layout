import React from "react";
import { Row, Col } from 'reactstrap';
import { Typography } from 'components';
import { connect } from "react-redux";
import classNames from "classnames";
import { getApp } from "../../lib/helpers";
import { CopyText } from '../../copy';

import './index.css';

const info = getApp();

const arr = window.location.href.split("/");
const url = arr[0] + "//" + arr[2];
const URL_REF = url + `/?ref=`;

class AffiliateLinkContainer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            checked : false,
            closed : false,
            copied: false
        }
    }

    componentDidMount(){
        this.setState({...this.state, copied: false});
    }

    componentWillReceiveProps(props){
        this.setState({...this.state, copied: false});
    }

    copyToClipboard = (e) => {
        const { link } = this.props;
        var textField = document.createElement('textarea');
        textField.innerText = URL_REF + link;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();

        this.setState({ copied: true })
    };

    render(){
        const { 
            link,
            percentageOnLevelOne
        } = this.props;
        const { copied } = this.state;
        const {ln} = this.props;
        const copy = CopyText.affiliateLinkContainerIndex[ln];
        const styles = classNames("link-text-container", {"ad-copied": copied});

        return (
            <div styleName={`root`}>
                <div styleName='content'>
                    <div styleName={'text-description'}>
                        <Typography variant={'body'} color={`white`}>
                            {copy.INDEX.TYPOGRAPHY.FUNC_TEXT[0](info.name)}
                        </Typography>
                        <div styleName='subtitle-text'>
                            <Typography variant={'x-small-body'} color={`grey`}>
                            {copy.INDEX.TYPOGRAPHY.FUNC_TEXT[1](percentageOnLevelOne*100)}
                            </Typography>
                        </div>
                    </div>
        
                    <div styleName='text-container'>
                        <Row>
                            <Col xs={12} md={10}>
                                {copied ? (
                                    <div styleName="copied">
                                        <Typography variant="small-body" color={'white'}>
                                            Copied
                                        </Typography>
                                    </div>
                                ) : null}
                                <div styleName={styles}>
                                    <Typography variant={'x-small-body'} color={`casper`}>
                                        {URL_REF + link}
                                    </Typography>
                                </div>
                            </Col>
                            <Col xs={12} md={2}>
                                <button onClick={this.copyToClipboard} styleName='text-copy-container'>
                                    <Typography variant={'x-small-body'} color={'white'}>
                                        {copy.INDEX.TYPOGRAPHY.TEXT[0]}
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
        profile : state.profile,
        ln: state.language
    };
}

export default connect(mapStateToProps)(AffiliateLinkContainer);
