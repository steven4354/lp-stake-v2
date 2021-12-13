// We require the Hardhat Runtime Environment explicitly here. This is optional
import { address } from '../test/utils/ethereum';
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const MOCK_TOKEN_MINT_AMT = 10000
const DEFAULT_DECIMALS = 18
const TRI_FACTORY_ADDR = "0xc66F594268041dB60507F00703b152492fb176E7";
const TRI_ROUTER_ADDR = "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B";
const TRI_MASTERCHEF_STAKING_ADDR = "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB";
const TRI_ERC20_ADDR = "0xFa94348467f64D5A457F75F8bc40495D33c65aBB";
const TRI_WNEAR_ETH_LP_ADDR = "0x63da4DB6Ef4e7C62168aB03982399F9588fCd198";
// index of array
const FIRST_POOL_PID = 0;

async function main() {
  const [deployer, governance] = await hre.ethers.getSigners();

  // test web3
  const accounts = await hre.web3.eth.getAccounts()
  console.log("STEVENDEBUG accounts ", accounts);

  const network = await hre.ethers.provider.getNetwork();

  console.log("Network ", network);

  console.log("Deploying contracts with the account:", deployer.address);

  const Reward = await hre.ethers.getContractFactory("ERC20Mock");
  const reward = await Reward.deploy("Test Token", "TEST", DEFAULT_DECIMALS, MOCK_TOKEN_MINT_AMT);

  const Farm = await hre.ethers.getContractFactory("Farm");
  const farm = await Farm.deploy(
    reward.address,
    TRI_FACTORY_ADDR,
    TRI_ROUTER_ADDR,
    TRI_MASTERCHEF_STAKING_ADDR,
    TRI_ERC20_ADDR,
  );

  const LP = await hre.ethers.getContractFactory("LPMock");
  const lp = await LP.deploy("LP Mock Token", "LP-X-Y", DEFAULT_DECIMALS);

  await reward.deployed();
  await farm.deployed();
  await lp.deployed();

  console.log("Reward deployed to:", reward.address);
  console.log("Farm deployed to:", farm.address);
  console.log("LP deployed to:", lp.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });