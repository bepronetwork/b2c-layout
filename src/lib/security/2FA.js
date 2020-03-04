var twoFactor = require('node-2fa');

class Security2FA {

    generateSecret2FA({name, account_id}){
        try{
            return twoFactor.generateSecret({name, account: account_id});
        }catch(error){
            throw error;
        }
    }

    isVerifiedToken2FA({secret, token}){
        try{
            let response = twoFactor.verifyToken(secret, token);
            if(!response){ return false};
            return(response.delta == 0);
        }catch(error){
            throw error;
        }
    }
}

let Security2FASingleton = new Security2FA();

export default Security2FASingleton;