import { getTransactionOptions } from "../lib/Ethereum";

class contract{

    constructor(params){
        this.web3 = params.web3;
        this.abi = params.contract.abi;
        this.address = params.address;
        this.json = params.contract;
        this.contract = new params.web3.eth.Contract(params.contract.abi, params.address)
    }

    async deploy(account, abi, byteCode, args=[]){
        this.contract = new this.web3.eth.Contract(abi);

            let balance = await this.web3.eth.getBalance(account.address);
        let data = this.contract.deploy({
            data : byteCode,
            arguments: args
        }).encodeABI();

            let tx = {
            data : data,
            from  : account.address,
            gas : 5913388
        }

            let result = await account.signTransaction(tx);
        let transaction = await this.web3.eth.sendSignedTransaction(result.rawTransaction);
        //fs.writeFile('Deployed.json', JSON.stringify(transaction), 'utf8', () => {});
        this.address = transaction.contractAddress;
        return transaction;
   }

    async use(contract_json, address){
       this.json = contract_json;      
       this.abi = contract_json.abi;
       this.address = address ? address : this.address;
       this.contract = new this.web3.eth.Contract(contract_json.abi, this.address)
   } 

    async send(account, byteCode, value='0x0'){
        let opt = await getTransactionOptions('fast')
        let tx = {
            data : byteCode,
            from  : account.address,
            to : this.address,
            gasPrice : opt.gasPrice,
            gas : 4000000,
            value: value ? value : '0x0'
        }

        let result = await account.signTransaction(tx);
       let transaction = await window.web3.eth.sendSignedTransaction(result.rawTransaction);
       return transaction;
   }

    getContract(){
       return this.contract;
   }

    getABI(){
       return this.abi;
   }

    getJSON(){
       return this.json;
   }

    getAddress(){
       return this.address;
   }
}


export default contract;