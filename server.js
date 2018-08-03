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
  

// app.use((req, res, next) => {
//     if(req.ip != "::ffff:13.251.222.121" && req.ip != "13.251.222.121"){
//         res.status(400).send({msg:"Wrong source IP address"})
//         return;
//     }
//     next();
// })

app.get("/OKM/:toAddress", (req, res) => {
    
    const to_address = req.params.toAddress;

    const w = new WalletProvider(process.env.PRIVKEY.toString(), "https://mainnet.infura.io/QWMgExFuGzhpu2jUr6Pq")
    const web3 = new Web3(w.engine)

    const contract = new web3.eth.Contract(ABI, "0x791FF572C19F711d96CE454F574958B5717FFD15");

    contract.methods.decimals().call().then((decimals) => {
        web3.eth.getGasPrice((err, gasPrice) => {

            web3.eth.getAccounts(async (err, accounts) => {
                if (err) {
                    console.log("errr")
                    throw err;
                }
                try{
                const nonce = await web3.eth.getTransactionCount(accounts[0],'pending');
                const gasLimit = await contract.methods.transfer(to_address.trim(), 200 * Math.pow(10, decimals)).estimateGas({
                    from: accounts[0],
                });
                await contract.methods.transfer(to_address.trim(), 200 * Math.pow(10, decimals)).send({
                    from: accounts[0],
                    gas: gasLimit,
                    gasPrice,
                    nonce
                }).once('transactionHash', function (hash) {
                    console.log("Transferring OKM to", to_address, " TxHash:",hash);
                    res.send({ hash, receiving_address: to_address })
                })
                } catch(e){
                 console.log("error is ", e);
                }
            });
        })
    });

}
)

app.get("/ALC/:toAddress", (req, res) => {
   
    const to_address = req.params.toAddress;

    const w = new WalletProvider(process.env.PRIVKEY.toString(), "https://mainnet.infura.io/QWMgExFuGzhpu2jUr6Pq")
    const web3 = new Web3(w.engine)

    const contract = new web3.eth.Contract(ABI, "0xa5982ff8A26818D6a78A0BC49F080d4A96dD0491");

    contract.methods.decimals().call().then((decimals) => {
        web3.eth.getGasPrice((err, gasPrice) => {

            web3.eth.getAccounts(async (err, accounts) => {
                if (err) {
                    console.log("errr")
                    throw err;
                }
                try{
                const nonce = await web3.eth.getTransactionCount(accounts[0],'pending');
                const gasLimit = await contract.methods.transfer(to_address.trim(), 1000 * Math.pow(10, decimals)).estimateGas({
                    from: accounts[0],
                });
                await contract.methods.transfer(to_address.trim(), 1000 * Math.pow(10, decimals)).send({
                    from: accounts[0],
                    gas: gasLimit,
                    gasPrice,
                    nonce
                }).once('transactionHash', function (hash) {
                    console.log("Transferring ALC to", to_address, " TxHash:",hash);
                    res.send({ hash, receiving_address: to_address })
                })
                } catch(e){
                    console.log("error is ", e);
                }
            });
        })
    });

}
)



const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log("Server is running", PORT);
})