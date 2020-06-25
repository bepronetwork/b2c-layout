import React, { Component } from "react";
import { Typography, InputNumber } from 'components';
import { connect } from 'react-redux';
import CloseCircleIcon from 'mdi-react/CloseCircleIcon';
import { removeBetSlipFromResult } from "../../../redux/actions/betSlip";
import { matches }  from '../../../containers/Esports/fakeData';
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
        const match = matches.find(m => m.id === bet.match);
        const team = match.teams.find(t => t.id == bet.option.team);


        return (
            <div styleName="box">
                <div styleName="bet-header">
                    <div styleName="game-section">
                        <img src={team.flag}/>
                    </div>
                    <div>
                        <Typography variant={'x-small-body'} color={'grey'}>
                            {`${match.teams[0].name} vs ${match.teams[1].name}`}
                        </Typography>
                    </div>
                    <div styleName="close-btn">
                        <button type="button" onClick={() => this.handleRemoveToBetSlip(bet.option.id)}>
                            <CloseCircleIcon color={'white'} size={20}/>
                        </button>
                    </div>
                </div>
                <div>
                    <Typography variant={'small-body'} color={'white'}>
                        {`${bet.option.name} - ${bet.title}`}
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
                            at {bet.option.value}
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