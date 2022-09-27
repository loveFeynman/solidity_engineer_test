const Web3 = require("web3");
const fs = require('fs');
const BigNumber = require('bignumber.js');

const susdcAbiFile = "./artifacts/contracts/SUSDC.sol/SUSDC.json";
const escrowAbiFile = "./artifacts/contracts/Escrow.sol/Escrow.json";

const rpcUrl = "https://goerli.infura.io/v3/fa86b50a48804583b28dd56349dd430f";

const susdcContractAddr = "0x26AFE867AdFa64E9A29C4d61CbA6d528E519739D";
const account = "0x8651221e305EEa75FccC63f53493621802a9567d";
const privateKey = "486db939c96d853b07b3632d609ec4535a5984d638268f01ef88b0c3fd85776e";

const alice = "0x8deE256Ce989834e1f5dFd9C538567a0AE6915BE";
const bob = "0xfC5aCFFD75Be99f7B806123FBA94da863076189a";

let web3 = new Web3(rpcUrl);
var susdcContractAbi = JSON.parse(fs.readFileSync(susdcAbiFile)).abi;

const contract = new web3.eth.Contract(susdcContractAbi, susdcContractAddr);
const amount = 1_000_000_000_000_000_000;

contract.methods.mint(alice, new BigNumber(amount)).estimateGas({from: account})
    .then(function(gasAmount){
        gasFee = gasAmount;

        const tx = {
            // this could be provider.addresses[0] if it exists
            from: account, 
            // target address, this could be a smart contract address
            to: susdcContractAddr, 
            // optional if you want to specify the gas limit 
            gas: gasFee, 
            value: 0,
            // this encodes the ABI of the method and the arguements
            data: contract.methods.mint(alice, new BigNumber(amount)).encodeABI() 
          };
          const signPromise = web3.eth.accounts.signTransaction(tx, privateKey);

          signPromise.then((signedTx) => {
            const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
      
            sentTx.on("receipt", receipt => {
              console.log("success", receipt)
            });
            sentTx.on("error", err => {
              console.log("err = ", err)
            });
      
          })
    });


