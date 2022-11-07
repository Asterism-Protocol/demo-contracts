require("@nomicfoundation/hardhat-toolbox");

const ALCHEMY_API_KEY = "Dy7P6n4ytrK3-LK0VxvGk3SONewAaDr2";
const GOERLI_PRIVATE_KEY = "2c66fc5e96ada8116963103b4ff3a474926e79a19135cd4f803b761c3b72f527";
const GOERLI_PUBLIC_KEY = "0x89F5C7d4580065fd9135Eff13493AaA5ad10A168";

module.exports = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY]
    },
    mumbai : {
      url: `https://polygon-mumbai.g.alchemy.com/v2/I9sxUTOwMM7HYEuFvHCyHtoTbyvzdZeC`,
      accounts: [GOERLI_PRIVATE_KEY]
    },
    optimismtest : {
      url: `https://opt-goerli.g.alchemy.com/v2/Umkw7ebhcJRLHcBEnXpcsSElkjPU4IO-`,
      accounts: [GOERLI_PRIVATE_KEY]
    }

  }
};