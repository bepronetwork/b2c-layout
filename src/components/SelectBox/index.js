import React from "react";
import ArrowDown from "components/Icons/ArrowDown";
import ArrowUp from "components/Icons/ArrowUp";
import { Typography, ArrowDownIcon, ArrowUpIcon } from "components";
import { getAppCustomization, getIcon } from "../../lib/helpers";
import "./index.css";

class SelectBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      value: props.value,
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

  UNSAFE_componentWillReceiveProps(props) {
    this.projectData(props);
  }

  handleClickOutside = (event) => {
    const isLabelClick = this.labelRef.contains(event.target);

    if (!isLabelClick) {
      setTimeout(() => {
        this.setState({ open: false });
      }, 1 * 200);
    }
  };

  projectData = (props) => {
    if (props.value) {
      this.setState({ value: props.value });
    }
  };

  handleLabelClick = () => {
    const { open } = this.state;

    this.setState({ open: !open });
  };

  onChange = (option) => {
    this.setState({ value: option, open: false });
    this.props.onChange({ option });
  };

  renderLabel() {
    const { value, open } = this.state;
    const skin = getAppCustomization().skin.skin_type;

    const arrowUpIcon = getIcon(24);
    const arrowDownIcon = getIcon(25);

    return (
      <div styleName="label">
        <span>
          <Typography color="white" variant={"small-body"}>
            {value.text}
          </Typography>
        </span>
        {open ? (
          arrowUpIcon === null ? (
            skin === "digital" ? (
              <ArrowUpIcon />
            ) : (
              <ArrowUp />
            )
          ) : (
            <img src={arrowUpIcon} alt="Arrow Up" />
          )
        ) : arrowDownIcon === null ? (
          skin === "digital" ? (
            <ArrowDownIcon />
          ) : (
            <ArrowDown />
          )
        ) : (
          <img src={arrowDownIcon} alt="Arrow Down" />
        )}
      </div>
    );
  }

  renderOptionsLines = () => {
    const { options } = this.props;
    return options.map((option) => (
      <button
        styleName="option"
        key={option.text}
        id={option.channel_id}
        onClick={() => this.onChange(option)}
        type="button"
      >
        <Typography variant="small-body" color="grey">
          {option.text}
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

  render = () => {
    const {} = this.props;

    return (
      <div styleName="root">
        <button
          ref={(el) => {
            this.labelRef = el;
          }}
          onClick={this.handleLabelClick}
          type="button"
        >
          {this.renderLabel()}
        </button>

        <div
          ref={(el) => {
            this.optionsRef = el;
          }}
        >
          {this.renderOptions()}
        </div>
      </div>
    );
  };
}

export default SelectBox;
