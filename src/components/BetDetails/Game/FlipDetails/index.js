import React, { Component } from "react";
import { connect } from "react-redux";
import Bitcoin from "components/Icons/Bitcoin";
import _ from 'lodash';
import "./index.css";

class FlipDetails extends Component {

    constructor(props){
        super(props);
        this.state = {
            result: null
        };
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {
        const { response } = this.props;

        const result = response.outcomeResultSpace.key;

        this.setState({
            result
        });
    }

    handleAnimation = async () => {
    };

    render() {
        const { result} = this.state;

        return (
            <div styleName="coin">
                <div styleName={result === "Tails" ? "side-tails" : "side-heads"}>
                    <Bitcoin />
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
