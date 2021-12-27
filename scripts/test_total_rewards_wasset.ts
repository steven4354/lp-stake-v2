// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat


// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

import SoloFarmAbi = require("../abi/contracts/SoloFarm.sol/SoloFarm.json")
import IMasterChefV1Abi = require("../abi/contracts/interfaces/IMasterChef.sol/IMasterChef.json")
import { TRI_MASTERCHEF_ADDR, TRI_WNEAR_ETH_LP_ADDR, WETH_NEAR_LP_POOL_ID } from "../utils/trisolaris";
import { amountToUint256 } from "../utils/conversion";

const DEPLOYED_SOLO_FARM_ADDR = "0x763701F16271C44fCf19785E7844050E5803CE8E"

async function main() {
  const [deployer, governance] = await hre.ethers.getSigners();

  let farm = new hre.ethers.Contract(DEPLOYED_SOLO_FARM_ADDR, SoloFarmAbi, hre.ethers.provider.getSigner());
  
  // deposit something for rewards and updating rewardsWasset 
  // const amountToDeposit = amountToUint256(0.1)
  // let abi = ["function approve(address _spender, uint _value) public returns (bool success)"]
  // let contract = new hre.ethers.Contract(TRI_WNEAR_ETH_LP_ADDR, abi, hre.ethers.provider.getSigner())
  // await contract.approve(farm.address, amountToDeposit)
  // await farm.deposit(0, amountToDeposit)
  // const amountDeposited = await farm.deposited(0, deployer.address)
  // console.log(`Amount deposited for address ${deployer.address} should be at least ${amountToDeposit}: `, amountDeposited);

  const withdraw_amt = amountToUint256(0.0001)
  // withdraw a little to updated the datas
  const amount_deposited_prev = await farm.deposited(deployer.address)
  await farm.withdraw(withdraw_amt)
  const amount_deposited_new = await farm.deposited(deployer.address)
  console.log("amount_deposited_prev amount", amount_deposited_prev);
  console.log("amount_deposited_new amount", amount_deposited_new);

  let farm_tri_reward_pass_through = await farm.trisolarisReward();
  console.log("STEVENDEBUG farm_tri_reward_pass_through ", farm_tri_reward_pass_through);
  
  let total_rewards_wasset = await farm.totalRewardsPerWasset()
  console.log("totalRewardsPerWasset ", total_rewards_wasset);

  let triMasterChef = new hre.ethers.Contract(TRI_MASTERCHEF_ADDR, IMasterChefV1Abi, hre.ethers.provider.getSigner())
  const tri_masterchef_rewards = await triMasterChef.pendingTri(WETH_NEAR_LP_POOL_ID, DEPLOYED_SOLO_FARM_ADDR)
  console.log("tri_masterchef_rewards amount", tri_masterchef_rewards);
  
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// scripts/test_total_rewards_wasset.ts