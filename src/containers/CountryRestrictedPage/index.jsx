import React, { Component } from "react";
import { Typography, CountryIcon, EmailIcon, AffiliateIcon } from "components";
import { connect } from 'react-redux';
import { getApp, getAppCustomization } from "../../lib/helpers";
import { CopyText } from "../../copy";
import _ from 'lodash';

import "./index.css";

class CountryRestrictedPage extends Component {

    componentDidMount = () => {
    };

    render() {
        const { ln } = this.props;
        const copy = CopyText.countryRestrictedPage[ln];
        const info = getApp();
        const { logo } = getAppCustomization();

        return (
            <div styleName="root">
               <div styleName="container">
                   <div styleName="logo">
                        <img styleName="image" alt="bet protocol logo" src={logo.id} />
                   </div>
                   <div styleName="content">
                        <Typography variant={'h4'} weight={'bold'} color={'white'}>
                            {copy.TITLE(info.name)}
                        </Typography>
                   </div>
                   <div styleName="content">
                        <span styleName="icon">
                            <CountryIcon/>
                        </span>
                        <Typography variant={'body'} weight={'bold'} color={'casper'}>
                            {copy.SUBTITLE[0]}
                        </Typography>
                        <div>
                            <Typography variant={'small-body'} color={'grey'}>
                                {copy.TEXT[0](info.name)}
                            </Typography>
                        </div>
                    </div>
                    <div styleName="content">
                        <span styleName="icon">
                            <AffiliateIcon/>
                        </span>
                        <Typography variant={'body'} weight={'bold'} color={'casper'}>
                            {copy.SUBTITLE[1](info.name)}
                        </Typography>
                        <div>
                            <Typography variant={'small-body'} color={'grey'}>
                                {copy.TEXT[1]}
                            </Typography>
                        </div>
                    </div>
                    <div styleName="content">
                        <span styleName="icon">
                            <EmailIcon/>
                        </span>
                        <Typography variant={'body'} weight={'bold'} color={'casper'}>
                            {copy.SUBTITLE[2]}
                        </Typography>
                    </div>
               </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        ln: state.language
    };
}

export default connect(mapStateToProps)(CountryRestrictedPage);