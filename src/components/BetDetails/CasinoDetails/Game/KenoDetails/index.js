import React, { Component } from "react";
import KenoBoard from "../../../../KenoBoard";
import defaultCards from "../../../../../containers/KenoPage/defaultCards";
import "./index.css";

class KenoDetails extends Component {

    constructor(props){
        super(props);
        this.state = {
            cards: defaultCards
        };
    }

    componentDidMount(){
        this.projectData();
    }

    UNSAFE_componentWillReceiveProps(){
        this.projectData();
    }

    projectData = async () => {
        const { bet } = this.props;
        const { cards } = this.state;

        cards.forEach( (c) => { c.isSelected = false });
        cards.forEach( (c) => { c.isPicked = false });

        bet.outcomeResultSpace.map( r => {
            cards.find( c => {
                if (c.id === r.index) { c.isSelected = true };

                return null;
            });

            return null;
        });

        bet.result.map( r => {
            cards.find( c => {
                if (c.id === parseInt(r._id.place)) { c.isPicked = true };

                return null;
            });

            return null;
        });

        this.setState({ cards });
    }
    
    render() {
        const { cards} = this.state;
        return (
            <KenoBoard cards={cards} isDetailsPage={true}/>
        );
    }
}

export default KenoDetails;
