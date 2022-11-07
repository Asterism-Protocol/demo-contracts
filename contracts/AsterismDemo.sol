pragma solidity ^0.8.9;
import "hardhat/console.sol";

interface AsterismInitializer {
    function send(uint16 _dstChainId, address _destination, bytes calldata _payload) external;

}

contract AsterismDemo {

    AsterismInitializer public initializerLib;
    address public initializer;
    string public currentChain;
    string public externalChain;

    constructor (AsterismInitializer _initializerLib, address _initializer){
        initializerLib = _initializerLib;
        initializer = _initializer;
        currentChain = "Hello from source chain";
        externalChain = "Here is nothing yet";
    }

    function setExternalChainMessage(string memory message) internal {
        console.log("setExternalChainMessage!");
        console.log(message);
        externalChain = message;
    }

    function sendMessage(uint16 destChain, address destAddress, string memory message) public payable {
        bytes memory payload = abi.encode(message);
        initializerLib.send(
            destChain,
            destAddress,
            payload
        );
    }

    function asterismReceive(uint16 _srcChainId, bytes calldata _srcAddress, uint64 _nonce, bytes calldata _payload) public{
        string memory _externalChain = abi.decode(_payload, (string));
        setExternalChainMessage(_externalChain);
    }
}
