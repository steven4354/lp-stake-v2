// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat


// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

import SoloFarmAbi = require("../abi/contracts/SoloFarm.sol/SoloFarm.json")
import IMasterChefV1Abi = require("../abi/contracts/interfaces/IMasterChef.sol/IMasterChef.json")
import { 
  TRI_MASTERCHEF_ADDR, 
  TRI_WNEAR_ETH_LP_ADDR, 
  WETH_NEAR_LP_POOL_ID 
} from "../utils/trisolaris";
import { amountToUint256 } from "../utils/conversion";
import { address } from '../test/utils/ethereum';

const DEPLOYED_SOLO_FARM_ADDR = "0xC05d3FfDF8dd0636345F4CD3Ea1D94b431b2F93a"

async function main() {
  const [deployer, accountDos] = await hre.ethers.getSigners();

  let farm = new hre.ethers.Contract(DEPLOYED_SOLO_FARM_ADDR, SoloFarmAbi, hre.ethers.provider.getSigner());
  let farm2 = new hre.ethers.Contract(DEPLOYED_SOLO_FARM_ADDR, SoloFarmAbi, accountDos);

  // withdraw a little to updated the datas
  // const withdraw_amt = amountToUint256(0.0001)
  // const amount_deposited_prev = await farm.deposited(deployer.address)
  // console.log("amount_deposited_prev amount", amount_deposited_prev);
  // await farm.withdraw(withdraw_amt)
  // const amount_deposited_new = await farm.deposited(deployer.address)
  // console.log("amount_deposited_new amount", amount_deposited_new);

  // deposit a bit to test
  const deposit_amt = amountToUint256(.1)
  let abi = ["function approve(address _spender, uint _value) public returns (bool success)"]
  let lp_contract = new hre.ethers.Contract(TRI_WNEAR_ETH_LP_ADDR, abi, accountDos)
  await lp_contract.approve(farm.address, deposit_amt)
  await farm2.deposit(deposit_amt)
  const amount_deposited_new = await farm2.deposited(accountDos.address)
  console.log("amount_deposited_new amount", amount_deposited_new);

  let rewards_per_wasset = await farm.calcRewardsPerWasset()
  console.log("rewards_per_wasset ", rewards_per_wasset);

  // decimals 18: https://github.com/trisolaris-labs/trisolaris_core/blob/9154854d32c97d288600761b81a2a1050f8f9c09/contracts/amm/UniswapV2ERC20.sol#L12
  let lp_amt = await farm.totalLPBalanceV2()
  console.log("lp_amt ", lp_amt);
  
  // decimals 18: https://github.com/trisolaris-labs/trisolaris_core/blob/9154854d32c97d288600761b81a2a1050f8f9c09/contracts/governance/Tri.sol#L14
  let tri_amt = await farm.trisolarisReward()
  console.log("tri_amt ", tri_amt);

  let user_deposited_lp_amt = await farm.userInfo(deployer.address)
  console.log("user_deposited_lp_amt ", user_deposited_lp_amt);

  let totalRewardsPerWasset = await farm.totalRewardsPerWasset()
  console.log("totalRewardsPerWasset ", totalRewardsPerWasset);

  let totalRewardsPerWassetByUser = await farm.totalRewardsPerWassetByUser(deployer.address)
  console.log("totalRewardsPerWassetByUser ", totalRewardsPerWassetByUser);

  const decimal_place = Math.pow(10, 18)
  const rewards_per_wasset_js_calc = 
    ((totalRewardsPerWasset - totalRewardsPerWassetByUser) / decimal_place) 
    * user_deposited_lp_amt
  // (farm.totalRewardsPerWasset() - farm.totalRewardsPerWassetByUser(deployer.address))
  // tri_amt / lp_amt // (tri_amt / lp_amt - tri_amt / lp_amt) * user_deposited_lp_amt
  console.log("rewards_per_wasset_js_calc ", rewards_per_wasset_js_calc);
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