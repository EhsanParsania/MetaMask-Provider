import React, { useEffect, useState } from 'react'
import MetaMaskOnboarding from '@metamask/onboarding';
import { MetaMaskInstallModal } from './MetaMaskInstallModal';
import { Button } from 'react-bootstrap';


export const MetaMask = () => {
  const [isMetaMaskOnboarded, setIsMetaMaskOnboarded] = useState(); // checking if metamask is installed
  const [connectedWalletAddress, setConnectedWalletAddress] = useState(); // checking if wallet address is connected
  const [connectWalletLoading, setConnectWalletLoading] = useState(false); 

  useEffect(() => {
    checkMetaMaskOnboarding()
  }, []);

  useEffect(() => {
    
  }, []);

  const checkMetaMaskOnboarding = () => {
    const result = MetaMaskOnboarding.isMetaMaskInstalled()
    setIsMetaMaskOnboarded(result)
    console.log('isMetaMaskOnboarded', result)
  }

  const connectWallet = () => {
    setConnectWalletLoading(true)
    MetaMaskOnboarding.startOnboarding();


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

      {isMetaMaskOnboarded && 
        < Button className={''} disabled={connectWalletLoading} onClick={connectWallet} >
          {connectWalletLoading ?
            <span><div className="spinner-border spinner-border-sm p-0" role="status"></div>	&nbsp; Connecting </span> :
            'Connect Wallet'}
        </Button>
      }

      <h1>hey</h1>
    </div>
  );
}