# lp-stake-v2

## setup (local hardhat blockchain)

start up hardhat local blockchain

```
npx hardhat node 
```

compile the contracts & generate types

```
npm compile
```

deploy the contracts to local blockchain

```
npx hardhat run scripts/deploy.js --network localhost
```

