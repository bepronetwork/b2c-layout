import React from "react";
import { connect } from "react-redux";
import { Typography, JackpotPotIcon } from "components";
import { getApp, getSkeletonColors } from "../../lib/helpers";
import { formatCurrency } from '../../utils/numberFormatation';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import _ from 'lodash';
import coinPng from 'assets/coin.png';

import './index.css';

class JackpotPot extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            pot: 0,
            currencyImage: null
        }
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        const { profile, currency } = this.props;

        if(profile && !_.isEmpty(profile)){
            const appWallet = getApp().wallet.find(w => w.currency._id === currency._id);
            const res = await profile.getJackpotPot({ currency_id: currency._id });

            this.setState({
                currencyImage: _.isEmpty(appWallet.image) ? currency.image : appWallet.image,
                pot: res ? res.pot : 0
            });
        }
    }

    render(){
        const { pot, currencyImage } = this.state;

        if(pot == 0) { return null };

        return (
            <div styleName="box">
                <div  style={{ background: 'url('+coinPng+')', backgroundPosition: "right bottom", backgroundSize: "auto 100%", backgroundRepeat: "no-repeat"}}>
                    <div styleName="root">
                        <div styleName="main">
                            <div styleName="icon">
                                <JackpotPotIcon/>
                                <div styleName="text">
                                    <Typography variant={'h4'} color={'white'} weight={"bold"}>
                                        JACKPOT
                                    </Typography>
                                    <Typography variant={'x-small-body'} color={'white'}>
                                        Text to explain the Jackpot Pot. How can I win?
                                    </Typography>
                                </div>
                            </div>

                            <div styleName="right">
                                <div styleName="value">   
                                    <img src={currencyImage} width={"24"} heigth={"24"}/>
                                    <Typography variant={'h4'} color={'white'} weight={"bold"}>
                                        {formatCurrency(pot)}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        profile : state.profile,
        ln: state.language,
        currency: state.currency
    };
}

export default connect(mapStateToProps)(JackpotPot);