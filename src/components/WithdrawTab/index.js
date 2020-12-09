    import React, { Component } from "react";
    import { connect } from "react-redux";
    import { isUserSet } from "../../lib/helpers";
    import WithdrawTable from "../WithdrawTable";
    import "./index.css";
 
    class WithdrawTab extends Component {
    
        constructor(props){
            super(props);
        }
    
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
            profile: state.profile,
            ln : state.language
        };
    }
    
    export default connect(mapStateToProps)(WithdrawTab);