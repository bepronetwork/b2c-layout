import React, { Component } from "react";
import PropTypes from "prop-types";
import ArrowDown from "components/Icons/ArrowDown";
import ArrowUp from "components/Icons/ArrowUp";
import { Typography, UserIcon, LogoutIcon, CashierIcon } from "components";
import { map } from "lodash";
import { CopyText } from "../../copy";
import { connect } from "react-redux";
import "./index.css";

class ProfileMenu extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    onLogout: PropTypes.func.isRequired,
    onCashier: PropTypes.func.isRequired
  };

  state = {
    open: false
  };

  componentDidUpdate() {
    const { open } = this.state;

    if (open) {
      document.addEventListener("mousedown", this.handleClickOutside);
    } else {
      document.removeEventListener("mousedown", this.handleClickOutside);
    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  getOptions = () => {
    const { onLogout, onCashier, onAccount } = this.props;
    const { ln } = this.props;
    const copy = CopyText.userMenuIndex[ln];

    return [
      {
        value: "cashier",
        label: copy.INDEX.TYPOGRAPHY.TEXT[0],
        icon: <CashierIcon />,
        action: onCashier
      },
      {
        value: "account",
        label: copy.INDEX.TYPOGRAPHY.TEXT[1],
        icon: <UserIcon />,
        action: onAccount
      },
      {
        value: "logout",
        label: copy.INDEX.TYPOGRAPHY.TEXT[2],
        icon: <LogoutIcon />,
        action: onLogout
      }
    ];
  };

  handleClickOutside = event => {
    const isOutsideClick = !this.optionsRef.contains(event.target);
    const isLabelClick = this.labelRef.contains(event.target);

    if (isOutsideClick && !isLabelClick) {
      this.setState({ open: false });
    }
  };

  handleLabelClick = () => {
    const { open } = this.state;

    this.setState({ open: !open });
  };

  renderLabel() {
    const { open } = this.state;
    const { username } = this.props;

    return (
      <div styleName="label">
        <div styleName="user-icon">
          <UserIcon />
        </div>
        <span>
          <Typography color="white" variant={"x-small-body"}>
            {username}
          </Typography>
        </span>
        {open ? <ArrowUp /> : <ArrowDown />}
      </div>
    );
  }

  onDoAction = async onAction => {
    this.setState({ open: false });
    onAction();
  };

  renderOptionsLines = () => {
    return map(this.getOptions(), ({ value, label, icon, action }) => (
      <button
        styleName="option"
        key={value}
        id={value}
        onClick={() => this.onDoAction(action)}
        type="button"
      >
        <div styleName="user-icon">{icon}</div>
        <Typography variant="x-small-body" color="casper">
          {label}
        </Typography>
      </button>
    ));
  };

  renderOptions() {
    const { open } = this.state;

    if (!open) return null;

    return (
      <div styleName="options">
        <span styleName="triangle" />
        {this.renderOptionsLines()}
      </div>
    );
  }

  render() {
    return (
      <div styleName="root">
        <button
          ref={el => {
            this.labelRef = el;
          }}
          onClick={this.handleLabelClick}
          type="button"
        >
          {this.renderLabel()}
        </button>

        <div
          ref={el => {
            this.optionsRef = el;
          }}
        >
          {this.renderOptions()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
    ln: state.language
  };
}

export default connect(mapStateToProps)(ProfileMenu);
