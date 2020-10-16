import React, { Component } from 'react'

import CenterIndicator from "../../assets/icons/slideIcons/center-indicator.svg";
import { getAppCustomization } from "../../lib/helpers";
import EmptyDiamond from "../../assets/icons/slideIcons/empty";
import './index.css';
import slideItems from "./slideItems";
export default class SliderGame extends Component {

    state = {
        primaryColor: "",
        secondaryColor: ""
    }

    componentDidMount(){
        this.getColors();
    }

    getColors = () => {
        const { colors } = getAppCustomization();
    
        const primaryColor = colors.find(color => {
          return color.type === "primaryColor";
        });
    
        const secondaryColor = colors.find(color => {
          return color.type === "secondaryColor";
        });
    
        this.setState({
          primaryColor: primaryColor.hex,
          secondaryColor: secondaryColor.hex
        });
      };

    render() {
        const { primaryColor, secondaryColor } = this.state;
        return (
            <div styleName="container-init">
                <div styleName="gradient-overlay"></div>
                <div styleName="container-row" id="container-slide">
                    {
                    slideItems.map((num) => {
                        return(
                            <div styleName="container-result" key={num}>
                                <EmptyDiamond
                                    backgroundColor={primaryColor}
                                    borderColor={secondaryColor}
                                    height="30%"
                                    width="100%"
                                >
                                    12540x
                                </EmptyDiamond>
                                <div styleName="bottom-base"></div>
                            </div>
                        );
                    })
                    }
                </div>
                <img src={CenterIndicator} alt="" styleName="indicator"/>
            </div>
        )
    }
}
