import React, { Component } from 'react';
import { connect } from "react-redux";
import { Typography } from 'components';
import Timer from "assets/icons/timer.svg";
import "./index.css";

class CurrencyFreeMoney extends Component {

  render() {
    const { hours, seconds, minutes, title } = this.props;

    return (
      <div styleName="container-root">
        <div styleName="text-align">
          <Typography variant="small-body" color="white" weight="bold">
            {title}
          </Typography>
        </div>
        <div styleName="container-button-timer">
          <div styleName="row-container">
            <div styleName="container-image">
              <img src={Timer} styleName="payment-image" alt="Timer" />
            </div>
            { minutes === 0 && seconds === 0
              ?
              <div styleName="digital-text">
                00:00
              </div>
              :
              hours === 0 ?
              <div styleName="digital-text">
                {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
              </div>
              :
              <div styleName="digital-text">
                {hours < 10 ? `0${hours}` : hours}:{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
              </div>
            }
          </div>
          <div styleName="text-bottom-container">
            <Typography variant={'x-small-body'} color={'fixedwhite'}>
              To the next replenish
            </Typography>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
      profile : state.profile,
      ln : state.language
  };
}

export default connect(mapStateToProps)(CurrencyFreeMoney);
