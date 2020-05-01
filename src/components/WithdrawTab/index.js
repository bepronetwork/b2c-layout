
    import React, { Component } from "react";
    import { connect } from "react-redux";
    import { isUserSet } from "../../lib/helpers";
    import WithdrawTable from "../WithdrawTable";
    import _ from 'lodash';
    import "./index.css";
    
    class WithdrawTab extends Component {
    
        constructor(props){
            super(props);
            this.state = {};
        }
    
        componentDidMount(){
            this.projectData(this.props);
        }
    
        componentWillReceiveProps(props){
            this.projectData(props);
        }
    
        projectData = async (props) => {
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