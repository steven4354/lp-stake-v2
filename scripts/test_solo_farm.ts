// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat

import { amountToUint256 } from "../utils/conversion";
import { TRI_MASTERCHEF_ADDR, TRI_WNEAR_ETH_LP_ADDR, WETH_NEAR_LP_POOL_ID } from "../utils/trisolaris";
import SoloFarmAbi from "../abi/contracts/SoloFarm.sol/SoloFarm.json"
import RewardAbi from "../abi/contracts/ERC20Mock.sol/ERC20Mock.json"
import LPAbi from "../trisolaris_abi/contracts/amm/UniswapV2ERC20.sol/UniswapV2ERC20.json"
import { address } from '../test/utils/ethereum';

// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const FARM_ADDR = "0x512e4bfCfEd84b388aE8d18fD5308FcFfC4794FE"
const REWARD_ADDR = "0x837bFfE0E776BC16f3698f5B151136bEc8b56ccB"
const DO_NEW_FUNDING = false;

async function main() {
  const [deployer, governance] = await hre.ethers.getSigners();

  // same as deployer
  console.log("Deploying contracts with the account:", deployer.address);

  let Reward;
  let reward;
  
  if (REWARD_ADDR) {
    reward = new hre.ethers.Contract(REWARD_ADDR, RewardAbi, hre.ethers.provider.getSigner())
  } else {
    Reward = await hre.ethers.getContractFactory("ERC20Mock");
    reward = await Reward.deploy("Test Token", "TEST", 18, "1000000");
    await reward.deployed();
  }
  
  console.log("STEVENDEBUG reward address ", reward.address);

  let Farm;
  let farm;

  if (FARM_ADDR) {
    farm = new hre.ethers.Contract(FARM_ADDR, SoloFarmAbi, hre.ethers.provider.getSigner())
  } else {
    Farm = await hre.ethers.getContractFactory("SoloFarm");
    farm = await Farm.deploy(
      reward.address,
      TRI_WNEAR_ETH_LP_ADDR,
      TRI_MASTERCHEF_ADDR,
      WETH_NEAR_LP_POOL_ID
    );
    await farm.deployed();
  }

  console.log("STEVENDEBUG farm address ", farm.address);

  if (DO_NEW_FUNDING) {
    await reward.approve(farm.address, "1000000")
    console.log("STEVENDEBUG reward approved");
    
    await farm.fund("1000000")
    console.log("STEVENDEBUG funding secured");
  }  
  
  // approve deposit of lp into Farm.sol
  const amountToDeposit = amountToUint256(0.1);
  let contract = new hre.ethers.Contract(TRI_WNEAR_ETH_LP_ADDR, LPAbi, hre.ethers.provider.getSigner())
  await contract.approve(farm.address, amountToDeposit)
  console.log("STEVENDEBUG contact approved");

  await farm.deposit(amountToDeposit)
  console.log("deposited");
  
  const amountDeposited = await farm.deposited(deployer.address)
  console.log(`Amount deposited should be ++${amountToDeposit}: `, amountDeposited);

  // await farm.withdraw(amountToDeposit)
  // const amountDepositedNew = await farm.deposited(0, deployer.address)

  // console.log(`Amount withdrawn should be ${amountToDeposit}: `, amountDepositedNew);

  const trisolaris_reward = await farm.trisolarisReward()
  console.log("STEVENDEBUG trisolaris_reward amount", trisolaris_reward);

  const my_address = await farm.myAddress()
  console.log("STEVENDEBUG my_address ", my_address);
  
  const test_uint_v1_val = await farm.testUintV1();
  console.log("STEVENDEBUG test_uint_v1_val ", test_uint_v1_val);
  
  const test_uint_v2_val = await farm.testUintV2();
  console.log("STEVENDEBUG test_uint_v2_val ", test_uint_v2_val);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
