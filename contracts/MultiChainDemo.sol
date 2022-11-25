pragma solidity ^0.8.0;

interface AsterismMultiChainToken {
    function crossChainTransfer(uint16 destChain, address from, address to, uint amount) external;
}

contract MultiChainDemo {

    AsterismMultiChainToken public multichainToken;
    address public multichainTokenAddress;

    constructor(AsterismMultiChainToken token, address token_address){
        multichainToken = token;
        multichainTokenAddress = token_address;
    }

    function claim(uint16[] memory _chainIds, uint[] memory _amounts, uint length) public {
        address _receiver = msg.sender;
        address _from_address = address(this);
        for (uint i=0; i<length; i++) {
            multichainToken.crossChainTransfer(_chainIds[i], _from_address, _receiver, _amounts[i]);
        }
    }
}
