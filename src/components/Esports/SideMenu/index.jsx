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
            tab: "stats",
            showStats: true
        };
    }

    handleTabChange = name => {
        this.setState({ tab: name });
    };

    handleShowStats(value) {
        this.setState({ showStats: value, tab: value === false ? "bets" : "stats" });
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
    }

    getOptions() {
        const { match } = this.props;
        const { showStats } = this.state;

        let options = [];

        if(showStats === true) {
            options.push({   
                value: "stats", 
                label: "Stats",
            });
        }

        options.push({
            value: "bets",
            label: "Bets",
            disabled: match.status == "finished" || match.status == "settled"
        });

        options.push({
            value: "chat",
            label: "Chat",
            disabled: match.live_embed_url == null
        });

        return options;
    }
 

    render() {
        const { match, onPlayerClick } = this.props;
        const { tab, showStats } = this.state;

        return (
            <div>
                <div styleName="side-menu">
                    <Tabs
                        selected={tab}
                        options={this.getOptions()}
                        onSelect={this.handleTabChange}
                    />
                    <div styleName="main">
                        { tab === "stats" && showStats === true ? <TeamsTable match={match} onPlayerClick={onPlayerClick} onShowStats={this.handleShowStats.bind(this)} /> : null }
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