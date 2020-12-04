import React, { Component } from "react";
import { connect } from "react-redux";
import Bitcoin from "components/Icons/Bitcoin";
import { Typography } from "components";
import "./index.css";

class FlipDetails extends Component {

    constructor(props){
        super(props);
        this.state = {
            result: null,
            isWon: false
        };
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        const { bet } = this.props;

        const result = bet.outcomeResultSpace.key;
        const isWon = bet.isWon;

        this.setState({
            result,
            isWon
        });
    }

    render() {
        const { result, isWon } = this.state;

        return (
            <div styleName="coin">
                <div>
                    <Typography variant="small-body" color="white">
                        Your bet
                    </Typography>
                    <div styleName={isWon === true ? "side-"+result.toLowerCase() : result === "Head" ? "side-tails" : "side-head"}>
                        <Bitcoin />
                    </div>
                </div>
                <div>
                    <Typography variant="small-body" color="white">
                        {isWon === true ? "You won" : "You Lost"}
                    </Typography>
                    <div styleName={result === "Tails" ? "side-tails" : "side-head"}>
                        <Bitcoin />
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile,
        ln : state.language
    };
}

export default connect(mapStateToProps)(FlipDetails);
