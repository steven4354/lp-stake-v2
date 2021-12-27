// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/IMasterChef.sol";

contract SoloFarm is Ownable {
  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  // Info of each user.
  struct UserInfo {
    uint256 amount;     // How many LP tokens the user has provided.
  }

  // Address of the ERC20 Token contract.
  IERC20 public erc20;

  // Address of LP token contract.
  IERC20 lpToken;

  // trisolaris reward contract infos
  IMasterChef rewardContract;
  address rewardContractAddress;
  uint256 public rewardPoolId;

  // Info of each user that stakes LP tokens.
  mapping (address => UserInfo) public userInfo;

  // The total amount of ERC20 that's paid out as reward.
  uint256 public paidOut = 0;

  // rewards logic
  uint256 public totalRewardsPerWasset = 0;
  mapping (address => uint256) totalRewardsPerWasset_specificToUser;

  event Deposit(address indexed user, uint256 amount);
  event Withdraw(address indexed user, uint256 amount);
    
  constructor(
    IERC20 _nativeTokenReward,
    IERC20 _lpToken,
    address _rewardContract, 
    uint256 _rewardPoolId
  ) public {
    erc20 = _nativeTokenReward;
    lpToken = _lpToken;
    rewardContract = IMasterChef(_rewardContract);
    rewardContractAddress = _rewardContract;
    rewardPoolId = _rewardPoolId;
  }

  function trisolarisReward() public view returns (uint256) {
    uint256 amount = rewardContract.pendingTri(0, address(this));
    return amount;
  }

  function trisolarisRewardV2(uint256 _pid, address _user) public view returns (uint256) {
    uint256 amount = rewardContract.pendingTri(_pid, _user);
    return amount;
  }

  function myAddress() public view returns (address) {
    return address(this);
  }

  function testUintV1() public view returns (uint256) {
    return 5;
  }

  function testUintV2() public view returns (uint256) {
    return 5;
  }

  // Fund the farm, increase the end block
  function fund(uint256 _amount) public {
    erc20.safeTransferFrom(address(msg.sender), address(this), _amount);
  }

  // View function to see deposited LP for a user.
  function deposited(address _user) external view returns (uint256) {
    UserInfo storage user = userInfo[_user];
    return user.amount;
  }

  // Deposit LP tokens to Farm for ERC20 allocation.
  function deposit(uint256 _amount) public {
    UserInfo storage user = userInfo[msg.sender];

    // removing the old rewards
    // if (user.amount > 0) {
    //     uint256 pendingAmount = user.amount.mul(pool.accERC20PerShare).div(1e36).sub(user.rewardDebt);
    //     erc20Transfer(msg.sender, pendingAmount);
    // }

    // new reward logic
    totalRewardsPerWasset = trisolarisReward();
    totalRewardsPerWasset_specificToUser[msg.sender] = trisolarisReward();

    lpToken.safeTransferFrom(address(msg.sender), address(this), _amount);

    // approve lp token to deposit to trisolaris reward
    lpToken.approve(address(rewardContract), _amount);

    rewardContract.deposit(rewardPoolId, _amount);

    user.amount = user.amount.add(_amount);
    emit Deposit(msg.sender, _amount);
  }

  // Withdraw LP tokens from Farm.
  function withdraw(uint256 _amount) public {
    UserInfo storage user = userInfo[msg.sender];
    require(user.amount >= _amount, "withdraw: can't withdraw more than deposit");

    // removing the old rewards logic
    // uint256 pendingAmount = user.amount.mul(pool.accERC20PerShare).div(1e36).sub(user.rewardDebt);
    // erc20Transfer(msg.sender, pendingAmount);

    // new reward logic
    totalRewardsPerWasset = trisolarisReward();
    totalRewardsPerWasset_specificToUser[msg.sender] = trisolarisReward();

    user.amount = user.amount.sub(_amount);

    // remove from tri master chef
    rewardContract.withdraw(rewardPoolId, _amount);

    lpToken.safeTransfer(address(msg.sender), _amount);
    emit Withdraw(msg.sender, _amount);
  }

  // Transfer ERC20 and update the required ERC20 to payout all rewards
  function erc20Transfer(address _to, uint256 _amount) internal {
    erc20.transfer(_to, _amount);
    paidOut += _amount;
  }
}
