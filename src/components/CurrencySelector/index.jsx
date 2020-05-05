import React, { Component } from "react";
import PropTypes from "prop-types";
import ArrowDown from "components/Icons/ArrowDown";
import ArrowUp from "components/Icons/ArrowUp";
import { 
    Typography, UserIcon, LogoutIcon, CashierIcon
} from "components";
import { map } from "lodash";
import { CopyText } from '../../copy';
import { formatCurrency } from '../../utils/numberFormatation';
import { connect } from "react-redux";
import { getApp } from "../../lib/helpers";
import { setCurrencyView } from "../../redux/actions/currency";
import _ from 'lodash';

import "./index.css";

const defaultProps = {
    currencies : [],
    currency : {},
    open: false
}

class CurrencySelector extends Component {
    
    constructor(props) {
        super(props);
        this.state = {  ...defaultProps };
    }
    
    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    componentDidUpdate() {
        const { open } = this.state;

        if (open) {
            document.addEventListener("mousedown", this.handleClickOutside);
        } else {
            document.removeEventListener("mousedown", this.handleClickOutside);
        }
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    projectData = async (props) => {
        const { profile, currency } = props;
        const virtual = getApp().virtual;
        var currencies = getApp().currencies.filter(c => c.virtual === virtual);
        
        if(!currencies || _.isEmpty(currencies) || currencies.length < 0){return}
        currencies = currencies.map( 
            c => {
                const w = profile.getWallet({currency : c});
                return {
                    ...c,
                    balance : _.isEmpty(w) ? 0 : w.playBalance,
                    walletImage : _.isEmpty(w) ? null : w.image
                }
            }
        );

        this.setState({
            currencies,
            currency : !_.isEmpty(currency) ? currency : currencies[0]
        })
    }

    getOptions = () => {
        const { profile } = this.props;
        let { currencies } = this.state;
        
        if(!currencies || _.isEmpty(currencies) || currencies.length < 0){return}
        currencies = currencies.map( 
            c => {
                const w = profile.getWallet({currency : c});
                return {
                    value: c._id,
                    label: _.isEmpty(w) ? 0 : formatCurrency(w.playBalance),
                    icon: _.isEmpty(w.image) ? c.image : w.image,
                    currency: c
                }
            }
        )

        return currencies;
    };

    handleClickOutside = event => {
        const isOutsideClick = !this.optionsRef.contains(event.target);
        const isLabelClick = this.labelRef.contains(event.target);

        if (isOutsideClick && !isLabelClick) {
            this.setState({ open: false });
        }
    };

    handleLabelClick = () => {
        const { open } = this.state;

        this.setState({ open: !open });
    };

    renderLabel() {
        const { open, currency } = this.state;
        const { profile } = this.props;

        if (_.isEmpty(currency)) return null;

        const w = profile.getWallet({ currency });
        const balance =  _.isEmpty(w) ? 0 : formatCurrency(w.playBalance);
        const icon = _.isEmpty(w.image) ? currency.image : w.image;

        return (
            <div styleName="label">
                <div styleName="currency-icon">
                    <img src={icon} width={20}/>
                </div>
                <span>
                    <Typography color="white" variant={'small-body'}>{balance}</Typography>
                </span>
                {open ? <ArrowUp /> : <ArrowDown />}
            </div>
        );
    }

    renderOptionsLines = () => {
        return map(this.getOptions(), ({ value, label, icon, currency }) => (
        <button
            styleName="option"
            key={value}
            id={value}
            onClick={()=>this.changeCurrency(currency)}
            type="button"
        >
            <div styleName="currency-icon">
                <img src={icon} width={20}/>
            </div>
            <Typography variant="small-body" color="casper">{label}</Typography>
        </button>
        ));
    };

    renderOptions() {
        const { open } = this.state;

        if (!open) return null;

        return (
        <div styleName="options">
            <span styleName="triangle" />
            {this.renderOptionsLines()}
        </div>
        );
    }

    changeCurrency = async (item) => {
        await this.props.dispatch(setCurrencyView(item));
        this.setState({...this.state, currency : item, open : false})
    }

    render() {
        return (
            <div styleName="root">
                <button
                    ref={el => {
                        this.labelRef = el;
                    }}
                    onClick={this.handleLabelClick}
                    type="button">
                    {this.renderLabel()}
                </button>

                <div
                    ref={el => {
                        this.optionsRef = el;
                    }}>
                    {this.renderOptions()}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        profile : state.profile,
        ln: state.language,
        currency : state.currency
    };
}


export default connect(mapStateToProps)(CurrencySelector);