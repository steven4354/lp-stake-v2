// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const MOCK_TOKEN_MINT_AMT = 10000
const DEFAULT_DECIMALS = 18

async function main() {
  const [deployer, governance] = await hre.ethers.getSigners();

  const network = await ethers.provider.getNetwork();

  console.log("Network ", network);

  console.log("Deploying contracts with the account:", deployer.address);

  const Reward = await hre.ethers.getContractFactory("ERC20Mock");
  const reward = await Reward.deploy("Test Token", "TEST", DEFAULT_DECIMALS, MOCK_TOKEN_MINT_AMT);

  const Farm = await hre.ethers.getContractFactory("Farm");
  const farm = await Farm.deploy(reward.address);

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