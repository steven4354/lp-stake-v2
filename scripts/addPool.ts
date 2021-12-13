// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const FARM_ADDR = "0x67Eb087427bDA66EeEA60b8c1948c776640DE761"
const TRI_WNEAR_ETH_LP_ADDR = "0x63da4DB6Ef4e7C62168aB03982399F9588fCd198";
const FIRST_POOL_PID = 0;
const AMOUNT_TO_DEPOSIT = 0.1;

// https://ethereum.stackexchange.com/questions/115288/error-overflow-pasing-value-to-smart-contract-method
// https://github.com/trisolaris-labs/trisolaris_core/blob/main/contracts/amm/UniswapV2ERC20.sol
const amountToUint256 = (amount: number) => {
    return `${amount * Math.pow(10, 18)}`
}

async function main() {
  const [deployer, governance] = await hre.ethers.getSigners();

  const network = await hre.ethers.provider.getNetwork();

  console.log("Network ", network);

  console.log("Deploying contracts with the account:", deployer.address);

  const Farm = await hre.ethers.getContractFactory("Farm");
  const farm = await Farm.attach(
    FARM_ADDR
  )

  // add the lp contract (allocPoint is random number and unused)
  // await farm.add(1, TRI_WNEAR_ETH_LP_ADDR, true)
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