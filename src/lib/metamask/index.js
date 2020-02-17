
const NONCE_MIN = 1346;
const NONCE_MAX = 45374598679192; 

function addressConcat(string=''){
    return  `${string.substring(0, 6)}...${string.substring(string.length - 2)}`;
}

function getNonce() {
  return Math.floor(Math.random() * (NONCE_MAX - NONCE_MIN + 1)) + NONCE_MIN;
}


export { getNonce, addressConcat };
