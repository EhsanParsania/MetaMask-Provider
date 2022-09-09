import React, { useEffect, useState } from 'react'
import MetaMaskOnboarding from '@metamask/onboarding';
import { MetaMaskInstallModal } from './MetaMaskInstallModal';
import { Button } from 'react-bootstrap';
import { Alert } from 'bootstrap';
import { chain } from '../utils/helper'
import { Hash } from './Hash';


export const MetaMaskProvider = (props) => {
  const { ethereum } = window;
  const [isMetaMaskOnboarded] = useState(MetaMaskOnboarding.isMetaMaskInstalled()); // checking if metamask is installed
  const [connectedWalletAddress, setConnectedWalletAddress] = useState(); // checking if wallet address is connected
  const [connectWalletLoading, setConnectWalletLoading] = useState(false);
  const [metaMaskIsReady, setMetaMaskIsReady] = useState(false);
  const [chainId, setChainId] = useState();
  const [changeChainLoading, setChangeChainLoading] = useState(false);
  const [chainChanged, setChainChanged] = useState(false);

  const { children } = props

  useEffect(() => {
    try {
      if (isMetaMaskOnboarded) {
        (async () => {
          recognizeChainChange()
          const [account] = await window.ethereum?.request({ method: 'eth_accounts' })
          setConnectedWalletAddress(account)
          window.ethereum?.on('accountsChanged', async (accounts) => {
            if (!accounts.length) setMetaMaskIsReady(false)
            setConnectedWalletAddress(accounts[0])
          });
        })();
      }
    } catch (error) {
      console.log(error)
    }
    //eslint-disable-next-line
  }, [])


  useEffect(() => {
    (async () => {
      const id = await recognizeChainId()
      if (id !== chainId) {
        setChainId(id)
      }
      await initWallet()
      if (isMetaMaskOnboarded && chainId === process.env.REACT_APP_BLOCKCHAIN_NETWORK_ID && connectedWalletAddress) {
        setMetaMaskIsReady(true)
      }
      else setMetaMaskIsReady(false)
    })()
    //eslint-disable-next-line
  }, [connectWalletLoading, connectedWalletAddress, chainId, metaMaskIsReady, chainChanged]);

  const setWalletAddress = async () => {
    const accounts = await window.ethereum?.request({ method: 'eth_accounts' })
    setConnectedWalletAddress(accounts[0])
  }

  const initWallet = async () => {
    try {
      await setWalletAddress()
    }
    catch (error) {
      Alert(error.message)
      console.log(error)
    }
  }

  const connectWallet = async () => {
    try {
      setConnectWalletLoading(true)
      const accounts = await window.ethereum?.request({ method: 'eth_requestAccounts' })
      setConnectedWalletAddress(accounts[0])
      setConnectWalletLoading(false)
    } catch (error) {
      Alert(error.message)
    }
  }

  const recognizeChainChange = async () => {
    await ethereum?.on('chainChanged', async () => {
      const currentChainId = await ethereum?.request({ method: 'eth_chainId' })
      setChainId(currentChainId)
      setChainChanged(true)
      setMetaMaskIsReady(false)
      if (isMetaMaskOnboarded && currentChainId === process.env.REACT_APP_BLOCKCHAIN_NETWORK_ID && connectedWalletAddress) setMetaMaskIsReady(true)
      else setMetaMaskIsReady(false)
    });
  }

  const recognizeChainId = async () => {
    // default chain id is set to BSC TESTNET (0x61) in .env file
    // configs for mainnet and testnet are in "utils/helper.js"
    try {
      const currentChainId = await ethereum?.request({ method: 'eth_chainId' })
      return currentChainId
    }
    catch (error) {
      console.log(error)
      Alert(error.message)
    }
  }

  const changeChain = async () => {
    try {
      const id = await recognizeChainId()
      if (id !== process.env.REACT_APP_BLOCKCHAIN_NETWORK_ID) {
        setChangeChainLoading(true)
        await addChain() // If it wasn't the specific chain
        await ethereum?.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: process.env.REACT_APP_BLOCKCHAIN_NETWORK_ID }], // chainId must be in hexadecimal numbers // BNB TESTNET = 0x61 // BNB MAINNET = 0x38 // ETH MAINNET = 0x1
        })
        if (isMetaMaskOnboarded && id === process.env.REACT_APP_BLOCKCHAIN_NETWORK_ID) setMetaMaskIsReady(true)
        setChangeChainLoading(false)
      }
    }
    catch (error) {
      setChangeChainLoading(false)
      console.log(error)
      if (error.code === -32002) {
        Alert('Request is pending, please open MetaMask.')
        setChangeChainLoading(true)
      }
      setMetaMaskIsReady(false)
    }
  }

  const addChain = async () => {
    try {
      await ethereum?.request({
        method: 'wallet_addEthereumChain',
        params: [chain],
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      {!isMetaMaskOnboarded && (
        <>
          <h4 className='my-5'>
            MetaMask is not installed. Please install MetaMask to use this app.
          </h4>
          <MetaMaskInstallModal />
        </>
      )}

      {isMetaMaskOnboarded && !connectedWalletAddress &&
        < Button className={''} disabled={connectWalletLoading} onClick={connectWallet} >
          {connectWalletLoading ?
            <span><div className="spinner-border spinner-border-sm p-0" role="status"></div>	&nbsp; Connecting </span> :
            'Connect Wallet'}
        </Button>
      }

      {
        isMetaMaskOnboarded && connectedWalletAddress && chainId !== process.env.REACT_APP_BLOCKCHAIN_NETWORK_ID &&
        <Button className={`btn-danger px-5`} onClick={changeChain} disabled={changeChainLoading} >
          {changeChainLoading ?
            <span className=''><div className="spinner-border spinner-border-sm p-0" role="status" style={{ width: '.9rem', height: '.9rem', fontWeight: 'bold' }}></div>	&nbsp; Pending </span>
            : 'change network'}
        </Button>
      }

      {
        isMetaMaskOnboarded && connectedWalletAddress && chainId === process.env.REACT_APP_BLOCKCHAIN_NETWORK_ID &&
        <>
          <Hash address={connectedWalletAddress}></Hash>
          {children}
        </>
      }
    </div>
  );
}