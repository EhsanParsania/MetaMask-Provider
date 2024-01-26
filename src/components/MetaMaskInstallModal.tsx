import React, { useState, useEffect } from "react";
import MetaMaskOnboarding from '@metamask/onboarding';
import { Modal, Button as BootstrapButton } from "react-bootstrap";

interface ConnectModalProps {
  show: boolean;
  onHide: () => void;
}

const ConnectModal: React.FC<ConnectModalProps> = (props) => {
  const onboarding = new MetaMaskOnboarding();

  useEffect(() => {
    return () => {
      onboarding.stopOnboarding();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnectToWallet = () => {
    onboarding.startOnboarding();
  };

  const isMobileDevice = () => {
    return 'ontouchstart' in window || 'onmsgesturechange' in window;
  };

  return (
    <div className="bg-dark">
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        contentClassName="bg-dark p-1"
        centered
      >
        <Modal.Header className={` text-white d-flex justify-content-end  cursor-default `}>
          <button className='btn btn-danger text-center border-0 ' onClick={props.onHide}><span className='font-weight-bold'>×</span></button>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center p-4 pb-0 my-2 bg-dark">
          <main className=" site-content text-center col-10 mb-5" >
            <div className="site-content__center ">
              <h3 className="text-warning ">
                Attention !
              </h3>
              <p className="text-warning" style={{ fontSize: '19px' }} >
                You should reload the page after installing MetaMask
              </p>
              {
                isMobileDevice() ?
                  <ConnectToPhoneMetaMask />
                  : <BootstrapButton onClick={handleConnectToWallet}>Install Wallet</BootstrapButton>
              }
            </div>
          </main>
        </Modal.Body>
      </Modal>
    </div>
  );
};

interface ConnectToPhoneMetaMaskProps {
  setUserAddress?: () => void;
}

const ConnectToPhoneMetaMask: React.FC<ConnectToPhoneMetaMaskProps> = ({ setUserAddress }) => {
  const YOUR_ORIGIN = process.env.REACT_APP_FRONTEND_ORIGIN;
  const metamaskAppDeepLink = "https://metamask.app.link/dapp/" + YOUR_ORIGIN;   // put your origin here without http:// ro https://
  return (
    <a href={metamaskAppDeepLink}>
      <BootstrapButton>Connect to MetaMask</BootstrapButton>
    </a>
  );
};

interface MetaMaskInstallModalProps {
  // add any necessary props
}

const MetaMaskInstallModal: React.FC<MetaMaskInstallModalProps> = () => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <BootstrapButton className=" mt-2 p-2 " type='button' onClick={() => setModalShow(true)}>
        Install MetaMask Wallet
      </BootstrapButton>
      <ConnectModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
};

export default MetaMaskInstallModal;
