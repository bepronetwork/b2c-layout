import React, { Component } from 'react'
import PropTypes from "prop-types";

import './index.css';

export default class AnnouncementTab extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    announcementText: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    textColor: PropTypes.string.isRequired
  };
  render() {
    const style = {
      background: this.props.backgroundColor,
      color: this.props.textColor
    }
    return (
      this.props.active?
        <div styleName='container' style={style}>
          <h3 styleName='announcement-text' >{this.props.announcementText}</h3>
        </div>
        :
        <div />
    )
  }
}
