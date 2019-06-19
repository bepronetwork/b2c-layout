const WEI = 1000000000;
const GAS_PRICE = 10 * WEI;

class account {
  constructor(web3, web3Account) {
    this.web3 = web3;
    this.account = web3Account;
  }

  async getBalance() {
    const wei = await this.web3.eth.getBalance(this.getAddress());

    return this.web3.utils.fromWei(wei, "ether");
  }

  getAddress() {
    return this.account.address;
  }

  getPrivateKey() {
    return this.account.privateKey;
  }

  getAccount() {
    return this.account;
  }

  async sendEther(amount, address, data = null) {
    const tx = {
      data,
      from: this.getAddress(),
      to: address,
      gas: 21000,
      gasPrice: GAS_PRICE,
      value: this.web3.utils.toWei(amount.toString(), "ether")
    };
    const result = await this.account.signTransaction(tx);
    const transaction = await this.web3.eth.sendSignedTransaction(
      result.rawTransaction
    );

    return transaction;
  }
}

export default account;
