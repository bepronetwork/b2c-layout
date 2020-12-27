import React, { Component } from "react";
import { dateToHourAndMinute, formatToBeautyDate } from "../../../lib/helpers";
import Countdown from "react-countdown";
import { Typography, Button, LiveIcon } from "components";
import classNames from "classnames";
import "./index.css";
import moment from "moment";

export default class Status extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      status: null,
      hasLiveTransmition: false,
      isMobile: false,
    };
  }

  componentDidMount() {
    this.projectData(this.props);
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.projectData(props);
  }

  projectData = async (props) => {
    const { hasLiveTransmition, status, date, isMobile } = props;

    this.setState({
      date,
      status,
      hasLiveTransmition,
      isMobile,
    });
  };

  renderPreMatch() {
    const { date } = this.state;

    const renderer = ({ total }) => {
      return (
        <Typography color={"grey"} variant={"x-small-body"}>
          {dateToHourAndMinute(moment().add(total, "milliseconds"))}
        </Typography>
      );
    };

    return (
      <div styleName="match-schedule">
        <span>
          <Countdown date={date} renderer={renderer} />
        </span>
        <span>
          <Typography color={"grey"} variant={"x-small-body"}>
            {formatToBeautyDate(date)}
          </Typography>
        </span>
      </div>
    );
  }

  renderLive() {
    const { hasLiveTransmition } = this.state;

    return (
      <div styleName="transmition">
        {hasLiveTransmition === true ? <LiveIcon /> : null}
        <Button size={"x-small"} theme="primary">
          <Typography color={"fixedwhite"} variant={"x-small-body"}>
            Live
          </Typography>
        </Button>
      </div>
    );
  }

  render() {
    const { status, isMobile } = this.state;

    const styles = classNames("live", {
      "live-desktop": isMobile !== true,
      "live-mobile": isMobile === true,
    });

    return (
      <div styleName={styles}>
        {status === "pre_match" ? this.renderPreMatch() : null}
        {status === "live" ? this.renderLive() : null}
      </div>
    );
  }
}
