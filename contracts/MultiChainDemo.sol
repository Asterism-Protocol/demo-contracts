pragma solidity ^0.8.0;
import "hardhat/console.sol";

interface AsterismMultiChainToken {
    function crossChainTransfer(uint16 destChain, address from, address to, uint amount, address target) external;
}

contract MultiChainDemo {

    AsterismMultiChainToken public multichainToken;
    address public multichainTokenAddress;

    constructor(AsterismMultiChainToken token, address token_address){
        multichainToken = token;
        multichainTokenAddress = token_address;
    }

    function claim(uint16[] memory _chainIds, uint[] memory _amounts, address[] memory _tokenAddresses, uint length) public {
        address _receiver = msg.sender;
        address _from_address = address(this);
        for (uint i=0; i<length; i++) {
            console.log("Chain_id ", _chainIds[i]);
            console.log("Amount: ", _amounts[i]);
            console.log("Token Address: ", _tokenAddresses[i]);
            multichainToken.crossChainTransfer(_chainIds[i], _from_address, _receiver, _amounts[i], _tokenAddresses[i]);
        }
    }
}
