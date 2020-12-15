import React, { Component } from "react";
import { DepositsIcon, Table, LoadMoreData, SelectBox } from 'components';
import { connect } from "react-redux";
import { dateToHourAndMinute, isUserSet, getIcon } from "../../lib/helpers";
import { formatCurrency } from "../../utils/numberFormatation";
import { Numbers, AddressConcat } from '../../lib/ethereum/lib';
import { CopyText } from "../../copy";
import _ from 'lodash';
import "./index.css";

const views = [  
    { text: 5, value: 5 }, 
    { text : 10, value : 10 }, 
    { text : 25, value : 25 }, 
    { text : 50, value : 50 }, 
    { text : 100, value : 100 }
];

const rows = {
    deposits : {
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
                value: 'bonusAmount'
            },
            {
                value: 'status'
            }
        ],
        rows : []
    }
}

const defaultProps = {
    deposits     : rows.deposits,
    view        : 'deposits',
    view_amount : views[1],
    isLoading: true,
    isListLoading : true
}
class DepositTable extends Component {

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
        const copy = CopyText.depositspage[ln];
        let deposits = [];

        if(options){
            view_amount = options.view_amount ? options.view_amount : view_amount;
        }

        if(profile && !_.isEmpty(profile)){
            const transactions = await profile.getMyTransactions({ size: 10, offset: 0 });

            deposits = transactions && transactions.deposits || [];
        }

        const depositsIcon = getIcon(18);

        this.setState({...this.state, 
            ...options,
            isLoading : false,
            isListLoading : false,
            options : Object.keys(copy.TABLE).map( (key) => {
                return {
                    value : new String(key).toLowerCase(),
                    label : copy.TABLE[key].TITLE,
                    icon : depositsIcon === null ? <DepositsIcon /> : <img src={depositsIcon} />
                }
            }),
            deposits : {
                ...this.state.deposits,
                titles : copy.TABLE.DEPOSITS.ITEMS,
                rows : deposits.map( (d) =>  {
                    return {
                        amount: formatCurrency(Numbers.toFloat(d.amount)),
                        transactionHash: d.transactionHash ? AddressConcat(d.transactionHash) : 'N/A',
                        creation_timestamp: dateToHourAndMinute(d.creation_timestamp),
                        status: d.transactionHash ? 'Confirmed' : 'Confirm',
                        currency: d.currency,
                        link_url: d.link_url,
                        bonusAmount: d.bonusAmount
                    }
                })
            }
        })
    }

    setTimer = (options) => {
        this.projectData(this.props, options)
    }

    changeView = ({ option }) => {
        const { text, value } = option;
        const { deposits } = this.state;
        const { rows } = deposits;
    
        const size = Math.min(rows.length, value);
    
        this.setState({ view_amount: { text: size, value: size } });
    };

    confirmDeposit = async (deposit) => {
        try{
            const { profile } = this.props;
            /* Create Deposit Framework */
            let res = await profile.confirmDeposit(deposit);
            let { message, status } = res.data;
            if(status != 200){throw message};
            /* Update user Data */
            await profile.getAllData(true);            
        }catch(err){
            console.log(err)
        }
    }

    formatDeposits = deposits => {
        const formatedDeposits = deposits.map((d) => {
            return {
                amount: formatCurrency(Numbers.toFloat(d.amount)),
                transactionHash: d.transactionHash ? AddressConcat(d.transactionHash) : 'N/A',
                creation_timestamp: dateToHourAndMinute(d.creation_timestamp),
                status: d.transactionHash ? 'Confirmed' : 'Confirm',
                currency: d.currency,
                link_url: d.link_url,
                bonusAmount: d.bonusAmount
            }
        })

        return formatedDeposits;
    }

    loadMoreDeposits = async () => {
        const { profile } = this.props;
        const { deposits } = this.state;

        if (profile && !_.isEmpty(profile)) {
            this.setState({ isListLoading: true });

            const dataSize = deposits.rows.length || 0;

            const transactions = await profile.getMyTransactions({ size: 10, offset: dataSize });
            const rawDepositsData = transactions && transactions.deposits || [];
            
            const newDeposits = _.concat(deposits.rows, this.formatDeposits(rawDepositsData));

            this.setState({ 
                deposits: { ...deposits, rows: newDeposits }, 
                view_amount: { text: newDeposits.length, value: newDeposits.length }, 
                isListLoading: false 
            })
        }
    }

    createSlice = size => {
        const { deposits } = this.state;
        const rows = deposits.rows;
    
        const sliceIndex = Math.min(rows.length, size);
    
        return rows.slice(0, sliceIndex)
    }

    render() {
        const { isListLoading, view, view_amount } = this.state;
        const { profile } = this.props;
        if(!isUserSet(profile)){return}

        return (
            <div styleName='container'>
                <div styleName='lastBets'>
                    <div styleName="filters">
                        <div styleName='bets-dropdown'>
                            <SelectBox
                                size='small'
                                onChange={(e) => this.changeView(e)}
                                options={views}
                                value={view_amount}
                            /> 
                        </div>
                    </div>
                </div>
                <Table
                    rows={this.createSlice(view_amount.value)}
                    titles={this.state[view].titles}
                    fields={this.state[view].fields}
                    size={view_amount.value}
                    isLoading={isListLoading}
                /> 
                
                <LoadMoreData isLoading={isListLoading} onLoadMore={this.loadMoreDeposits} />
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

export default connect(mapStateToProps)(DepositTable);
