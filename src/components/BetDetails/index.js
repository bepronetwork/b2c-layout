import React, { Component } from "react";
import { connect } from "react-redux";
import {Typography } from "components";
import { getBet } from "../../lib/api/app";
import CasinoDetails from "./CasinoDetails";
import EsportsDetails from "./EsportsDetails";
import "./index.css";

class BetDetails extends Component {

    
    constructor(props){
        super(props);
        this.state = {
            bet: null,
            isFake: false,
            tag: "casino",
            isLoading: true
        };
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    UNSAFE_componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async ({ betId, tag }) => {
        const { status, message: bet } = await getBet({ betId, tag });

        this.setState({
            tag,
            isFake: !(status === 200),
            isLoading: false,
            bet
        });
    }
    
    render() {
        const { bet, isFake, tag, isLoading } = this.state;

        return (

            isFake
            ?
                <div styleName="restricted">
                    <Typography variant={'body'} color={`casper`}>
                            Restricted data
                    </Typography>
                </div>
            :
                tag == "casino"
                ?
                    <CasinoDetails bet={bet} isLoading={isLoading} />
                : 
                    <EsportsDetails bet={bet} isLoading={isLoading} />

        )
    }
}

function mapStateToProps(state){
    return {
        profile : state.profile,
        ln : state.language
    };
}

export default connect(mapStateToProps)(BetDetails);