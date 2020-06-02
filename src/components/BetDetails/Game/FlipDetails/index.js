import React, { Component } from "react";
import { connect } from "react-redux";
import Bitcoin from "components/Icons/Bitcoin";
import { Typography } from "components";
import _ from 'lodash';
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
                <div styleName={result === "Tails" ? "side-tails" : "side-heads"}>
                    <Bitcoin />
                </div>
                <div>
                    <Typography variant="h3" color="white">
                        {isWon === true ? "You won" : "You Lost"}
                    </Typography>
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
