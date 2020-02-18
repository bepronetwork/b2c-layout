import React, { Component } from "react";
import {  Typography, InputText,  DropDownField, AnimationNumber } from "components";
import { connect } from "react-redux";
import _ from 'lodash';
import UsersGroupIcon from 'mdi-react/UsersGroupIcon';
import { Row, Col } from 'reactstrap';
import "./index.css";
import { MenuItem } from '@material-ui/core';
import languages from "../../config/languages";
import PropTypes from "prop-types";
import { formatCurrency } from '../../utils/numberFormatation';
import "./index.css"
import { setCurrencyView } from "../../redux/actions/currency";
import { getApp } from "../../lib/helpers";

const defaultProps = {
    currencies : [],
    currency : { }
}

class CurrencyDropDown extends React.Component {

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

    projectData = async (props) => {
        const { profile, currency } = props;
        var currencies = getApp().currencies;
        if(!currencies || _.isEmpty(currencies) || currencies.length < 0){return}
        currencies = currencies.map( 
            c => {
                const w = profile.getWallet({currency : c});
                return {
                    ...c,
                    balance : w.playBalance
                }
            }
        )
        this.setState({
            currencies,
            currency : !_.isEmpty(currency) ? currency : currencies[0]
        })
    }

    changeCurrency = async (item) => {
        const { currencies } = this.state;
        item = currencies.find( a => {
            if(new String(a._id).toString() == new String(item.value).toString()){
                return a;
            }
        })
        await this.props.dispatch(setCurrencyView(item));
        this.setState({...this.state, currency : item})
    }

    render() {
        const { currencies, currency } = this.state;
        if (_.isEmpty(currency)) return null;

        return (
            <div styleName="root">
                <div styleName="container">          
                    <DropDownField
                        id="currency"
                        type={'currency'}
                        onChange={this.changeCurrency}
                        options={currencies}
                        value={currency ? currency._id : null}
                        style={{width : '100%'}}
                        label="Currency"
                        >
                        {currencies.map(option => (
                            <MenuItem key={option._id} value={option._id}>
                                <div styleName={'currency-box-top'}>
                                    <img src={option.image} styleName='image-coin'/> 
                                    <p styleName='option-text'>  
                                        <AnimationNumber variant={'small-body'} decimals={6} number={formatCurrency(option.balance)}/>
                                    </p>
                                </div>
                            </MenuItem>
                        ))}
                    </DropDownField> 
                </div>
            </div>
        );
    }
}




function mapStateToProps(state){
    return {
        profile: state.profile,
        currency : state.currency
    };
}

CurrencyDropDown.propTypes = {
    dispatch: PropTypes.func
};

export default connect(mapStateToProps)(CurrencyDropDown);
