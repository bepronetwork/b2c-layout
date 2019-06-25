import React, { Component } from "react";
import coins from 'assets/coins.png';

import "./index.css";

export default class CoinFlip extends Component {
    render() {return ( <img src={coins} styleName={'coinflip-icon'}/>);}
}
