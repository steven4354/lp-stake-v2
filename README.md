# lp-stake-v2

stake (trisolaris) lp tokens and earn erc20 governance tokens as reward!

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

### for aurora testnet (used mainnet instead due to free gas)

faucet: https://testnet.aurora.dev/faucet

site: https://aurora.dev/

chain info: https://doc.aurora.dev/develop/networks

explorer: https://explorer.mainnet.aurora.dev/

compile the contracts & generate types

```
npm install
npm run compile
```

deploy the contracts to testnet

```
npx hardhat run scripts/deploy.js --network testnetAurora
```

## testing

### using test files

to run tests use: 

```
npm run test
```

the tests are located in the /test folder

### deploying and testing

```
npx hardhat run scripts/test_solo_farm.ts --network mainnetAurora
npx hardhat run scripts/test_deployed_solo_farm_2.ts --network mainnetAurora
```

## troubleshooting

- nonce error

follow the steps here to reset the account: https://dev.to/nmassi/comment/1dafo

## references

trisolaris LP tokens: 
https://github.com/trisolaris-labs/trisolaris_core/blob/main/contracts/amm/UniswapV2ERC20.sol
