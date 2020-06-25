import React, { Component } from "react";
import { Typography, Tabs, LiveIcon } from 'components';
import { Stats, BetsTable, Players } from 'components/Esports';
import { connect } from 'react-redux';
import _ from 'lodash';
import "./index.css";


class SideMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tab: "stats"
        };
    }

    handleTabChange = name => {
        this.setState({ tab: name });
    };

    componentDidMount() {
    }


    render() {
        const { match } = this.props;
        const { tab } = this.state;

        return (
            <div>
               <div styleName="live">
                    <Typography variant={'x-small-body'} color={'white'}>Live Strumming will be available</Typography>
                    <div styleName="cam">
                        <LiveIcon/>
                    </div>
                </div>
                <div styleName="side-menu">
                    <Tabs
                        selected={tab}
                        options={[
                            {   
                                value: "stats", 
                                label: "Stats"
                            },
                            {
                                value: "bets",
                                label: "Bets"
                            }
                        ]}
                        onSelect={this.handleTabChange}
                    />
                    <div styleName="main">
                        {tab === "stats" 
                            ? 
                                <div>
                                    <Stats match={match} /> 
                                    <Players match={match} />
                                </div>
                            : 
                                <BetsTable match={match} />
                        }
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        profile : state.profile,
        ln: state.language
    };
}

export default connect(mapStateToProps)(SideMenu);