"use strict";

const express = require("express");
const Web3 = require("web3");
const bodyParser = require("body-parser");
const WalletProvider = require('truffle-hdwallet-provider-privkey')


const app = express();

const ABI = require("./ABI").ABI;
const Config = require("./Config");

app.use(bodyParser.json());

app.get("/OKM/:toAddress", (req, res) => {
    const to_address = req.params.toAddress;

    const w = new WalletProvider(Config.privKey.trim(), "https://ropsten.infura.io/QWMgExFuGzhpu2jUr6Pq")
    const web3 = new Web3(w.engine)

    const contract = new web3.eth.Contract(ABI,"0x41891953f0fc6f75b501fedd916bc9bc0fb7c235");

    contract.methods.decimals().call().then((decimals) => {
        web3.eth.getGasPrice( (err, gasPrice) => {
            console.log("Gas Price is: ", gasPrice);
    
            web3.eth.getAccounts( (err, accounts) => {
                if (err) {
                    console.log("errr")
                    throw err;
                }
                contract.methods.transfer(to_address.trim(), 100 * Math.pow(10, decimals)).send({
                    from: accounts[0],
                    gas: '2100000',
                    gasPrice
                }).once('transactionHash', function(hash){ 
                    res.send({hash, receiving_address:to_address})
                 })
            });
        })
    });

  




}
)

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log("Server is running", PORT);
})