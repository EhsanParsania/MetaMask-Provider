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
      symbol: 'EVOLVE',
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
      symbol: 'EVOLVE',
      decimals: 'TOKEN DECIMALS',
    },
  }
}

const metaMaskConfig = metaMaskConfigs[process.env.REACT_APP_BLOCKCHAIN_NETWORK_ID]
export const { chain, TOKENNAME,addressUrl } = metaMaskConfig
