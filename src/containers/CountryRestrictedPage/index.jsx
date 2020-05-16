import React, { Component } from "react";
import { Typography, CountryIcon, EmailIcon, AffiliateIcon } from "components";
import { connect } from 'react-redux';
import { getApp, getAppCustomization } from "../../lib/helpers";
import { CopyText } from "../../copy";
import Cache from "../../lib/cache/cache";
import getAppInfo from "lib/api/app";
import _ from 'lodash';

import "./index.css";

class CountryRestrictedPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            logo: null,
            appName: null,
            loading: true
        };
    }

    componentDidMount = async () => {
        await this.updateAppInfo();
        const { logo } = await getAppCustomization();
        const info = await getApp();

        this.setState({ logo : logo.id, appName : info.name, loading : false });
    };

    updateAppInfo = async () => {
        let app = await getAppInfo();

        Cache.setToCache("appInfo", app);
    };

    render() {
        const { logo, appName, loading } = this.state;
        const { ln } = this.props;
        const copy = CopyText.countryRestrictedPage[ln];


        return (
            <div styleName="root">
               {
                    loading ?
                        null
                    :
                        <div styleName="container"> 
                            <div styleName="logo">
                                {
                                    logo ?
                                            <img styleName="image" alt="bet protocol logo" src={logo} />
                                    :
                                            null
                                }
                            </div>
                            <div styleName="content">
                                    <Typography variant={'h4'} weight={'bold'} color={'white'}>
                                        {copy.TITLE(appName)}
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
                                            {copy.TEXT[0](appName)}
                                        </Typography>
                                    </div>
                                </div>
                                <div styleName="content">
                                    <span styleName="icon">
                                        <AffiliateIcon/>
                                    </span>
                                    <Typography variant={'body'} weight={'bold'} color={'casper'}>
                                        {copy.SUBTITLE[1](appName)}
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
               }
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