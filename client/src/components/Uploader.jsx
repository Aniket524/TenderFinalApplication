import React, { useContext, useState } from "react";
import { tenderContract } from "../contract";
import { UserContext } from "../App";
import { useEffect } from "react";
import './Uploader.css'

const Uploader = () => {
  const { account, contract } = useContext(UserContext);
  const [TenderName, settenderName] = useState("");
  const [TenderDesc, settenderDesc] = useState("");
  const [TenderQty, settenderQty] = useState("");
  const [tenderLink,SetTenderLink] = useState("")
  const [createTenderTab, setcreateTenderTab] = useState(false);
  const [createShowTenderTab, setcreateShowTenderTab] = useState(false);
  const [createShowBidTab, setcreateShowBidTab] = useState(false);
  const [createShowAllocatedBidTab, setcreateShowAllocatedBidTab] = useState(false);
  const [allTenders, setAllTEnders] = useState([]);
  const [allBids, setAllBids] = useState([]);
  const [AllAllocatedBids,setAllAllocatedBids]=useState([]);
  const [tenderCount, setTenderCount] = useState("");
  const [isLoading,setIsLoading]=useState(false)

  const createTender = async () => {
    if(TenderName==='' && TenderDesc==='' && TenderQty===''&&tenderLink==='')
    {
      alert("Please Enter The Details")
    }
    else{
      setIsLoading(true)
      await contract.methods
        .createTender(TenderName, TenderDesc, TenderQty,tenderLink)
        .send({ from: account })
        .then(()=>{alert("Tender Created SuccessFully")})
        .then(()=>{
          setIsLoading(false)
          window.location.reload()})
        .catch((err)=>{console.log(err)});
    }
  };
  
  const fetchAllocatedBids = async () => {
    setIsLoading(true)
    const allocatedBidCount = await contract.methods.allocateCount().call();
    const newAllocatedBids = [];
    for (let i = 1; i <= allocatedBidCount; i++) {
      const allocatedBid = await contract.methods.allocates(i).call();
      newAllocatedBids.push(allocatedBid);
    }
    setAllAllocatedBids(newAllocatedBids);
    setIsLoading(false)
  };
  useEffect(() => {
    const fetchTenders = async () => {
      setIsLoading(true)
      const tenderCount = await contract.methods.tenderCount().call();
      const newTenders = [];
      for (let i = 1; i <= tenderCount; i++) {
        const tender = await contract.methods.tenders(i).call();
        if(tender[4]==account){
          newTenders.push(tender);
        }
      }
      setAllTEnders(newTenders);
      setIsLoading(false)
    };

    const fetchBids = async () => {
      setIsLoading(true)
      const bidCount = await contract.methods.bidCount().call();
      const newBids = [];
      for (let i = 1; i <= bidCount; i++) {
        const bid = await contract.methods.bids(i).call();
        if(bid[6]==999){
          newBids.push(bid);
        }
      }
      setAllBids(newBids);
      console.log(allBids)
      setIsLoading(false)
    };

    window.ethereum.on('accountsChanged', () => {
      window.location.reload();
    });
    // setIsLoading(true)
    fetchTenders()
    fetchBids()
    fetchAllocatedBids()
    // fetchBids();
    // fetchAllocatedBids();
    // setIsLoading(false)
  }, [contract]);


  const allocateBid = async(tenderId,biId) => {
    try {
      setIsLoading(true)
      contract.methods.allocateTender(tenderId,biId).send({from:account})
      .then(()=>{alert("Tender Allocated SuccessFully")})
      .then(()=>{
        window.location.reload()
      setIsLoading(false)})
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>{isLoading?<>Loading</>:
    <>
      <h2>Your account number is: {account}</h2>
      <h1>You're A Tender Organizer</h1>
      <button
        onClick={() => {
          setcreateTenderTab(true);
          setcreateShowTenderTab(false);
          setcreateShowBidTab(false);
          setcreateShowAllocatedBidTab(false);
        }}
      >
        Create Tender
      </button>
      <button
        onClick={async () => {
          setcreateTenderTab(false);
          setcreateShowTenderTab(true);
          setcreateShowBidTab(false);
          setcreateShowAllocatedBidTab(false);
          // const data = await contract.methods
          //   .tenderCount()
          //   .call({ from: account });
          // setTenderCount(data);
          // console.log(tenderCount);
          // const newTenders = [];
          // for (var i = 1; i <= tenderCount; i++) {
          //   const tender = await contract.methods.tenders(i).call();
          //   console.log({ tender: tender });
          //   newTenders.push(tender);
          // }
          // setAllTEnders((allTenders) => [...allTenders, ...newTenders]);
          // console.log(allTenders);
        }}
      >
        Show All Tenders
      </button>
      <button
        onClick={async () => {
          setcreateTenderTab(false);
          setcreateShowTenderTab(false);
          setcreateShowBidTab(true);
          setcreateShowAllocatedBidTab(false);
        }}
      >
        Show All Bids
      </button>
      <button onClick={()=>{
        setcreateTenderTab(false);
        setcreateShowTenderTab(false);
        setcreateShowBidTab(false);
        setcreateShowAllocatedBidTab(true);
      }}>
        Show All Allocated Bids
      </button>
      {isLoading?<>Loading</>:<></>}
      {createTenderTab ? (
        <div className="createTender">
        <p className="createTender-heading">
          For any file upload, please upload file on the given website and share the link with us: 
          <a href="https://filebin.net/" target="self" className="createTender-link">Go to the site</a>
        </p>
        
        <div className="createTender-form">
          <>
          <label htmlFor="tenderName" className="createTender-label">Tender Name:</label>
          <input
            type="text"
            id="tenderName"
            className="createTender-input"
            onChange={(e) => {
              settenderName(e.target.value);
            }}
            />
            <br/>
          </>
          <>
          <label htmlFor="tenderDesc" className="createTender-label">Tender Description:</label>
          <input
            type="text"
            id="tenderDesc"
            className="createTender-input"
            onChange={(e) => {
              settenderDesc(e.target.value);
            }}
            />
            </>
            <>
            <br/>
          <label htmlFor="tenderQty" className="createTender-label">Quantity:</label>
          <input
            type="Number"
            id="tenderQty"
            className="createTender-input"
            onChange={(e) => {
              settenderQty(e.target.value);
            }}
            />
            </>
      <>
          <label htmlFor="tenderLink" className="createTender-label">Link:</label>
          <input
            type="text"
            id="tenderLink"
            className="createTender-input"
            onChange={(e) => {
              SetTenderLink(e.target.value);
            }}
            />
            </>
            <>
      
          <button onClick={createTender} className="createTender-button">Create tender</button>
            </>
        </div>
      </div>
      
      ) : (
        <></>
      )}
{createShowTenderTab ? (
  <>
    <h1 style={{ textAlign: "center" }}>Showing All Tenders</h1>
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Tender ID</th>
            <th>Tender Name</th>
            <th>Tender Description</th>
            <th>Quantity</th>
            <th>Is Allocated?</th>
          </tr>
        </thead>
        <tbody>
          {allTenders.map((tender) => (
            <tr key={tender[0]}>
              <td>{tender[0]}</td>
              <td>{tender[1]}</td>
              <td>{tender[2]}</td>
              <td>{tender[3]}</td>
              <td>{tender[5] === 0 ? "No" : "Yes"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
) : (
        <></>
      )}
      {createShowBidTab ? (
        <>
          <h1>Showing All The Bids</h1>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>BID ID</th>
                <th>Tender ID</th>
                <th>Tender NAME</th>
                <th>BIDDER ADDRESS</th>
                <th>BID AMOUNT</th>
                <th>Bid File</th>
                <th>Allocate?</th>
              </tr>
            </thead>
            <tbody>
              {allBids.map((bid) => (
                <tr key={bid[0]}>
                  <td>{bid[0]}</td>
                  <td>{bid[1]}</td>
                  <td>{bid[2]}</td>
                  <td>{bid[4]}</td>
                  <td>{bid[3]}</td>
                  <td><a href={`${bid[7]}`} target='self'>Go To File</a></td>
                  <td><button onClick={()=>allocateBid(bid[1],bid[0])}>Allocate</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <></>
      )}
       {createShowAllocatedBidTab ? (
        <>
          <h1>Showing All The Allocated Bids</h1>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>TENDER ID</th>
                <th>BID ID</th>
                <th>Tender NAME</th>
                <th>UPLOADER ADDRESS</th>
                <th>BIDDER ADDRESS</th>
                <th>BID AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {AllAllocatedBids.map((abid) => (
                <tr key={abid[0]}>
                  <td>{abid[0]}</td>
                  <td>{abid[1]}</td>
                  <td>{abid[2]}</td>
                  <td>{abid[5]}</td>
                  <td>{abid[6]}</td>
                  <td>{abid[4]}</td>
                  {/* <td><button onClick={allocateBid(bid[1],bid[0])}>Allocate</button></td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <></>
      )}
      </>}
      </div>
  );
};

export default Uploader;
