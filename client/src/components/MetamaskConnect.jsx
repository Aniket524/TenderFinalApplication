import React from 'react';
import { FaEthereum } from 'react-icons/fa';
// import { RiMetamaskFill } from 'react-icons/ri';
import {GiFox} from 'react-icons/gi'
import './MetamaskConnect.css'
import Web3 from 'web3'

const MetamaskConnectionMessage = () => {
  const connectMetamask = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // Accounts now exposed
        const web3 = new Web3(window.ethereum);
        console.log('Connected to Metamask with address:', await web3.eth.getCoinbase());
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('Metamask not detected.');
    }
  }
  return (
    <div className="metamask-connection-message">
      <div className="metamask-logo">
        <GiFox />
      </div>
      <div className="message">
        <h2>Please Connect to Metamask</h2>
        <p>In order to access this page, you need to connect to Metamask.</p>
        <button onClick={connectMetamask}>Connect to Metamask</button>
      </div>
      <div className="ethereum-logo">
        <FaEthereum />
      </div>
    </div>
  );
};

export default MetamaskConnectionMessage;
