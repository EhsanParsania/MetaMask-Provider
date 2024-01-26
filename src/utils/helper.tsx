
export const getMetamaskChainOptions = (chainId: string, chainName: string) => ({
  chainId,
  chainName,
  nativeCurrency: {
    name: process.env.REACT_APP_BLOCKCHAIN_SYMBOL,
    symbol: process.env.REACT_APP_BLOCKCHAIN_SYMBOL, // 2-6 characters long
    decimals: 18
  },
  // blockExplorerUrls: ['http://'],
  rpcUrls: [process.env.REACT_APP_BLOCKCHAIN_RPC_URL],
})

export const getMetamaskTokenOptions = (tokenAddress: string, tokenName = 'LETH') => ({
  address: tokenAddress,
  symbol: tokenName,
  decimals: 18,
  image: ''
})

export const getAddress = (contract: { _address: any }) => contract?._address

const metaMaskConfigs = {
  '0x61': { // BSC TESTNET
    chain: {
      chainId: '0x61',
      chainName: 'BNB Chain [TESTNET]',
      nativeCurrency: {
        name: 'Binance',
        symbol: 'BNB', // 2-6 characters long
        decimals: 18
      },
      blockExplorerUrls: ['https://testnet.bscscan.com'],
      rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    },
    addressUrl: 'https://testnet.bscscan.com/address/',
    TOKENNAME: {
      address: 'TOKEN_ADDRESS',
      symbol: 'EP',
      decimals: 'TOKEN DECIMALS',
    },
  },
  '0x38': { // BSC MAIN
    chain: {
      chainId: '0x38',
      chainName: 'BNB Chain (BSC)',
      nativeCurrency: {
        name: 'Binance',
        symbol: 'BNB', // 2-6 characters long
        decimals: 18
      },
      blockExplorerUrls: ['https://bscscan.com'],
      rpcUrls: ['https://bsc-dataseed.binance.org/'],
    },
    addressUrl: 'https://bscscan.com/address/',
    TOKENNAME: {
      address: 'TOKEN_ADDRESS',
      symbol: 'EP',
      decimals: 'TOKEN DECIMALS',
    },
  }
}

const metaMaskConfig = process.env.REACT_APP_BLOCKCHAIN_NETWORK_ID
  ? metaMaskConfigs[process.env.REACT_APP_BLOCKCHAIN_NETWORK_ID as keyof typeof metaMaskConfigs]
  : undefined;
  export const { chain, TOKENNAME, addressUrl } = metaMaskConfig || {};
