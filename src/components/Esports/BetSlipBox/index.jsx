import React, { Component } from "react";
import { Typography, InputNumber } from 'components';
import { connect } from 'react-redux';
import CloseCircleIcon from 'mdi-react/CloseCircleIcon';
import { removeBetSlipFromResult } from "../../../redux/actions/betSlip";
import _ from 'lodash';
import "./index.css";


class BetSlipBox extends Component {

    constructor(props){
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    async handleRemoveToBetSlip(id) {
        await this.props.dispatch(removeBetSlipFromResult(id));
    }

    render() {

        const { bet } = this.props;

        return (
            <div styleName="box">
                <div styleName="bet-header">
                    <div styleName="game-section">
                        <img src={bet.image}/>
                    </div>
                    <div>
                        <Typography variant={'x-small-body'} color={'grey'}>
                            {bet.title}
                        </Typography>
                    </div>
                    <div styleName="close-btn">
                        <button type="button" onClick={() => this.handleRemoveToBetSlip(bet.id)}>
                            <CloseCircleIcon color={'white'} size={20}/>
                        </button>
                    </div>
                </div>
                <div>
                    <Typography variant={'small-body'} color={'white'}>
                        {bet.name}
                    </Typography>
                </div>
                <div styleName="controls">
                    <div styleName="section section-left">
                        <InputNumber
                            name="win-profit"
                            title="Bet Amount"
                            icon="bitcoin"
                            precision={2}
                            disabled={false}
                        />
                    </div>
                    <div styleName="section odds-section">
                        <Typography variant={'small-body'} color={'white'}>
                            at {bet.probability}
                        </Typography>
                    </div>
                </div>
                <div styleName="return">
                    <Typography variant={'x-small-body'} color={'grey'}>
                        to return: 0.01 ETH
                    </Typography>
                </div>
            </div>
        )

    }
}

function mapStateToProps(state){
    return {
        profile : state.profile,
        ln: state.language
    };
}

export default connect(mapStateToProps)(BetSlipBox);