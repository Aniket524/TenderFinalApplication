import React, { useContext, useState } from "react";
import { tenderContract } from "../contract";
import { UserContext } from "../App";
import { useEffect } from "react";

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

  const createTender = async () => {
    await contract.methods
      .createTender(TenderName, TenderDesc, TenderQty,tenderLink)
      .send({ from: account });
  };

  useEffect(() => {
    const fetchTenders = async () => {
      const tenderCount = await contract.methods.tenderCount().call();
      const newTenders = [];
      for (let i = 1; i <= tenderCount; i++) {
        const tender = await contract.methods.tenders(i).call();
        if(tender[4]==account){
          newTenders.push(tender);
        }
      }
      setAllTEnders(newTenders);
    };

    const fetchBids = async () => {
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
    };

    const fetchAllocatedBids = async () => {
      const allocatedBidCount = await contract.methods.allocateCount().call();
      const newAllocatedBids = [];
      for (let i = 1; i <= allocatedBidCount; i++) {
        const allocatedBid = await contract.methods.allocates(i).call();
        newAllocatedBids.push(allocatedBid);
      }
      setAllAllocatedBids(newAllocatedBids);
    };
    fetchTenders();
    fetchBids();
    fetchAllocatedBids();
  }, [contract]);


  const allocateBid = async(tenderId,biId) => {
    try {
      contract.methods.allocateTender(tenderId,biId).send({from:account})
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
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
      {createTenderTab ? (
        <div className="createTender">
          For Any File Upload Please upload File On Given website and share the link with us <a href="https://filebin.net/" target="self">Go To The Site</a>
          <br/>
          tender Name:
          <input
            type="text"
            onChange={(e) => {
              settenderName(e.target.value);
            }}
          />
          tender Description:
          <input
            type="text"
            onChange={(e) => {
              settenderDesc(e.target.value);
            }}
          />
          Quantity:
          <input
            type="Number"
            onChange={(e) => {
              settenderQty(e.target.value);
            }}
          />
          Link:
          <input
            type="text"
            onChange={(e) => {
              SetTenderLink(e.target.value);
            }}
          />
          <button onClick={createTender}>Create tender</button>
        </div>
      ) : (
        <></>
      )}
      {createShowTenderTab ? (
        <>
          <h1 style={{ textAlign: "center" }}>Showing All Tenders</h1>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Tender ID</th>
                <th>Tender Name</th>
                <th>Tender Description</th>
                <th>Quantity</th>
                <th>isAllocated?</th>
              </tr>
            </thead>
            <tbody>
              {allTenders.map((tender) => (
                <tr key={tender[0]}>
                  <td>{tender[0]}</td>
                  <td>{tender[1]}</td>
                  <td>{tender[2]}</td>
                  <td>{tender[3]}</td>
                  <td>{tender[5]==0 ?"NO":"Yes"}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
                  <td><a href={bid[7]} target='self'>Go To File</a></td>
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
    </div>
  );
};

export default Uploader;
