# lp-stake-v2

stake lp tokens and earn erc20 tokens as reward!

## setup 

### for local hardhat blockchain

start up hardhat local blockchain

```
npx hardhat node 
```

compile the contracts & generate types

```
npm run compile
```

deploy the contracts to local blockchain

```
npx hardhat run scripts/deploy.js --network localhost
```

### for aurora testnet

faucet: https://testnet.aurora.dev/faucet

site: https://aurora.dev/

chain info: https://doc.aurora.dev/develop/networks

explorer: https://explorer.mainnet.aurora.dev/

compile the contracts & generate types

```
npm install
npm run compile
```

deploy the contracts to local blockchain

```
npx hardhat run scripts/deploy.js --network testnetAurora
```

## smart contracts testing

to run tests use: 

```
npm run test
```

the tests are located in the /test folder

## notes

trisolaris LP tokens: 
https://github.com/trisolaris-labs/trisolaris_core/blob/main/contracts/amm/UniswapV2ERC20.sol

```
npx hardhat run scripts/addPool.ts --network mainnetAurora
```

## troubleshooting

- nonce error

follow the steps here to reset the account: https://dev.to/nmassi/comment/1dafo