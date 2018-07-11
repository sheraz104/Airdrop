const express = require("express");
const Web3 = require("web3");
const bodyParser = require("body-parser");
const WalletProvider = require('truffle-hdwallet-provider-privkey')


const app = express();

const ABI = require("./ABI").ABI;
const Config = require("./Config");

app.use(bodyParser.json());

app.post("/OKM", async (req, res) => {
    const to_address = req.body.toAddress;

    const w = new WalletProvider(Config.privKey.trim(), "https://ropsten.infura.io/QWMgExFuGzhpu2jUr6Pq")
    const web3 = new Web3(w.engine)

    const contract = new web3.eth.Contract(ABI,"0x41891953f0fc6f75b501fedd916bc9bc0fb7c235");

    const decimals = await contract.methods.decimals().call();

    web3.eth.getGasPrice(async (err, gasPrice) => {
        console.log("Gas Price is: ", gasPrice);

        web3.eth.getAccounts(async (err, accounts) => {
            if (err) {
                console.log("errr")
                throw err;
            }
            contract.methods.transfer(to_address.trim(), 100 * (10 ** decimals)).send({
                from: accounts[0],
                gas: '2100000',
                gasPrice
            }).once('transactionHash', function(hash){ 
                res.send({hash, receiving_address:to_address})
             })
        });
    })




}
)

app.listen(process.env.PORT || 8000, () => {
    console.log("Server is running");
})