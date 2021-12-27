// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

// swapped to the full abi
// import IMasterChefV1Abi = require("../abi/contracts/interfaces/IMasterChef.sol/IMasterChef.json")
import IMasterChefV1Abi = require("../trisolaris_abi/contracts/rewards/MasterChef.sol/MasterChef.json")
import { amountToUint256 } from "../utils/conversion";
import { TRI_MASTERCHEF_ADDR, TRI_WNEAR_ETH_LP_ADDR, WETH_NEAR_LP_POOL_ID } from "../utils/trisolaris";

async function main() {
  const [deployer, governance] = await hre.ethers.getSigners();

  // test web3
  const accounts = await hre.web3.eth.getAccounts()
  console.log("STEVENDEBUG accounts ", accounts);

  const network = await hre.ethers.provider.getNetwork();

  console.log("Network ", network);

  // address from: https://trisolaris-labs.github.io/docs/contracts/
  // using master chef due to https://explorer.mainnet.aurora.dev/address/0x1f1Ed214bef5E83D8f5d0eB5D7011EB965D0D79B/tokens showing
  // having wETH-Near LP token
  let triMasterChef = new hre.ethers.Contract(TRI_MASTERCHEF_ADDR, IMasterChefV1Abi, hre.ethers.provider.getSigner())
  const poolLength = await triMasterChef.poolLength()
  
  console.log("STEVENDEBUG poolLength ", poolLength);

  // for (var i=0; i<POOL_LENGTH; i++) {
  //   const poolInfo = await triMasterChef.poolInfo(i)
  //   console.log("STEVENDEBUG pool number ", i, " poolInfo ", poolInfo);
  // }

  const wnear_eth_pool_info = await triMasterChef.poolInfo(WETH_NEAR_LP_POOL_ID)
  console.log("STEVENDEBUG pool wnear_eth_pool_info ", wnear_eth_pool_info);

  const deposit_amount = amountToUint256(0.1)

  // approve the masterchef address to take the lp tokens
  let erc20Abi = ["function approve(address _spender, uint _value) public returns (bool success)"]
  let lp = new hre.ethers.Contract(TRI_WNEAR_ETH_LP_ADDR, erc20Abi, hre.ethers.provider.getSigner())
  await lp.approve(TRI_MASTERCHEF_ADDR, deposit_amount)

  await triMasterChef.deposit(WETH_NEAR_LP_POOL_ID, deposit_amount);

  // await triMasterChef.withdraw(WETH_NEAR_LP_POOL_ID, deposit_amount)

  // await triMasterChef.harvest(WETH_NEAR_LP_POOL_ID)

  const pendingTri = await triMasterChef.pendingTri(WETH_NEAR_LP_POOL_ID, accounts[0])
  console.log("STEVENDEBUG pendingTri ", pendingTri);

  const userInfo = await triMasterChef.userInfo(0, accounts[0])
  console.log("STEVENDEBUG userInfo ", userInfo);
  
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });