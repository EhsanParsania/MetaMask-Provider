import Web3 from "web3"

export const getMetamaskChainOptions = (chainId, chainName) => ({
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

export const getMetamaskTokenOptions = (tokenAddress, tokenName = 'LETH') => ({
  address: tokenAddress,
  symbol: tokenName,
  decimals: 18,
  image: ''
})

export const toWei = (amount) => {
  return Web3.utils.toWei(amount.toString(), 'ether')
}

export const fromWei = (amount) => {
  return Web3.utils.fromWei(amount.toString(), 'ether')
}

export const getAddress = contract => contract?._address

export const getFunctionInterface = (contract, functionName) => {
  if (functionName === 'constructor') {
    return contract._jsonInterface.find(item => item.type === functionName)
  } else {
    return contract._jsonInterface.find(item => item.name === functionName && item.type === 'function')
  }
}


export const formatNumber = number => {
  const [int, fraction] = String(number).split('.')
  const formattedInt = parseInt(int).toLocaleString()
  if (fraction) {
    return formattedInt + '.' + fraction
  } else {
    return formattedInt
  }
}

export const toChecksumAddress = (address) => {
  return Web3.utils.toChecksumAddress(address)
}

export const HumanReadableVariableName = (variableName = '') => {
  return variableName
    .replace(/^_/, '') // remove underscore at the beginning
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .replace(/([a-z]|[A-Z]+)([A-Z])/g, '$1 $2') // Insert a space before caps after non-caps or multi-cap
}

export const rpcExtractRevertedErrorMessage = rpcError => {
  const msg = rpcError?.message || ''

  // detect local metamask issues
  if (msg.includes('Nonce too high') || msg.includes('invalid block')) {
    return <>Metamask transaction history conflict. This happens usually in local testing environment. <br />
      <b>FIX: Metamask Settings &gt; Advanced &gt; Reset account</b>, then try the transaction again.</>
  }
  if (msg.includes('Nonce too low')) {
    return <>Slow down! Please try sending this transaction again. (Nonce Too Low error)</>
  }

  // get reverted error
  const match = msg.match(/reverted with reason string '(.*?)'"/)
  if (!match || !match[1]) {
    return msg || rpcError
  } else {
    return match[1]
  }
}

export const formatDateForBlockchain = dateStringInput => {
  const dateInput = new Date(dateStringInput)
  return String(Math.trunc(dateInput.getTime() / 1000))
}

