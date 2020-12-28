    import React, { Component } from "react";
    import { connect } from "react-redux";
    import { isUserSet } from "../../lib/helpers";
    import WithdrawTable from "../WithdrawTable";
    import "./index.css";
 
    class WithdrawTab extends Component {
        render() {
            const { profile, isCurrentPath } = this.props;
            if(!isUserSet(profile)){return}
    
            return (
                <WithdrawTable isCurrentPath={isCurrentPath} />
            );
        }
    }
    
    function mapStateToProps(state){
        return {
            profile: state.profile
        };
    }
    
    export default connect(mapStateToProps)(WithdrawTab);