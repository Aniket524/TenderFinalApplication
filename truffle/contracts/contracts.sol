pragma solidity >=0.4.22 <0.9.0;

contract Contacts {
  uint count = 0; // state variable

  function setCount(uint _count) public{
    count = _count;
  }

  function getCount() public view returns(uint)
  {
    return count;
  }


}