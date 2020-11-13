import React, { Component } from "react";
import { Typography, ArrowDownIcon, ArrowUpIcon } from "components";
import ArrowDown from "components/Icons/ArrowDown";
import ArrowUp from "components/Icons/ArrowUp";
import _ from "lodash";
import { connect } from "react-redux";
import classNames from "classnames";
import { setLanguageInfo } from "../../redux/actions/language";
import { isUserSet, getAppCustomization, getIcon } from "../../lib/helpers";
import "./index.css";
import { LanguageContext } from "../../containers/App/LanguageContext";

class LanguageSelector extends Component {
  static contextType = LanguageContext;

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      languages: []
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

  projectData = async () => {
    let { languages } = getAppCustomization();

    languages = languages.filter(({ isActivated }) => isActivated);

    this.setState({ languages });
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

  changeLanguage = async item => {
    const { profile, dispatch } = this.props;
    const { setLanguage } = this.context;
    const { languages, open } = this.state;

    item = languages.find(language => {
      if (language.name.toLowerCase() === item.name.toLowerCase()) {
        return language;
      }
    });

    if (isUserSet(profile)) {
      profile.getChat().changeLanguage({
        language: item.name,
        channel_id: item.name.toLowerCase()
      });
    }

    setLanguage(item);
    await dispatch(setLanguageInfo(item));
    this.setState({ open: !open });
  };

  onDoAction = async (onChange, option) => {
    this.setState({ open: false });

    if (onChange) {
      onChange(option);
    } else {
      this.changeLanguage(option);
    }
  };

  renderOptionsLines = () => {
    const { onChange, size, color } = this.props;
    const { languages } = this.state;

    return languages.map(option => (
      <button
        styleName="option"
        key={option.name}
        id={option.channel_id}
        onClick={() => this.onDoAction(onChange, option)}
        type="button"
      >
        <img src={option.logo} alt="Language Country Flag" />
        <Typography variant={size || "small-body"} color={color || "white"}>
          {option.name}
        </Typography>
      </button>
    ));
  };

  renderOptions() {
    const { open } = this.state;
    const { expand } = this.props;

    if (!open) return null;

    const optionsStyles = classNames("options", {
      expandBottom: expand === "bottom"
    });

    const triangleStyles = classNames("triangle", {
      triangleBottom: expand === "bottom"
    });

    return (
      <div styleName={optionsStyles}>
        <span styleName={triangleStyles} />
        {this.renderOptionsLines()}
      </div>
    );
  }

  render() {
    const { open } = this.state;
    const { language } = this.context;
    const { showArrow, size, color } = this.props;
    const skin = getAppCustomization().skin.skin_type;
    const arrowUpIcon = getIcon(24);
    const arrowDownIcon = getIcon(25);
    const styles = classNames("item", {
      itemHor: showArrow
    });

    if (_.isEmpty(language)) {
      return null;
    }

    return (
      <div styleName="root" key="LanguageSelectorComponent">
        <button
          ref={el => {
            this.labelRef = el;
          }}
          onClick={this.handleLabelClick}
          type="button"
        >
          <span styleName={styles}>
            <img src={language.logo} alt="Language Country Flag" />
            <Typography variant={size || "small-body"} color={color || "grey"}>
              {language.name}
            </Typography>
            {showArrow === true ? (
              open ? (
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
              )
            ) : null}
          </span>
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

export default connect(mapStateToProps)(LanguageSelector);
