var cookies = require('browser-cookies');

class cache{

    /**
     * @type Authentication
     */
    setToCache = (type, data) => {
        try{
            localStorage.setItem(type, JSON.stringify(data), {expires : 365});
        }catch(err){
            console.log(err)
        }
    }

    getFromCache = (type) => {
        let result = localStorage.getItem(type);
        return result ? JSON.parse(result) : null;
    }
}

let Cache = new cache();

export default Cache;