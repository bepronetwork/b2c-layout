import React, { Component } from "react";
import { Typography, Button } from 'components';
import { BetSlipBox } from 'components/Esports';
import { removeAllFromResult } from "../../../redux/actions/betSlip";
import { connect } from 'react-redux';
import _ from 'lodash';
import "./index.css";


class BetSlip extends Component {

    constructor(props){
        super(props);
        this.state = {
            betSlip: null
        };
    }

    componentDidMount() {
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = (props) => {
        const { betSlip } = props;

        this.setState({
            betSlip
        });
    }

    async handleRemoveAll() {
        await this.props.dispatch(removeAllFromResult(null));
    }

    render() {

        const { betSlip } = this.state;

        return (
            <div>
                {(_.isEmpty(betSlip)) 
                    ?
                        <div styleName="empty">
                            <Typography variant={'x-small-body'} color={'grey'}>
                                You haven’t selected any bets yet
                            </Typography>
                        </div>
                    :
                        <div>
                            <div styleName="betslip-header">
                                <Typography variant={'small-body'} color={'white'}>
                                    {`Betslip (${betSlip.length})`}
                                </Typography>
                                <button styleName="clear-all" type="button" onClick={() => this.handleRemoveAll()}>
                                    <Typography variant={'small-body'} color={'grey'}>
                                        Clear all
                                    </Typography>
                                </button>
                            </div>
                            {betSlip.map(bet => {
                                return (
                                    <BetSlipBox bet={bet} />
                                )
                            })}
                            <div styleName="total-returns">
                                <Typography variant={'small-body'} color={'grey'}>
                                    Total returns: 2.3 ETH
                                </Typography>
                            </div>
                            <Button fullWidth theme="primary">
                                <Typography weight="semi-bold" color="pickled-bluewood">
                                    Bet
                                </Typography>
                            </Button>
                        </div>
                }
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        profile : state.profile,
        ln: state.language,
        betSlip: state.betSlip
    };
}

export default connect(mapStateToProps)(BetSlip);