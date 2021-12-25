// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

import IMasterChefV2Abi = require("../abi/contracts/interfaces/IMasterChefV2.sol/IMasterChefV2.json")
import IMasterChefV1Abi = require("../abi/contracts/interfaces/IMasterChef.sol/IMasterChef.json")
import { amountToUint256 } from "../utils/conversion";

const FARM_ADDR = "0x67Eb087427bDA66EeEA60b8c1948c776640DE761"
const TRI_WNEAR_ETH_LP_ADDR = "0x63da4DB6Ef4e7C62168aB03982399F9588fCd198";
const TRI_WNEAR_ETH_REWARD_ADDR = "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d";
const FIRST_POOL_PID = 0;
const AMOUNT_TO_DEPOSIT = 0.1;

const DEFAULT_DECIMALS = 18
const TRI_FACTORY_ADDR = "0xc66F594268041dB60507F00703b152492fb176E7";
const TRI_ROUTER_ADDR = "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B";
const TRI_MASTERCHEF_STAKING_ADDR = "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB";
const TRI_ERC20_ADDR = "0xFa94348467f64D5A457F75F8bc40495D33c65aBB";
const MOCK_TOKEN_MINT_AMT = 10000

async function main() {
  const [deployer, governance] = await hre.ethers.getSigners();

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

  // https://github.com/trisolaris-labs/trisolaris_core/blob/main/contracts/rewards/MasterChef.sol
  let MasterChefAbi = ["function poolLength() public view returns (uint256 pools)"]
  let triMasterChef = new hre.ethers.Contract('0x1f1Ed214bef5E83D8f5d0eB5D7011EB965D0D79B', MasterChefAbi, hre.ethers.provider.getSigner())
  const poolLength = triMasterChef.poolLength()

  console.log("STEVENDEBUG poolLength ", poolLength);
  
  await reward.deployed();
  await farm.deployed();

  // add the lp contract (allocPoint is random number and unused)
  await farm.add(1, TRI_WNEAR_ETH_LP_ADDR, true, TRI_WNEAR_ETH_REWARD_ADDR)
  const numberOfPools = await farm.poolLength()
  const poolInfo = await farm.poolInfo(FIRST_POOL_PID)

  console.log("Number of pools should be 1 now", numberOfPools);
  console.log(`Pool info of pid # ${FIRST_POOL_PID}: `, poolInfo);
  
  // add some of the lp token in the wallet into the pool
  // https://ethereum.stackexchange.com/questions/79242/execute-transaction-approve-directly-against-contract-address-without-abi
  const amountToDeposit = amountToUint256(AMOUNT_TO_DEPOSIT)

  let abi = ["function approve(address _spender, uint _value) public returns (bool success)"]
  let contract = new hre.ethers.Contract(TRI_WNEAR_ETH_LP_ADDR, abi, hre.ethers.provider.getSigner())
  await contract.approve(farm.address, amountToDeposit)

  console.log(`Approved done`);

  await farm.deposit(FIRST_POOL_PID, amountToDeposit)
  const amountDeposited = await farm.deposited(FIRST_POOL_PID, deployer.address)

  console.log(`Amount deposited should be ${amountToDeposit}: `, amountDeposited);

  await farm.withdraw(FIRST_POOL_PID, amountToDeposit)
  const amountDepositedNew = await farm.deposited(FIRST_POOL_PID, deployer.address)

  console.log(`Amount withdrawn should be ${amountToDeposit}: `, amountDepositedNew);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });