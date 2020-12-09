import React, { Component } from "react";
import { connect } from "react-redux";
import { Slider } from "components";
import "./index.css";

class DiceDetails extends Component {

    constructor(props){
        super(props);
        this.state = {
            value: 0,
            result: null
        };
    }

    componentDidMount(){
        this.projectData();
    }

    componentWillReceiveProps(){
        this.projectData();
    }

    projectData = async () => {
        const { bet } = this.props;

        const value = bet.result.length;
        const result = bet.outcomeResultSpace.key;

        this.setState({
            value
        });

        setTimeout(() => {
            this.setState({
                result
            });
        }, 300);

    }
    
    render() {
        const { value, result} = this.state;
        return (
            <Slider
                roll={"under"}
                value={value}
                result={result}
                disableControls={true}
                animating={true}
                isBetDetails={true}
            />
        );
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile,
        ln : state.language
    };
}

export default connect(mapStateToProps)(DiceDetails);
