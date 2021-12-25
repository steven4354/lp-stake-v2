// https://ethereum.stackexchange.com/questions/115288/error-overflow-pasing-value-to-smart-contract-method
// https://github.com/trisolaris-labs/trisolaris_core/blob/main/contracts/amm/UniswapV2ERC20.sol
export const amountToUint256 = (amount: number) => {
    return `${amount * Math.pow(10, 18)}`
}