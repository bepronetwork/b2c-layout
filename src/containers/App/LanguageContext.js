import React, { Component, createContext } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { isNull, isUndefined } from "lodash";
import languages, { LANGUAGE_KEY } from "../../config/languages";
import Cache from "../../lib/cache/cache";
import { setLanguageInfo } from "../../redux/actions/language";

const LanguageContext = createContext();

class LanguageProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: {}
    };
    this.setLanguage = this.setLanguage.bind(this);
    this.storedLanguage = Cache.getFromCache(LANGUAGE_KEY);
    this.defaultLanguage = languages.find(({ prefix }) => prefix === "EN");
  }

  componentDidMount() {
    const { storedLanguage, defaultLanguage, setLanguage } = this;

    if (isUndefined(storedLanguage)) {
      localStorage.removeItem(LANGUAGE_KEY);
    }

    if (isNull(storedLanguage)) {
      setLanguage(defaultLanguage, false);
    } else {
      setLanguage(storedLanguage, false);
    }
  }

  setLanguage = async (language, store) => {
    const { dispatch } = this.props;

    this.setState({ language });
    await dispatch(setLanguageInfo(language));

    if (store) {
      Cache.setToCache(LANGUAGE_KEY, language);
    }
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

LanguageProvider.displayName = "Language.Context";
LanguageContext.displayName = "Language";

export { LanguageContext };
export default connect()(LanguageProvider);
