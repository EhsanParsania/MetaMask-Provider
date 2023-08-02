import { createContext, useState, useEffect } from 'react'
import Web3 from "web3"
import MetaMaskOnboarding from '@metamask/onboarding'
import detectEthereumProvider from '@metamask/detect-provider'
import { getMetamaskTokenOptions } from './helper'
import { Hash } from './Hash'
import { MetaMaskInstallModal } from './MetaMaskInstallModal';
import { Button } from 'react-bootstrap';
import './metamaskProvider.css'

export const MetaMaskContext = createContext()

export const MetaMaskProvider = ({ children }) => {
  const [provider, setProvider] = useState()
  const [web3, setWeb3] = useState()

  const [desiredChainId] = useState(process.env.REACT_APP_BLOCKCHAIN_NETWORK_ID)
  const [desiredChainName] = useState(process.env.REACT_APP_BLOCKCHAIN_NETWORK_NAME)

  const [chainId, setChainId] = useState()
  const [connectedAccount, setConnectedAccount] = useState()
  const [metaMaskIsReady, setMetaMaskIsReady] = useState(false)

  const [changeChainLoading, setChangeChainLoading] = useState(false)
  const [connectWalletLoading, setConnectWalletLoading] = useState(false)

  const contextStore = {
    provider,
    web3,
    chainId,
    account: connectedAccount,
  }

  // init metamask provider and web3
  useEffect(() => {
    detectEthereumProvider().then(provider => {
      setProvider(provider)
      setWeb3(new Web3(provider))
    })
    //eslint-disable-next-line
  }, [])

  const isMetaMaskInstalled = MetaMaskOnboarding.isMetaMaskInstalled()
  const onboarding = new MetaMaskOnboarding()

  useEffect(() => {
    if (isMetaMaskInstalled && provider) {
      provider.on('accountsChanged', handleAccountsChanged)
      provider.on('chainChanged', handleChainChanged)

      // initialize chainId and connectedAccount
      // handleAccountsChanged()
      // handleChainChanged()
    }
    return () => {
      onboarding.stopOnboarding()
    }
    //eslint-disable-next-line
  }, [provider])

  const handleAccountsChanged = async () => {
    // it will only get the account address, not opening metamask
    const accounts = await provider.request({ method: 'eth_accounts' })
    if (accounts || accounts.length) {
      setConnectedAccount(accounts[0])
    }
  }

  const handleChainChanged = async (...args) => {
    const currentChainId = await provider.request({ method: 'eth_chainId' })
    console.log(`Chain ID Changed To: ${currentChainId}`)
    if (currentChainId) {
      setChainId(currentChainId)
    }
  }

  const connectWallet = async () => {
    // it will open metamask to get permission if needed
    setConnectWalletLoading(true)
    try {
      const accounts = await provider.request({ method: 'eth_requestAccounts' })
      setConnectedAccount(accounts[0])
    } catch (err) {
      // do nothing
      console.log('connect wallet rejected', err)
    }
    setConnectWalletLoading(false)
  }

  const changeChain = async () => {
    // it will open metamask to add and switch chain if needed
    if (chainId === desiredChainId) return
    setChangeChainLoading(true)
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: desiredChainId }],
      })
    } catch (err) {
      // do nothing
      console.log('change chain rejected', err)
    }
    setChangeChainLoading(false)
  }

  useEffect(() => {
    const correctChain = chainId === desiredChainId
    setMetaMaskIsReady(isMetaMaskInstalled && correctChain)
    //eslint-disable-next-line
  }, [connectedAccount, chainId])

  const addTokenToMetaMask = async (tokenAddress, symbol) => {
    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: getMetamaskTokenOptions(tokenAddress, symbol + '_' + tokenAddress.slice(2, 5))
        },
      })
    } catch (err) {
      console.log('import asset (add token) rejected', err)
    }
  }

  return (
    <MetaMaskContext.Provider value={contextStore}>
      {!metaMaskIsReady &&
        <div className='metamask-container'>
          {!isMetaMaskInstalled &&
            <>
              <h4 className='my-5'>
                MetaMask is not installed. Please install MetaMask to use this app.
              </h4>
              <MetaMaskInstallModal />
            </>
          }
          {isMetaMaskInstalled && !connectedAccount &&
            < Button className={''} disabled={connectWalletLoading} onClick={connectWallet} >
              {connectWalletLoading ?
                <span><div className="spinner-border spinner-border-sm p-0" role="status"></div>	&nbsp; Connecting </span> :
                'Connect Wallet'}
            </Button>
          }
          {isMetaMaskInstalled && connectedAccount && chainId !== desiredChainId &&
            <>
              <p>
                <b className='color-red'>Wrong network selected.</b><br />
                Please switch to the "{desiredChainName}" (chain id: {desiredChainId}) network.
              </p>
              <Button className={`btn-danger px-5`} onClick={changeChain} disabled={changeChainLoading} >
                {changeChainLoading ?
                  <span className=''><div className="spinner-border spinner-border-sm p-0" role="status" style={{ width: '.9rem', height: '.9rem', fontWeight: 'bold' }}></div>	&nbsp; Pending </span>
                  : 'change network'}
              </Button>
            </>
          }
          {isMetaMaskInstalled && connectedAccount && chainId === desiredChainId &&
            <>
              <Hash address={connectedAccount}></Hash>
              <Button className={`btn-danger px-5`} onClick={addTokenToMetaMask} >
                ADD TOKEN
              </Button>
              {children}
            </>
          }
        </div>
      }

      {metaMaskIsReady &&
        <>
          <Hash address={connectedAccount}></Hash>
          <Button className={`btn-danger px-5`} onClick={addTokenToMetaMask} >
            ADD TOKEN
          </Button>
          {children}
        </>
      }
    </MetaMaskContext.Provider>
  );
}
