import React, { Component } from "react";
import { Typography, InfoIcon } from "components";

import "./index.css";

export default class Inffo extends Component {

  constructor(props){
    super(props);
    this.state = {
      open: false
    }
  }

  onInfoClick = () => {
    const { open } = this.state;
    console.log(open)
    this.setState({ open : !open });
  };


  render() {
    const { text } = this.props;
    const { open } = this.state;

    return (
      <div>
        {
          open == true
          ?
            [<span styleName="triangle"></span>, <div styleName="window"><Typography variant={'x-small-body'} color={'white'}>{text}</Typography></div>]
          :
            null
        }
        <span styleName="info" onClick={() => this.onInfoClick()}>
            <InfoIcon/>
        </span>
      </div>
    );
  }
}
