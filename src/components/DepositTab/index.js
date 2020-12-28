import React, { Component } from "react";
import { connect } from "react-redux";
import { isUserSet } from "../../lib/helpers";
import DepositTable from "../DepositTable";
import "./index.css";

class DepositTab extends Component {
    render() {
        const { profile, isCurrentPath } = this.props;
        if(!isUserSet(profile)){return}

        return (
            <DepositTable isCurrentPath={isCurrentPath} />
        );
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile
    };
}

export default connect(mapStateToProps)(DepositTab);
