import chai from "chai";
import chaiSubset from "chai-subset";
import {solidity} from "ethereum-waffle";
import {ethers} from "hardhat";
import {BigNumber, BigNumberish, ContractFactory, Signer} from "ethers";

import {Farm} from "../../types/Farm";
import {Erc20Mock} from "../../types/Erc20Mock";
import {MAXIMUM_U256, mineBlocks, ZERO_ADDRESS} from "../utils/helpers";

const MOCK_TOKEN_MINT_AMT = 10000

chai.use(solidity);
chai.use(chaiSubset);

const {expect} = chai;

let FarmFactory: ContractFactory;
let ERC20MockFactory: ContractFactory;

describe("StakingPools", () => {
    let deployer: Signer;
    let governance: Signer;
    let newGovernance: Signer;
    let signers: Signer[];
  
    let pools: Farm;
    let reward: Erc20Mock;
  
    before(async () => {
      FarmFactory = await ethers.getContractFactory("Farm");
      ERC20MockFactory = await ethers.getContractFactory("ERC20Mock");
    });
  
    beforeEach(async () => {
      [deployer, governance, newGovernance, ...signers] = await ethers.getSigners();
  
      reward = (await ERC20MockFactory.connect(deployer).deploy(
        "Test Token",
        "TEST",
        18,
        MOCK_TOKEN_MINT_AMT
      )) as Erc20Mock;
  
      pools = (await FarmFactory.connect(deployer).deploy(
        reward.address,
      )) as Farm;
    });
  
    describe("sample test: set governance", () => {
      it("sample test: only allows governance", async () => {
        // expect(pools.setPendingGovernance(await newGovernance.getAddress())).revertedWith(
        //   "StakingPools: only governance"
        // );
      });
    });
})