import React, { Component } from "react";
import { Typography, CountryIcon, EmailIcon, AffiliateIcon } from "components";
import { connect } from 'react-redux';
import { getApp, getAppCustomization, getIcon } from "../../lib/helpers";
import { CopyText } from "../../copy";
import Cache from "../../lib/cache/cache";
import getAppInfo from "lib/api/app";
import "./index.css";

class CountryRestrictedPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            logo: null,
            appName: null,
            loading: true,
            emailIcon: null,
            countryIcon: null,
            affiliateReferralIcon: null
        };
    }

    componentDidMount = async () => {
        await this.updateAppInfo();
        const { logo } = await getAppCustomization();
        const info = await getApp();
        const emailIcon = getIcon(11);
        const countryIcon = getIcon(28);
        const affiliateReferralIcon = getIcon(22);

        this.setState({ logo : logo.id, appName : info.name, loading : false, emailIcon, countryIcon, affiliateReferralIcon });
    };

    updateAppInfo = async () => {
        let app = await getAppInfo();

        Cache.setToCache("appInfo", app);
    };

    render() {
        const { logo, appName, loading, emailIcon, countryIcon, affiliateReferralIcon } = this.state;
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
                                        {countryIcon === null ? <CountryIcon/> : <img src={countryIcon} />}
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
                                        {affiliateReferralIcon === null ? <AffiliateIcon/> : <img src={affiliateReferralIcon} />}
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
                                        {emailIcon === null ? <EmailIcon/> : <img src={emailIcon} />}
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