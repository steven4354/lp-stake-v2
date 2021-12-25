// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat

import { amountToUint256 } from "../utils/conversion";
import { TRI_MASTERCHEF_ADDR, TRI_WNEAR_ETH_LP_ADDR, WETH_NEAR_LP_POOL_ID } from "../utils/trisolaris";

// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const [deployer, governance] = await hre.ethers.getSigners();

  const network = await hre.ethers.provider.getNetwork();

  console.log("Network ", network);

  console.log("Deploying contracts with the account:", deployer.address);

  const Reward = await hre.ethers.getContractFactory("ERC20Mock");
  const reward = await Reward.deploy("Test Token", "TEST", 18, 1000000);

  const Farm = await hre.ethers.getContractFactory("Farm");
  const farm = await Farm.deploy(reward.address);

  await reward.deployed();
  await farm.deployed();

  await farm.add(1, TRI_WNEAR_ETH_LP_ADDR, true, TRI_MASTERCHEF_ADDR, WETH_NEAR_LP_POOL_ID)
  const numberOfPools = await farm.poolLength()
  const poolInfo = await farm.poolInfo(0)

  console.log("Number of pools should be 1 now", numberOfPools);
  console.log(`Pool info of pid # 0: `, poolInfo);

  const amountToDeposit = amountToUint256(0.1)

  console.log("STEVENDEBUG 1");
  

  // approve deposit of lp into Farm.sol
  let abi = ["function approve(address _spender, uint _value) public returns (bool success)"]
  let contract = new hre.ethers.Contract(TRI_WNEAR_ETH_LP_ADDR, abi, hre.ethers.provider.getSigner())
  await contract.approve(farm.address, amountToDeposit)

  console.log("STEVENDEBUG 2");


  await farm.deposit(0, amountToDeposit)
  const amountDeposited = await farm.deposited(0, deployer.address)

  console.log(`Amount deposited should be ${amountToDeposit}: `, amountDeposited);

  // await farm.withdraw(0, amountToDeposit)
  // const amountDepositedNew = await farm.deposited(0, deployer.address)

  // console.log(`Amount withdrawn should be ${amountToDeposit}: `, amountDepositedNew);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

function TRI_WNEAR_ETH_REWARD_ADDR(arg0: number, TRI_WNEAR_ETH_LP_ADDR: string, arg2: boolean, TRI_WNEAR_ETH_REWARD_ADDR: any) {
  throw new Error("Function not implemented.");
}
