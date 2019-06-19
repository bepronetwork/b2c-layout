var cookies = require('browser-cookies');

class cache{

    /**
     * @type Authentication
     */
    setToCache = (type, data) => {
        localStorage.setItem(type, JSON.stringify(data), {expires : 365});
    }

    getFromCache = (type) => {
        let result = localStorage.getItem(type);
        return result ? JSON.parse(result) : null;
    }
}

let Cache = new cache();

export default Cache;