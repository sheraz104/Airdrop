"use strict";

const express = require("express");
const Web3 = require("web3");
const bodyParser = require("body-parser");
const WalletProvider = require('truffle-hdwallet-provider-privkey')


const app = express();

const ABI = require("./ABI").ABI;

app.use(bodyParser.json());

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
  });
  


app.get("/OKM/:toAddress", (req, res) => {
    console.log("1"+req.ip+"1",
       "2"+ req.connection.remoteAddress+"2",
        "3"+req.connection.remotePort+"3"
        );
        if(req.ip == "::ffff:39.37.144.244" || req.ip == "39.37.144.244"){
            res.send({msg:"hello"})
        }
    // const to_address = req.params.toAddress;

    // const w = new WalletProvider(process.env.PRIVKEY.toString(), "https://ropsten.infura.io/QWMgExFuGzhpu2jUr6Pq")
    // const web3 = new Web3(w.engine)

    // const contract = new web3.eth.Contract(ABI, "0x791FF572C19F711d96CE454F574958B5717FFD15");

    // contract.methods.decimals().call().then((decimals) => {
    //     web3.eth.getGasPrice((err, gasPrice) => {
    //         console.log("Gas Price is: ", gasPrice);

    //         web3.eth.getAccounts((err, accounts) => {
    //             if (err) {
    //                 console.log("errr")
    //                 throw err;
    //             }
    //             contract.methods.transfer(to_address.trim(), 200 * Math.pow(10, decimals)).send({
    //                 from: accounts[0],
    //                 gas: '2100000',
    //                 gasPrice
    //             }).once('transactionHash', function (hash) {
    //                 res.send({ hash, receiving_address: to_address })
    //             }).on('error', function(error){ 
    //                 console.log(error);
    //              })
    //         });
    //     })
    // });

}
)


app.get("/ALC/:toAddress", (req, res) => {
    const to_address = req.params.toAddress;

    const w = new WalletProvider(process.env.PRIVKEY.toString(), "https://mainnet.infura.io/QWMgExFuGzhpu2jUr6Pq")
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
                contract.methods.transfer(to_address.trim(), 1000 * Math.pow(10, decimals)).send({
                    from: accounts[0],
                    gas: '2100000',
                    gasPrice
                }).once('transactionHash', function (hash) {
                    res.send({ hash, receiving_address: to_address })
                }).on('error', function(error){ 
                    console.log(error);
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