import { useContext } from 'react';
import { UserContext } from '../App';
import { useEffect,useState } from 'react';
import {MdOutlineNotificationImportant} from 'react-icons/md'

function Bidder() {
  const { account, contract } = useContext(UserContext);
  const [bidLink,setBidLink]=useState("")
  const [allTenders, setAllTEnders] = useState([]);
  const [allBids, setAllBids] = useState([]);
  const [AllAllocatedBids,setAllAllocatedBids]=useState([]);
  const [createShowTenderTab, setcreateShowTenderTab] = useState(false);
  const [createShowBidTab, setcreateShowBidTab] = useState(false);
  const [createShowAllocatedBidTab, setcreateShowAllocatedBidTab] = useState(false);
  const [bidAmmount,setBidAmmount] = useState('')
  const [isBidOpen,setIsBidOpen]=useState(false)
  const [tenderDetails,setTenderDetails] = useState({
    TenderID:'',
    TenderName:'',
    TenderDesc:'',
    TenderOpeningQuantity:''
  })
  const [isLoading,setIsLoading]=useState(false)

  // Your component logic here
  useEffect(() => {
    const fetchTenders = async () => {
      setIsLoading(true)
      const tenderCount = await contract.methods.tenderCount().call();
      const newTenders = [];
      for (let i = 1; i <= tenderCount; i++) {
        const tender = await contract.methods.tenders(i).call();
        if(tender[5]==0)
        {
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
        if(bid[4]==account){
          newBids.push(bid);
        }
      }
      setAllBids(newBids);
      setIsLoading(false)
    };

    const fetchAllocatedBids = async () => {
      setIsLoading(true)
      const allocatedBidCount = await contract.methods.allocateCount().call();
      const newAllocatedBids = [];
      for (let i = 1; i <= allocatedBidCount; i++) {
        const allocatedBid = await contract.methods.allocates(i).call();
        if(allocatedBid[6]==account){
          newAllocatedBids.push(allocatedBid);
        }
      }
      setAllAllocatedBids(newAllocatedBids);
      setIsLoading(false)
    };
    window.ethereum.on('accountsChanged', () => {
      window.location.reload();
    });
    setIsLoading(true)
    fetchTenders();
    fetchBids();
    fetchAllocatedBids();
    setIsLoading(false)
  }, [contract]);

  const PlaceBid = async(id) => {
    setIsBidOpen(true);
    setcreateShowTenderTab(false);
    setcreateShowBidTab(false);
    setcreateShowAllocatedBidTab(false);
    const t = await contract.methods.tenders(id).call();
    setTenderDetails({
      TenderID:t[0],
      TenderName:t[1],
      TenderDesc:t[2],
      TenderOpeningQuantity:t[3]
    })
    console.log(tenderDetails)
  }

  return (
    <>
    {isLoading?<h1>Loading</h1>:<>
    
    <h3>Your account number is: <span style={{ color: '#FFFFFF', backgroundColor: '#1c2237', padding: '5px' }}>{account}</span></h3>
      <h4>You're A Bidder</h4>
      <button onClick={()=>{
         setcreateShowTenderTab(true);
         setcreateShowBidTab(false);
         setcreateShowAllocatedBidTab(false);
         setIsBidOpen(false);
      }}
      >Show All Tenders</button>
      <button onClick={()=>{
         setcreateShowTenderTab(false);
         setcreateShowBidTab(true);
         setcreateShowAllocatedBidTab(false);
         setIsBidOpen(false);
      }}>Show All Bids</button>
      <button onClick={()=>{
         setcreateShowTenderTab(false);
         setcreateShowBidTab(false);
         setcreateShowAllocatedBidTab(true);
         setIsBidOpen(false);
      }}>My Allocated Bids</button>
      <br/>



{createShowTenderTab ? (
        <>
          <h1 style={{ textAlign: "center" }}>Tender List</h1>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Tender ID</th>
                <th>Tender Name</th>
                <th>Tender Description</th>
                <th>Quantity in ₹</th>
                <th>Tender Detailed File</th>
                <th>Make Bid</th>
              </tr>
            </thead>
            <tbody>
              {allTenders.map((tender) => (
                <tr key={tender[0]}>
                  <td>{tender[0]}</td>
                  <td>{tender[1]}</td>
                  <td>{tender[2]}</td>
                  <td>{`${tender[3]} ₹`}</td>
                  <td><a href={`${tender[6]}`} target='self'>Go To File</a></td>
                  <td>{tender[5]==0?<button onClick={()=>PlaceBid(tender[0])}>Bid</button>:null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <></>
      )}
      {
        isBidOpen ? <>
       <p className="createTender-heading" style={{ color: 'red', fontWeight: 'bold' ,marginBottom:'-15px'}}>IMPORTANT<MdOutlineNotificationImportant/>: 
          Please Share Link Of Your Required Documents || You Can Refer Given Website: 
          <a href="https://filebin.net/" target="self" className="createTender-link">Go to the site</a></p>
        <br/>
        <div className='tender-details' style={{ backgroundColor: '#f1f1f1', padding: '10px', borderRadius: '5px' ,margin:"0px 250px 45px 250px"}}>
  <p style={{ fontSize: '18px', fontWeight: 'normal', margin: '0' }}>
    Tender Name: <span style={{ fontWeight: 'bold' }}>{tenderDetails.TenderName}</span>
  </p>
  <p style={{ fontSize: '16px', margin: '0' }}>
    Tender Description: <span style={{ fontWeight: 'bold' }}>{tenderDetails.TenderDesc}</span>
  </p>
  <p style={{ fontSize: '16px', margin: '0' }}>
    Tender Quantity: <span style={{ fontWeight: 'bold' }}>{tenderDetails.TenderOpeningQuantity} ₹</span>
  </p>
</div>

        <b>{`Documents Link:  `}</b><input type="text" onChange={(e) => {setBidLink(e.target.value);}}/><br/><br/>
        <b>{`Enter Your Bid:  `}</b><input type='Number' onChange={(e)=>setBidAmmount(e.target.value)}/><br/><br/>
        <button onClick={async()=>{
            if(bidLink==='' && bidAmmount==='')
            {
              alert("Please Enter Bid details");

            }
            else if(tenderDetails.TenderOpeningQuantity<bidAmmount)
            {
              alert('Bidding Amout Must Be Less Than The Tender Quantity')
            }
            else{
              contract.methods.createBid(tenderDetails.TenderID,bidAmmount,bidLink).send({from:account}).then(()=>{
                setIsBidOpen(false)
                setcreateShowTenderTab(true);
              }).then(()=>{alert("Bid Placed SuccessFully")})
              .then(()=>{window.location.reload()})
            }
        }}>Submit</button>
        <button onClick={()=>{setIsBidOpen(false)
        setcreateShowTenderTab(true);
        }}>cancle</button>
        
        </> : <></>
      }
      {createShowBidTab ? (
        <>
          <h1>Bids List</h1>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>BID ID</th>
                <th>Tender ID</th>
                <th>Tender NAME</th>
                <th>BIDDER ADDRESS</th>
                <th>BID AMOUNT ₹</th>
              </tr>
            </thead>
            <tbody>
              {allBids.map((bid) => (
                <tr key={bid[0]}>
                  <td>{bid[0]}</td>
                  <td>{bid[1]}</td>
                  <td>{bid[2]}</td>
                  <td>{bid[4]}</td>
                  <td>{`${bid[3]} ₹`}</td>
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
                <th>BID AMOUNT ₹</th>
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
                  <td>{`${abid[4]} ₹`}</td>
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
    </>
  );
}

export default Bidder;
