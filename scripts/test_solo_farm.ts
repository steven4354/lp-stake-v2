// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat

import { amountToUint256 } from "../utils/conversion";
import { TRI_MASTERCHEF_ADDR, TRI_WNEAR_ETH_LP_ADDR, WETH_NEAR_LP_POOL_ID } from "../utils/trisolaris";

// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const QUICK_ERC20_ABI = ["function approve(address _spender, uint _value) public returns (bool success)"]

async function main() {
  const [deployer, governance] = await hre.ethers.getSigners();

  const network = await hre.ethers.provider.getNetwork();

  console.log("Network ", network);

  console.log("Deploying contracts with the account:", deployer.address);

  const Reward = await hre.ethers.getContractFactory("ERC20Mock");
  const reward = await Reward.deploy("Test Token", "TEST", 18, 1000000);

  const Farm = await hre.ethers.getContractFactory("SoloFarm");
  const farm = await Farm.deploy(
    reward.address,
    TRI_WNEAR_ETH_LP_ADDR,
    TRI_MASTERCHEF_ADDR,
    WETH_NEAR_LP_POOL_ID
  );

  await reward.deployed();
  await farm.deployed();

  // const amountToFund = amountToUint256(1000000)
  await reward.approve(farm.address, 1000000)
  await farm.fund(1000000)

  const amountToDeposit = amountToUint256(0.1)

  console.log("STEVENDEBUG farm address ", farm.address);
  
  // approve deposit of lp into Farm.sol
  let abi = ["function approve(address _spender, uint _value) public returns (bool success)"]
  let contract = new hre.ethers.Contract(TRI_WNEAR_ETH_LP_ADDR, abi, hre.ethers.provider.getSigner())
  await contract.approve(farm.address, amountToDeposit)

  console.log("STEVENDEBUG contact approved");

  await farm.deposit(amountToDeposit)
  const amountDeposited = await farm.deposited(deployer.address)

  console.log(`Amount deposited should be ${amountToDeposit}: `, amountDeposited);

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
