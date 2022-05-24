import React, { useState, useEffect } from "react";
import MetaMaskOnboarding from '@metamask/onboarding';
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";

export const MetaMaskInstallModal = () => {
  const [modalShow, setModalShow] = useState(false);
  return (
    <>
      <Button className=" mt-2 p-2" type='button' onClick={() => setModalShow(true)}>
        Install MetaMask Wallet
      </Button>
      <ConnectModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
}

function ConnectModal(props) {
  const onboarding = new MetaMaskOnboarding();

  useEffect(() => {
    return () => {
      onboarding.stopOnboarding()
    }
    //eslint-disable-next-line
  }, [])

  const handleConnectToWallet = () => {
    onboarding.startOnboarding();
  }
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      contentClassName='bg-dark p-1'
      centered
    >
      <Modal.Header className={`btn text-left text-white  cursor-default `}>
        <button className='btn btn-danger text-center border-0 ' onClick={props.onHide}><span className='font-weight-bold'>×</span></button>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center p-4 my-3 bg-dark">
        <main className=" site-content text-center col-10 mb-5" >
          <div className="site-content__center ">
            <h3 className="text-warning ">
              Attention !
            </h3>
            <p className="text-warning" style={{ fontSize: '19px' }} >
              You should reload the page after installing the wallet
            </p>
            <Button onClick={handleConnectToWallet}>Start Onboarding MetaMask</Button>
          </div>
        </main>
      </Modal.Body>
    </Modal>
  );
}