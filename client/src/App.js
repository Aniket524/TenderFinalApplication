import { createContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import { contractAddress, abi } from './config';
import './App.css';
import Bidder from './components/Bidder';
import Uploader from './components/Uploader';

export const UserContext = createContext({
  account: '',
  contract: null,
});

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [name, setName] = useState('');
  const [isregistered, setIsRegistered] = useState('NO');

  useEffect(() => {
    async function isNew() {
      const isUploader = await contract.methods.isUploader(account).call({ from: account });
      const isBidder = await contract.methods.isBidder(account).call({ from: account });
      console.log({ isUploader, isBidder });
      if (isBidder === '1') {
        setIsRegistered('BIDDER');
      }
      if (isUploader === '1') {
        setIsRegistered('UPLOADER');
      }
    }

    async function load() {
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
      if (!web3) {
        alert('Connect to metamask');
      }
      const accounts = await web3.eth.requestAccounts();
      const contact = new web3.eth.Contract(abi, contractAddress);
      setContract(contact);
      setAccount(accounts[0]);
      console.log(contract);
      console.log(account);
      isNew();
    }

    load();
  }, [account]);

  const SetUploader = () => {
    contract.methods.createUploader(name).send({ from: account });
  };

  const SetBidder = () => {
    contract.methods.createBidder(name).send({ from: account });
  };

  return (
    <div className="App">
      <UserContext.Provider value={{ account, contract }}>
        <h1 className="Main-TExt">Welcome To My Tender Application</h1>
        {isregistered === 'NO' ? (
          <>
            <p className="name">And Your Name is?</p>
            <input type="text" className="input-txt" onChange={(e) => setName(e.target.value)} />
            <h3 className="address">Your Account Address Is:{account}</h3>

            <div>
              <h3 className="select">Are You A ?</h3>
              <div>
                <button onClick={SetUploader}>Uploader</button>
                <button onClick={SetBidder}>Bidder</button>
              </div>
            </div>
          </>
        ) : isregistered === 'BIDDER' ? (
          <Bidder />
          // <></>
        ) : (
          <Uploader />
          // <></>
        )}
      </UserContext.Provider>
    </div>
  );
}

export default App;
