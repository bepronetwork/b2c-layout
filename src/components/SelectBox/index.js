import React from "react";
import ArrowDown from "components/Icons/ArrowDown";
import ArrowUp from "components/Icons/ArrowUp";
import { Typography, ArrowDownIcon, ArrowUpIcon } from "components";
import _ from "lodash";
import classNames from "classnames";
import { getAppCustomization, getIcon } from "../../lib/helpers";
import "./index.css";

class SelectBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      value: props.value
    };
  }

  componentDidMount() {
    this.projectData(this.props);
  }

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

  componentWillReceiveProps(props) {
    this.projectData(props);
  }

  handleClickOutside = event => {
    const isOutsideClick = !this.optionsRef.contains(event.target);
    const isLabelClick = this.labelRef.contains(event.target);

    if (!isLabelClick) {
      setTimeout(() => {
        this.setState({ open: false });
      }, 1 * 200);
    }
  };

  projectData = props => {
    if (props.value) {
      this.setState({ ...this.state, value: props.value });
    }
  };

  handleClick = () => {
    const { open } = this.state;

    this.setState({ open: !open });
  };

  onChange = option => {
    const { onChange } = this.props;

    this.setState({ ...this.state, value: option, open: false });

    onChange({ option });
  };

  renderLabel() {
    const { value, open } = this.state;
    const skin = getAppCustomization().skin.skin_type;
    const arrowUpIcon = getIcon(24);
    const arrowDownIcon = getIcon(25);

    return (
      <div styleName="label">
        {value.text}
        {open ? (
          arrowUpIcon === null ? (
            skin == "digital" ? (
              <ArrowUpIcon />
            ) : (
              <ArrowUp />
            )
          ) : (
            <img src={arrowUpIcon} />
          )
        ) : arrowDownIcon === null ? (
          skin == "digital" ? (
            <ArrowDownIcon />
          ) : (
            <ArrowDown />
          )
        ) : (
          <img src={arrowDownIcon} />
        )}
      </div>
    );
  }

  render() {
    const { open } = this.state;
    const { options, gutterBottom, name } = this.props;

    return (
      <div
        styleName={classNames("root", { gutterBottom: gutterBottom })}
        onClick={this.handleClick}
      >
        <button
          ref={el => {
            this.labelRef = el;
          }}
          type="button"
        >
          {this.renderLabel()}
        </button>
        {open && (
          <div styleName="options">
            <span styleName="triangle" />
            <div
              ref={el => {
                this.optionsRef = el;
              }}
              style={{
                maxHeight: 192,
                overflow: "auto"
              }}
            >
              {options.map(option => (
                <button
                  styleName="option"
                  key={option.channel_id}
                  id={option.channel_id}
                  onClick={() => this.onChange(option)}
                  type="button"
                  name={name}
                >
                  <Typography variant="small-body" color="grey">
                    {option.text}
                  </Typography>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default SelectBox;
