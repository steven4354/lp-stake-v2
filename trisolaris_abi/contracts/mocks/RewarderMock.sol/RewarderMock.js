export default [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_rewardMultiplier",
        "type": "uint256"
      },
      {
        "internalType": "contract IERC20",
        "name": "_rewardToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_MASTERCHEF",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "triAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "onTriReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "triAmount",
        "type": "uint256"
      }
    ],
    "name": "pendingTokens",
    "outputs": [
      {
        "internalType": "contract IERC20[]",
        "name": "rewardTokens",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "rewardAmounts",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
