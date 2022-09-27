# Sample Hardhat Project

1. We deployed our smart contract on `Goerli` network in which Chainlink provides a coin price. There are two smart contracts in this project.
   
* ERC20 contract for sUSDC: `0x47702aF3DAa27CAde02121ad002dACe27BA661c5`
* Escrow contract: `0x3A1F338a2a7341c87af55e13887cD8bFA7bfBFac`
  
  We also went through the verification process so that you can check the smart contract on Etherscan.

2. Any number of people (not only 2 or 20) can bet on the outcomes. Instead of setting the bet result manually, our contract fetches price from Chainlink and settles the bet based on that. In a word, we rely on on-chain data.

3. There is a test file (`test/Escros.js`). Since we cannot fetch oracle price on local hardhat network, it would be good to set the price variable to a certain value manually when testing locally.

