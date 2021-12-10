# lp-stake-v2

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

compile the contracts & generate types

```
npm run compile
```

deploy the contracts to local blockchain

```
npx hardhat run scripts/deploy.js --network testnetAurora
```
