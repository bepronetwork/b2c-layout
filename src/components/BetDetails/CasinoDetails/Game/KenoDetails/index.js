import React, { Component } from "react";
import { connect } from "react-redux";
import KenoBoard from "../../../../KenoBoard";
import defaultCards from "../../../../../containers/KenoPage/defaultCards";
import "./index.css";

class KenoDetails extends Component {

    constructor(props){
        super(props);
        this.state = {
            selected: [],
            result: [],
            cards: defaultCards
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
        const { cards } = this.state;

        cards.forEach( (c) => { c.isSelected = false });
        cards.forEach( (c) => { c.isPicked = false });

        bet.outcomeResultSpace.map( r => {
            cards.find( c => {
                if (c.id === r.index) { c.isSelected = true };
            });
        });

        bet.result.map( r => {
            cards.find( c => {
                if (c.id === parseInt(r._id.place)) { c.isPicked = true };
            });
        });

        this.setState({
            cards
        });
    }
    
    render() {
        const { cards} = this.state;
        return (
            <KenoBoard cards={cards} isDetailsPage={true}/>
        );
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile,
        ln : state.language
    };
}

export default connect(mapStateToProps)(KenoDetails);
