import React, { Component } from "react";
import { Typography } from 'components';
import { connect } from "react-redux";
import { dateToHourAndMinute, isUserSet, getApp } from "../../../lib/helpers";
import { formatCurrency } from "../../../utils/numberFormatation";
import { Numbers } from '../../../lib/ethereum/lib';
import { CopyText } from "../../../copy";
import _ from 'lodash';
import "./index.css";

const defaultProps = {
    rows: [],
}
class DepositList extends Component {

    constructor(props){
        super(props);
        this.state = defaultProps;
    }

    componentDidMount(){
        const { isCurrentPath } = this.props;

        if (isCurrentPath) {
            this.projectData(this.props);
        }
    }

    componentWillReceiveProps(props){
        if(props !== this.props) {
            this.projectData(props);
        }
    }

    projectData = async (props) => {
        const { profile } = props;
        let deposits = [];

        if(profile && !_.isEmpty(profile)){
            deposits = await profile.getDeposits();

            deposits = deposits.length > 3 ? deposits.slice(0, 3) : deposits;
        }

        this.setState({...this.state, 
            rows : deposits.map( (d) =>  {
                return {
                    amount: formatCurrency(Numbers.toFloat(d.amount)),
                    creation_timestamp: dateToHourAndMinute(d.creation_timestamp),
                    currency: d.currency
                }
            })
        })
    }

    getCurrencyImage(currencyId) {

        if(!currencyId) return null;

        const currencies = getApp().currencies;
        const currenncy = (currencies.find(currency => currency._id == currencyId));

        if(!currenncy) return null;

        return (
            <img src={currenncy.image} width={16} height={16}/>
        )
    }

    render() {
        const { rows } = this.state;
        const { ln, profile } = this.props;
        const copy = CopyText.cashierFormIndex[ln];
        if(!isUserSet(profile)){return}

        return (
            <div styleName='container'>
                <div styleName='main'>
                    <Typography variant={'body'} color={'white'}> {copy.INDEX.TABS.LABEL[4]} </Typography>
                </div>
                <div>
                    {rows.map( (row) => 
                        <div styleName='row'>
                            <div styleName="col-1">
                                <Typography variant='x-small-body' color={"grey"}> {row["creation_timestamp"]} </Typography>
                            </div>
                            <div styleName="col-2">
                                <Typography variant='x-small-body' color={"grey"}> {row["amount"]} </Typography>
                                {this.getCurrencyImage(row["currency"])}
                            </div>
                        </div>
                    )}                    
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile,
        ln : state.language
    };
}

export default connect(mapStateToProps)(DepositList);
