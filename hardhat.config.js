require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: "https://goerli.infura.io/v3/fa86b50a48804583b28dd56349dd430f",
      accounts: ["486db939c96d853b07b3632d609ec4535a5984d638268f01ef88b0c3fd85776e"]
    }
  },
  etherscan: {
    apiKey: "ENT3QNN7AQB189PS7RV6J37456V1BQ1EDF",
  },
};
