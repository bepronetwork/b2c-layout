var cookies = require("browser-cookies");

class cache {
  /**
   * @type Authentication
   */
  setToCache = (type, data) => {
    try {
      localStorage.setItem(type, JSON.stringify(data), { expires: 365 });
    } catch (err) {
      console.log(err);
    }
  };

  getFromCache = type => {
    let result = localStorage.getItem(type);
    return result ? JSON.parse(result) : null;
  };

  handleCustomizationToggleBinary = ({ objectName, key }) => {
    let customization = this.getFromCache(objectName);

    if (!customization) {
      customization = {};
    }
    let isSet = customization[key];
    customization = { ...customization, [key]: isSet ? false : true };

    this.setToCache(objectName, customization);
  };
}

let Cache = new cache();

export default Cache;
