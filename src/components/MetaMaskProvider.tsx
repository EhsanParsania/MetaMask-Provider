import React, { createContext, useState, useEffect } from 'react';
import Web3 from "web3";
import MetaMaskOnboarding from '@metamask/onboarding';
import detectEthereumProvider from '@metamask/detect-provider';
import { getMetamaskTokenOptions } from '../utils/helper';
import Hash from './Hash';
import MetaMaskInstallModal from './MetaMaskInstallModal';
import { Button } from 'react-bootstrap';
import './metamaskProvider.css';

interface MetaMaskContextProps {
  provider?: any;
  web3?: Web3 | null;
  chainId?: string | undefined;
  account?: string | undefined;
}

export const MetaMaskContext = createContext<MetaMaskContextProps>({});

interface MetaMaskProviderProps {
  children: React.ReactNode;
}

export const MetaMaskProvider: React.FC<MetaMaskProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<any>();
  const [web3, setWeb3] = useState<Web3 | null>();
  const [desiredChainId] = useState(process.env.REACT_APP_BLOCKCHAIN_NETWORK_ID);
  const [desiredChainName] = useState(process.env.REACT_APP_BLOCKCHAIN_NETWORK_NAME);
  const [chainId, setChainId] = useState<string | undefined>();
  const [connectedAccount, setConnectedAccount] = useState<string | undefined>();
  const [metaMaskIsReady, setMetaMaskIsReady] = useState<string | boolean | undefined>(false);
  const [changeChainLoading, setChangeChainLoading] = useState(false);
  const [connectWalletLoading, setConnectWalletLoading] = useState(false);

  const contextStore: MetaMaskContextProps = {
    provider,
    web3,
    chainId,
    account: connectedAccount,
  };

  // init metamask provider and web3
  useEffect(() => {
    detectEthereumProvider().then((provider: any) => {
      setProvider(provider);
      setWeb3(new Web3(provider));
    });
    // eslint-disable-next-line
  }, []);

  const isMetaMaskInstalled = MetaMaskOnboarding.isMetaMaskInstalled();
  const onboarding = new MetaMaskOnboarding();

  useEffect(() => {
    if (isMetaMaskInstalled && provider) {
      provider.on('accountsChanged', handleAccountsChanged);
      provider.on('chainChanged', handleChainChanged);

      // initialize chainId and connectedAccount
      handleAccountsChanged();
      handleChainChanged();
    }
    return () => {
      onboarding.stopOnboarding();
    };
    // eslint-disable-next-line
  }, [provider]);

  const handleAccountsChanged = async () => {
    const accounts = await provider.request({ method: 'eth_accounts' });
    if (accounts || accounts.length) {
      setConnectedAccount(accounts[0]);
    }
  };

  const handleChainChanged = async () => {
    const currentChainId = await provider.request({ method: 'eth_chainId' });
    console.log(`Chain ID Changed To: ${currentChainId}`);
    if (currentChainId) {
      setChainId(currentChainId);
    }
  };

  const connectWallet = async () => {
    setConnectWalletLoading(true);
    try {
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      setConnectedAccount(accounts[0]);
    } catch (err) {
      console.log('connect wallet rejected', err);
    }
    setConnectWalletLoading(false);
  };

  const changeChain = async () => {
    if (chainId === desiredChainId) return;
    setChangeChainLoading(true);
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: desiredChainId }],
      });
    } catch (err) {
      console.log('change chain rejected', err);
    }
    setChangeChainLoading(false);
  };

  useEffect(() => {
    const correctChain = chainId === desiredChainId;
    setMetaMaskIsReady(isMetaMaskInstalled && correctChain && connectedAccount);
    // eslint-disable-next-line
  }, [connectedAccount, chainId]);

  const addTokenToMetaMask = async (tokenAddress: string, symbol: string) => {
    try {
      await (window as any)?.ethereum?.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: getMetamaskTokenOptions(tokenAddress, symbol + '_' + tokenAddress.slice(2, 5)),
        },
      });
    } catch (err) {
      console.log('import asset (add token) rejected', err);
    }
  };

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
            <Button className={''} disabled={connectWalletLoading} onClick={connectWallet} >
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
        </div>
      }

      {metaMaskIsReady &&
        <div className="card bg-dark m-1 p-5" >
          <div className="card-body">
            <>
              <Hash address={connectedAccount}></Hash>
              <Button className={`btn-danger px-5`} >
                ADD TOKEN
              </Button>
              {children}
            </>
          </div>
        </div>
      }
    </MetaMaskContext.Provider>
  );
};
