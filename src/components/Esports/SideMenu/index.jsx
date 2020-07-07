import React, { Component } from "react";
import { Tabs } from 'components';
import { OddsTable, TeamsTable, Chat } from 'components/Esports';
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
               {/*<div styleName="live">
                    <Typography variant={'x-small-body'} color={'white'}>Live Strumming will be available</Typography>
                    <div styleName="cam">
                        <LiveIcon/>
                    </div>
                </div>*/}
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
                                label: "Bets",
                                disabled: match.status == "finished" || match.status == "settled"
                            },
                            {
                                value: "chat",
                                label: "Chat",
                                disabled: match.live_embed_url == null
                            }
                        ]}
                        onSelect={this.handleTabChange}
                    />
                    <div styleName="main">
                        { tab === "stats" ? <TeamsTable match={match} /> : null }
                        { tab === "bets" ? <OddsTable match={match} /> : null }
                        { tab === "chat" ? <Chat streaming={match.live_embed_url} /> : null }
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