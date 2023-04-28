// import { createContext, useEffect, useState } from 'react';
// import Web3 from 'web3';
// import { contractAddress, abi } from './config';
// import './App.css';
// import Bidder from './components/Bidder';
// import Uploader from './components/Uploader';

// export const UserContext = createContext({
//   account: '',
//   contract: null,
// });

// function App() {
//   const [account, setAccount] = useState('');
//   const [contract, setContract] = useState(null);
//   const [name, setName] = useState('');
//   const [isregistered, setIsRegistered] = useState('NO');
//   const [loginSuccessfull,setLoginsuccessfull]=useState(false)

//   useEffect(() => {
//     async function isNew() {
//       const isUploader = await contract.methods.isUploader(account).call({ from: account });
//       const isBidder = await contract.methods.isBidder(account).call({ from: account });
//       console.log({ isUploader, isBidder });
//       if (isBidder === '1') {
//         setIsRegistered('BIDDER');
//       }
//       if (isUploader === '1') {
//         setIsRegistered('UPLOADER');
//       }
//     }

//     async function load() {
//       const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
//       if (!web3) {
//         alert('Connect to metamask');
//       }
//       const accounts = await web3.eth.requestAccounts();
//       const contact = new web3.eth.Contract(abi, contractAddress);
//       setContract(contact);
//       setAccount(accounts[0]);
//       console.log(contract);
//       console.log(account);
//       isNew();
//       // window.location.reload()
//     }

//     load();
//   }, [account,loginSuccessfull]);

//   const SetUploader = () => {
//     if(name==='')
//     {
//       alert("please Enter The Name");
//     }
//     else{
//       contract.methods.createUploader(name).send({ from: account }).then(()=>{
//         alert("login successfull")
//         setLoginsuccessfull(true)
//       })
//       .catch((err)=>{console.log(err)});
//     }
//   };

//   const SetBidder = () => {
//     if(name==='')
//     {
//       alert("please Enter The Name");
//     }
//     else{
//       contract.methods.createBidder(name).send({ from: account }).then(()=>{
//         alert("login successfull")
//         setLoginsuccessfull(true)
//     })
//     .catch((err)=>{console.log(err)});
//   };
    
//   };

//   return (
//     <div className="App">
//       <UserContext.Provider value={{ account, contract }}>
//         {account===''?<h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>Please Connect To Metamask</h1>:
//         (<><h1 className="Main-TExt">Welcome To My Tender Application</h1>
//         {isregistered === 'NO' ? (
//           <>
//             <p className="name">And Your Name is?</p>
//             <input type="text" className="input-txt" onChange={(e) => setName(e.target.value)} />
//             <h3 className="address">Your Account Address Is:{account}</h3>

//             <div>
//               <h3 className="select">Are You A ?</h3>
//               <div>
//                 <button onClick={SetUploader}>Uploader</button>
//                 <button onClick={SetBidder}>Bidder</button>
//               </div>
//             </div>
//           </>
//         ) : isregistered === 'BIDDER' ? (
//           <Bidder />
//           // <></>
//           ) : (
//             <Uploader />
//             // <></>
//             )}
//           </>)}
//       </UserContext.Provider>
//     </div>
//   );
// }

// export default App;

/**----------------------------------------------------------------*/
import { createContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import { contractAddress, abi } from './config';
import './App.css';
import Bidder from './components/Bidder';
import Uploader from './components/Uploader';
import MetamaskConnectionMessage from './components/MetamaskConnect'
import {SiBlockchaindotcom} from 'react-icons/si'
import {MdOutlineNotificationImportant} from 'react-icons/md'
 
export const UserContext = createContext({
  account: '',
  contract: null,
});

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [name, setName] = useState('');
  const [isregistered, setIsRegistered] = useState('NO');
  const [loginSuccessfull,setLoginsuccessfull]=useState(false)
  const [isLoading,setIsLoading]=useState(false)

  const refreshPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    async function isNew() {
      // setIsLoading(true)
      const isUploader = await contract.methods.isUploader(account).call({ from: account });
      const isBidder = await contract.methods.isBidder(account).call({ from: account });
      setIsLoading(false)
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
    window.ethereum.on('accountsChanged', () => {
      window.location.reload();
    });
    load();
  }, [account, loginSuccessfull]);

  const SetUploader = () => {
    if(name==='')
    {
      alert("please Enter The Name");
    }
    else{
      contract.methods.createUploader(name).send({ from: account }).then(()=>{
        alert("login successfull")
        setLoginsuccessfull(true)
        refreshPage(); // refresh page after login
      })
      .catch((err)=>{console.log(err)});
    }
  };

  const SetBidder = () => {
    if(name==='')
    {
      alert("please Enter The Name");
    }
    else{
      contract.methods.createBidder(name).send({ from: account }).then(()=>{
        alert("login successfull")
        setLoginsuccessfull(true)
        refreshPage(); // refresh page after login
      })
      .catch((err)=>{console.log(err)});
    };
  };

  return (
    <div className="App">
      {
isLoading?
<h1>Loading</h1>
:
      <UserContext.Provider value={{ account, contract }}>
        {account===''?/*<h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>Please Connect To Metamask</h1>*/
        <MetamaskConnectionMessage />:
        (<><h1 className="Main-TExt">Tender Shield!! <SiBlockchaindotcom/>
        </h1><p className='slogan'>A Secure Way To Process Different Kinds Of Tenders....🔐</p>
        {isregistered === 'NO' ? (
          <>
            <h3 className="address">Your Account Address Is:  <span style={{ color: '#FFFFFF', backgroundColor: '#1c2237', padding: '5px' }}>{account}</span></h3>
            <label for='name' className="name">Please Enter Your Name:  </label>
            <input type="text" className="input-txt" name="name" onChange={(e) => setName(e.target.value)} />

            <div>
              <h3 className="select">Select Your Type 🤔</h3>
              <p>(Tender Organizer - For Tender Creators || Bidder - For Bidders)</p>
              <p style={{ color: 'red', fontWeight: 'bold' }}>IMPORTANT<MdOutlineNotificationImportant/>: Blockchain is immutable, so please enter valid data.
    </p>
              <div>
                <button onClick={SetUploader}>Tender Organizer</button>
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
            </>)}
        </UserContext.Provider>
}
      </div>
    );
  }
  
  export default App;