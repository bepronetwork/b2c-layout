import React, { Component, createContext } from "react";
import PropTypes from "prop-types";
import languages from "../../config/languages";

const LanguageContext = createContext();

class LanguageProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: languages[0]
    };
    this.setLanguage = this.setLanguage.bind(this);
  }

  setLanguage = language => {
    this.setState({ language });
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
  children: PropTypes.node.isRequired
};

export default LanguageContext;
export { LanguageProvider };
