import React, { Component } from "react";
import { WithdrawIcon, Tabs, SelectBox, Table } from 'components';
import { connect } from "react-redux";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { dateToHourAndMinute, isUserSet, getSkeletonColors } from "../../lib/helpers";
import { formatCurrency } from "../../utils/numberFormatation";
import { Numbers, AddressConcat } from '../../lib/ethereum/lib';
import { CopyText } from "../../copy";
import _ from 'lodash';
import "./index.css";

const views = [{ text : 10, value : 10 }, { text : 25, value : 25 }, { text : 50, value : 50 }, { text : 100, value : 100 }];

const rows = {
    withdraws : {
        titles : [],
        fields : [
            {
                value : 'transactionHash',
                isLink: true,
                linkField: 'link_url'
            },
            {
                value : 'creation_timestamp'
            },
            {
                value : 'amount',
                currency: true
            },
            {
                value: 'done'
            },
            {
                value: 'status'
            }
        ],
        rows : []
    }
}

const defaultProps = {
    withdraws     : rows.withdraws,
    view        : 'withdraws',
    view_amount : views[0],
    isLoading: true,
    isListLoading : true
}
class WithdrawTable extends Component {

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

    projectData = async (props, options=null) => {
        const { profile, ln } = props;
        let { view_amount } = this.state;
        const copy = CopyText.withdrawspage[ln];
        let withdraws = [];

        if(options){
            view_amount = options.view_amount ? options.view_amount : view_amount;
        }

        if(profile && !_.isEmpty(profile)){
            withdraws = await profile.getWithdraws();
        }

        this.setState({...this.state, 
            ...options,
            isLoading : false,
            isListLoading : false,
            options : Object.keys(copy.TABLE).map( (key) => {
                return {
                    value : new String(key).toLowerCase(),
                    label : copy.TABLE[key].TITLE,
                    icon : <WithdrawIcon/>
                }
            }),
            withdraws : {
                ...this.state.withdraws,
                titles : copy.TABLE.WITHDRAWS.ITEMS,
                rows : withdraws.map( (d) =>  {
                    return {
                        amount: formatCurrency(Numbers.toFloat(d.amount)),
                        transactionHash: d.transactionHash ? AddressConcat(d.transactionHash) : 'N/A',
                        creation_timestamp: dateToHourAndMinute(d.creation_timestamp),
                        status: d.confirmed ? 'Confirmed' : 'Open',
                        currency: d.currency,
                        link_url: d.link_url,
                        done: d.confirmed ? 'Done' : 'Unconfirmed'
                    }
                })
            }
        })
    }

    setTimer = (options) => {
        this.projectData(this.props, options)
    }

    changeView = ({option}) => {
        this.setState({...this.state, isListLoading : true })
        this.setTimer({view_amount : option})
    }

    render() {
        const { isLoading, isListLoading, options, view } = this.state;
        const { profile } = this.props;
        if(!isUserSet(profile)){return}

        return (
            <div styleName='container'>
                {/*isLoading ?
                    <SkeletonTheme color={ getSkeletonColors().color} highlightColor={ getSkeletonColors().highlightColor}>
                        <div styleName='lastBets' style={{opacity : '0.5'}}>
                            <div styleName='filters'>
                                <div styleName='bets-dropdown-game'>
                                    <Skeleton width={100} height={30}/>
                                </div>
                                <div styleName='bets-dropdown'>
                                    <Skeleton width={50} height={30}/>
                                </div>
                            </div>
                        </div>
                    </SkeletonTheme>
                :
                    <div styleName='lastBets'>
                        <Tabs
                            selected={view}
                            options={options}
                        />
                        <div styleName="filters">
                            <div styleName='bets-dropdown'>
                                <SelectBox
                                    onChange={(e) => this.changeView(e)}
                                    options={views}
                                    value={this.state.view_amount}
                                /> 
                            </div>
                        </div>
                    </div>
                */}
                <Table
                    rows={this.state[view].rows}
                    titles={this.state[view].titles}
                    fields={this.state[view].fields}
                    size={this.state.view_amount.value}
                    isLoading={isListLoading}
                /> 
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

export default connect(mapStateToProps)(WithdrawTable);