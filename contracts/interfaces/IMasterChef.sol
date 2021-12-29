// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// pulled from https://github.com/trisolaris-labs/trisolaris_core/tree/main/contracts/interfaces
interface IMasterChef {
    struct UserInfo {
        uint256 amount;     // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
    }

    struct PoolInfo {
        IERC20 lpToken;           // Address of LP token contract.
        uint256 allocPoint;       // How many allocation points assigned to this pool. SUSHI to distribute per block.
        uint256 lastRewardBlock;  // Last block number that SUSHI distribution occurs.
        uint256 accSushiPerShare; // Accumulated SUSHI per share, times 1e12. See below.
    }

    // added from contract since was missing in original interface
    // mapping(uint256 => mapping(address => UserInfo)) userInfo;

    function poolInfo(uint256 pid) external view returns (IMasterChef.PoolInfo memory);
    // added from contract since was missing in original interface
    function poolLength() external view returns (uint256 pools);
    function totalAllocPoint() external view returns (uint256);
    function deposit(uint256 _pid, uint256 _amount) external;
    // added from contract
    function withdraw(uint256 _pid, uint256 _amount) external;
    // added from contract
    function userInfo(uint256 _pid, address _user) external view returns (IMasterChef.UserInfo memory);
    function harvest(uint256 _pid) external returns (address);

    function triPerBlock() external view returns (uint256);    
    function pendingTri(uint256 _pid, address _user) external view returns (uint256);
}