// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat


// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

import SoloFarmAbi = require("../abi/contracts/SoloFarm.sol/SoloFarm.json")
import IMasterChefV1Abi = require("../abi/contracts/interfaces/IMasterChef.sol/IMasterChef.json")
import { TRI_MASTERCHEF_ADDR, WETH_NEAR_LP_POOL_ID } from "../utils/trisolaris";

const DEPLOYED_SOLO_FARM_ADDR = "0x4CbA1805E52e7263267B5146270Dc6f1Eb202219"

async function main() {
  const [deployer, governance] = await hre.ethers.getSigners();

  const network = await hre.ethers.provider.getNetwork();

  console.log("Network ", network);

  console.log("Deploying contracts with the account:", deployer.address);

  let farm = new hre.ethers.Contract(DEPLOYED_SOLO_FARM_ADDR, SoloFarmAbi, hre.ethers.provider.getSigner());
  
  const trisolaris_reward = await farm.trisolarisReward()
  console.log("STEVENDEBUG trisolaris_reward amount", trisolaris_reward);

  // const signer = await hre.ethers.provider.getSigner()
  // console.log("STEVENDEBUG signer ", signer);

  // const total_trisolaris_reward = await farm.getTotalRewardsPerWasset();
  // const user_trisolaris_reward = await farm.getTotalRewardsPerWassetByUser(deployer.address);
  // console.log("STEVENDEBUG total_trisolaris_reward amount", total_trisolaris_reward);
  // console.log("STEVENDEBUG user_trisolaris_reward amount", user_trisolaris_reward);

  let triMasterChef = new hre.ethers.Contract(TRI_MASTERCHEF_ADDR, IMasterChefV1Abi, hre.ethers.provider.getSigner())
  const tri_masterchef_rewards = triMasterChef.pendingTri(WETH_NEAR_LP_POOL_ID, DEPLOYED_SOLO_FARM_ADDR)
  console.log("STEVENDEBUG tri_masterchef_rewards amount", tri_masterchef_rewards);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

