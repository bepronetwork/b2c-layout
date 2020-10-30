import React, { Component } from 'react'

import { Typography } from 'components';
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

    switchColor = () => {
        const { secondaryColor } = this.state;
        slideItems.map((num) => {
            switch (num) {
                case num.value  >= 0:
                    return secondaryColor;
                case num.value  >= 2:
                    return "#c7ccd1";
                case num.value  >= 5:
                    return "#2972fa";
                case num.value  >= 10:
                    return "#f59d15";
                case num.value  >= 100:
                    return "#43e900";
                case num.value  >= 1000:
                    return "#63ddbc";
                default:
                  break;
              }
        })
    };

    render() {
        const { primaryColor, secondaryColor } = this.state;
        const { containerAnimation } = this.props;
        return (
            <div styleName="container-init">
                <div styleName="gradient-overlay"></div>
                <div styleName={containerAnimation ? "class-animate container-row" : "container-row"} id="container-slide">
                    {
                    slideItems.map((num) => {
                        return(
                            <div styleName="container-result" key={num.id}>
                                <EmptyDiamond
                                    backgroundColor={primaryColor}
                                    borderColor={secondaryColor}
                                    height="30%"
                                    width="100%"
                                    value={num.value}
                                >
                                <Typography variant={'small-body'} color={'white'}>{num.value}</Typography>
                                </EmptyDiamond>
                                <div styleName="bottom-base" style={{backgroundColor: this.switchColor()}}></div>
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
