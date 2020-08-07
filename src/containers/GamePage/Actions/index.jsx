import React, { Component } from "react";
import { Tabs, Typography } from "components";
import { escapedNewLineToLineBreakTag } from '../../../utils/br';
import { connect } from "react-redux";
import { CopyText } from "../../../copy";
import _ from 'lodash';
import { slotsRules } from "../../../components/SlotsGame/images";

import "./index.css";

class Actions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: "rules"
        };
    }

    handleTabChange = name => {
        this.setState({ tab: name });
    };

    render() {
        const { game, currency, profile, slots } = this.props;
        const { tab } = this.state;
        const { ln } = this.props;
        const copy = CopyText.homepagegame[ln];
        const rulesLabel = copy.RULES;
        const limitsLabel = copy.LIMITS;
        
        console.log(game);

        let tableLimit;
        if(profile && !_.isEmpty(profile)){
            const wallet = currency ? profile.getWallet({currency}) : null;
            const gameWallet = game.wallets.find( w => new String(w.wallet).toString() == new String(wallet.id).toString());
            tableLimit = gameWallet ? gameWallet.tableLimit : null;
        }

        return (
        <div styleName="root" style={{ overflowY: 'auto', overflowX : 'hidden'}}>
            <div >
                <Tabs
                    selected={tab}
                    onSelect={this.handleTabChange}
                    options={[
                    {
                        value: "rules",
                        label: rulesLabel
                    },
                    {
                        value: "limits",
                        label: limitsLabel
                    }
                    ]}
                />
            </div>
            {
                tab === "rules" ? 
                    !slots ?
                    <div styleName="rule">
                        <h1 styleName="rule-h1">
                            <img styleName="image-icon" src={game.image_url}/> 
                            <Typography variant='x-small-body' color={"grey"}>{game.name}</Typography>
                        </h1>
                        <div styleName="content">
                                {
                                    slotsRules.map(item => {
                                        return (
                                        <div styleName="icon-rule" key={item.id}>
                                            <object
                                                type="image/svg+xml"
                                                data={item.icon}
                                                styleName="icon"
                                            >
                                                svg-animation
                                            </object>
                                            <div styleName="column-numbers">
                                            <div styleName="row-number">
                                                <div styleName="margin-right">
                                                    <Typography color={'casper'} variant={'small-body'}>
                                                        5
                                                    </Typography>
                                                </div>
                                                <Typography color={'grey'} variant={'small-body'}>
                                                    {item.value5}
                                                </Typography>
                                            </div>
                                            <div styleName="row-number">
                                                <div styleName="margin-right">
                                                    <Typography color={'casper'} variant={'small-body'}>
                                                        4
                                                    </Typography>
                                                </div>
                                                <Typography color={'grey'} variant={'small-body'}>
                                                    {item.value4}
                                                </Typography>
                                            </div>
                                            <div styleName="row-number">
                                                <div styleName="margin-right">
                                                    <Typography color={'casper'} variant={'small-body'}>
                                                        3
                                                    </Typography>
                                                </div>
                                                <Typography color={'grey'} variant={'small-body'}>
                                                    {item.value3}
                                                </Typography>
                                            </div>
                                            <div styleName="row-number">
                                                <div styleName="margin-right">
                                                    <Typography color={'casper'} variant={'small-body'}>
                                                        2
                                                    </Typography>
                                                </div>
                                                <Typography color={'grey'} variant={'small-body'}>
                                                    {item.value2}
                                                </Typography>
                                            </div>
                                            </div>
                                        </div>
                                        );
                                    })
                                }
                        </div>
                    </div>
                    :
                    <div styleName="rule">
                        <h1 styleName="rule-h1">
                            <img styleName="image-icon" src={game.image_url}/> 
                            <Typography variant='x-small-body' color={"grey"}> {game.name} </Typography>
                        </h1>
                        <div styleName="content">
                            <Typography color={'grey'} variant={'small-body'}>
                                {escapedNewLineToLineBreakTag(game.rules)}
                            </Typography>
                        </div>
                    </div>
                : 
                    <div styleName="rule">
                        <h1 styleName="rule-h1">
                            <Typography variant='body' color={"grey"}> {currency.ticker} </Typography>
                        </h1>
                        <div styleName="content">
                            <span>
                                <Typography color={'grey'} variant={'small-body'}>Min: 0.01</Typography>
                            </span>
                            <span>
                                <Typography color={'grey'} variant={'small-body'}>Max: {tableLimit}</Typography>
                            </span>
                        </div>
                    </div>
            }
        </div>
        );
    }
}

function mapStateToProps(state){
    return {
        profile : state.profile,
        ln : state.language,
        currency : state.currency
    };
}

export default connect(mapStateToProps)(Actions);
