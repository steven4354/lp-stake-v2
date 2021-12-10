import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "hardhat-typechain";
import "solidity-coverage";

require('dotenv').config()

const BSC_TESTNET_MNEMOMIC = process.env.BSC_TESTNET_MNEMOMIC;

export default {
  networks: {
    coverage: {
      url: "http://localhost:8555",
      gas: 20000000,
    },
    hardhat: {
      chainId: 1337,
      allowUnlimitedContractSize: false,
      blockGasLimit: 25000000
    },
    testnetBsc: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      gasPrice: 20000000000,
      timeout: 30000,
      accounts: {
        mnemonic: BSC_TESTNET_MNEMOMIC,
      },
    },
  },
  solidity: {
    version: "0.6.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 999999,
      },
    },
  },
  typechain: {
    outDir: "types",
    target: "ethers-v5"
  },
};
