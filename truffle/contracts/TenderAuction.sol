// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TenderAuction {
    uint public tenderCount = 0;
    uint public bidCount = 0;
    uint public uploaderCount = 0;
    uint public bidderCount = 0;
    uint public allocateCount = 0;
    uint[] public allocateList;

    struct Uploader {
        uint id;
        string username;
    }

    struct Bidder {
        uint id;
        string username;
    }

    struct Bid {
        uint id;
        uint tenderId;
        string tenderTitle;
        uint bid;
        address userHash;
        string bidderName;
        uint allocateTenderId;
        string bidlink;
    }

    struct Tender {
        uint id;
        string itemName;
        string itemDescription;
        uint quantity;
        address userHash;
        uint allocateBidId;
        string tenderlink;
    }

    struct Allocate {
        uint TenderId;
        uint BidId;
        string tenderName;
        string BidderName;
        uint Quantity;
        address TenderCreatorAddress;
        address BidderAddress;
    }

    mapping (uint => Tender) public tenders;
    mapping (uint => Bid) public bids;
    mapping (uint => address) public whoIsUploader;
    mapping (uint => address) public whoIsBidder;
    mapping (address => Uploader) public uploaders;
    mapping (address => Bidder) public bidders;
    mapping (uint => Allocate) public allocates;

    // modifier isUploader(address _userHash) {
    //     require(uploaders[_userHash]);
    //     _;
    // }

    // modifier isBidder(address _userHash) {
    //     require(bidders[_userHash]);
    //     _;
    // }

    modifier alreadyPresent(address _address) {
        for(uint i = 1; i <= uploaderCount; i++) {
            if(whoIsUploader[i] == _address) {
                require(1 == 2, "Address already present");
            }
        }

        for(uint i = 1; i <= bidderCount; i++) {
            if(whoIsBidder[i] == _address) {
                require(1 == 2, "Address already present");
            }
        }
        _;
    }

    function isUploader(address _address) public view returns(uint) {
        for(uint i = 1; i <= uploaderCount; i++) {
            if(whoIsUploader[i] == _address) {
                return 1;
            }
        }
        return 0;
    }

    function isBidder(address _address) public view returns(uint) {
         for(uint i = 1; i <= bidderCount; i++) {
            if(whoIsBidder[i] == _address) {
                return 1;
            }
        }
        return 0;
    }

    function createUploader(string memory _username) public alreadyPresent(msg.sender) {
        uploaderCount++;
        whoIsUploader[uploaderCount] = msg.sender;
        uploaders[msg.sender] = Uploader(uploaderCount, _username);
    }

    function createBidder(string memory _username) public alreadyPresent(msg.sender) {
        bidderCount++;
        whoIsBidder[bidderCount] = msg.sender;
        bidders[msg.sender] = Bidder(bidderCount, _username);
    }

    function createTender(string memory _itemName, string memory _itemDescription, uint _quantity,string memory _link) public {
        tenderCount++;
        tenders[tenderCount] = Tender(tenderCount, _itemName, _itemDescription, _quantity, msg.sender,0,_link);
    }

    function createBid(uint _tenderId, uint _bid,string memory _bidLink) public {
        bidCount++;
        string memory tenderName = tenders[_tenderId].itemName;
        bids[bidCount] = Bid(bidCount, _tenderId, tenderName, _bid, msg.sender,bidders[msg.sender].username,999,_bidLink);
    }

    function allocateTender(uint _tenderId,uint _bidId) public {
        allocateCount++;
        // require(allocates[_tenderId].TenderId == 0  , "Tender Already Allocated");
        // require(_tenderId <= tenderCount  , "Tender Not Initialized");
         address tenderCreatorAddress = tenders[_tenderId].userHash;
         address BidderAddress = bids[_bidId].userHash;

        allocates[allocateCount] = Allocate(_tenderId,_bidId,tenders[_tenderId].itemName,bids[_bidId].bidderName,bids[_bidId].bid,tenderCreatorAddress,BidderAddress);
        // allocateList.push(_tenderId);
        tenders[_tenderId].allocateBidId = _bidId;
        bids[_bidId].allocateTenderId = _tenderId;
        for(uint i=1;i<=bidCount;i++)
        {
            if(bids[i].tenderId==_tenderId && bids[i].allocateTenderId==999)
            {
                bids[i].allocateTenderId=0;
            }
        }
    }
}