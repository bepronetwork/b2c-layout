import React, { Component, createContext } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { isNull } from "lodash";
import languages from "../../config/languages";
import Cache from "../../lib/cache/cache";
import { setLanguageInfo } from "../../redux/actions/language";

const LanguageContext = createContext();

class LanguageProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: languages[0]
    };
    this.setLanguage = this.setLanguage.bind(this);
    this.initialState = this.state;
  }

  componentDidMount = async () => {
    const language = Cache.getFromCache("language");
    const setLanguageBasedOnCache = isNull
      ? this.initialState.language
      : language;
    const { dispatch } = this.props;

    this.setState(setLanguageBasedOnCache);
    await dispatch(setLanguageInfo(setLanguageBasedOnCache));
  };

  setLanguage = language => {
    this.setState({ language });
    Cache.setToCache("language", language);
  };

  render() {
    const { children } = this.props;
    const { language } = this.state;
    const { setLanguage } = this;

    return (
      <LanguageContext.Provider value={{ language, setLanguage }}>
        {children}
      </LanguageContext.Provider>
    );
  }
}

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps({ language }) {
  return {
    ln: language
  };
}

export { LanguageContext };
export default connect(mapStateToProps)(LanguageProvider);
