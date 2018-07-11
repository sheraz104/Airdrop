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

    const w = new WalletProvider(Config.privKey.trim(), "https://mainnet.infura.io/QWMgExFuGzhpu2jUr6Pq")
    const web3 = new Web3(w.engine)

    const contract = new web3.eth.Contract(ABI, "0x791ff572c19f711d96ce454f574958b5717ffd15");

    contract.methods.decimals().call().then((decimals) => {
        web3.eth.getGasPrice((err, gasPrice) => {
            console.log("Gas Price is: ", gasPrice);

            web3.eth.getAccounts((err, accounts) => {
                if (err) {
                    console.log("errr")
                    throw err;
                }
                contract.methods.transfer(to_address.trim(), 100 * Math.pow(10, decimals)).send({
                    from: accounts[0],
                    gas: '2100000',
                    gasPrice
                }).once('transactionHash', function (hash) {
                    res.send({ hash, receiving_address: to_address })
                })
            });
        })
    });

}
)


app.get("/ALC/:toAddress", (req, res) => {
    const to_address = req.params.toAddress;

    const w = new WalletProvider(Config.privKey.trim(), "https://mainnet.infura.io/QWMgExFuGzhpu2jUr6Pq")
    const web3 = new Web3(w.engine)

    const contract = new web3.eth.Contract(ABI, "0xa5982ff8A26818D6a78A0BC49F080d4A96dD0491");

    contract.methods.decimals().call().then((decimals) => {
        web3.eth.getGasPrice((err, gasPrice) => {
            console.log("Gas Price is: ", gasPrice);

            web3.eth.getAccounts((err, accounts) => {
                if (err) {
                    console.log("errr")
                    throw err;
                }
                contract.methods.transfer(to_address.trim(), 100 * Math.pow(10, decimals)).send({
                    from: accounts[0],
                    gas: '2100000',
                    gasPrice
                }).once('transactionHash', function (hash) {
                    res.send({ hash, receiving_address: to_address })
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