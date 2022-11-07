pragma solidity ^0.8.9;
import "hardhat/console.sol";

interface TranslatorLibrary {
    function send(address _userApplication, uint64 _lastNonce, uint16 _chainId, address _destination, bytes calldata _payload) external payable;
}

interface InitializerReceiver {
    function asterismReceive(uint16 _srcChainId, bytes calldata _srcAddress, uint64 _nonce, bytes calldata _payload) external;
}

contract Initializer {

    struct StoredPayload {
        uint64 payloadLength;
        address dstAddress;
        bytes32 payloadHash;
    }

    mapping(uint16 => mapping(bytes => uint64)) public inboundNonce;
    // outboundNonce = [dstChainId][srcAddress].
    mapping(uint16 => mapping(address => uint64)) public outboundNonce;
    // storedPayload = [srcChainId][srcAddress]
    mapping(uint16 => mapping(bytes => StoredPayload)) public storedPayload;

    TranslatorLibrary public translatorLibrary;
    address public translator;

    event PayloadCleared(uint16 srcChainId, bytes srcAddress, uint64 nonce, address dstAddress);
    event PayloadStored(uint16 srcChainId, bytes srcAddress, address dstAddress, uint64 nonce, bytes payload, bytes reason);

    constructor (address _translator, TranslatorLibrary _translatorLibrary){
        translator = _translator;
        translatorLibrary = _translatorLibrary;
    }

    function setTransalor(address _translator, TranslatorLibrary _translatorLibrary) public {
        translator = _translator;
        translatorLibrary = _translatorLibrary;
    }

    function send(uint16 _dstChainId, address _destination, bytes calldata _payload) external payable {
        uint64 nonce = ++outboundNonce[_dstChainId][msg.sender];
        translatorLibrary.send(msg.sender, nonce, _dstChainId, _destination, _payload);
    }

    // TODO: Revisit receiveNonReentrant logic
    function receivePayload(uint16 _srcChainId, bytes calldata _srcPath, address _dstAddress, uint64 _nonce, uint _gasLimit, bytes calldata _payload) external {
        // assert and increment the nonce. no message shuffling
        require(_nonce == ++inboundNonce[_srcChainId][_srcPath], "wrong nonce");

        require(translator == msg.sender, "invalid translator");

        // block if any message blocking
        StoredPayload storage sp = storedPayload[_srcChainId][_srcPath];
        require(sp.payloadHash == bytes32(0), "in message blocking");
        console.log("Message recieved!");
        console.log(_dstAddress);
        try InitializerReceiver(_dstAddress).asterismReceive{gas: _gasLimit}(_srcChainId, _srcPath, _nonce, _payload) {
            // success, do nothing, end of the message delivery
        } catch (bytes memory reason) {
            // revert nonce if any uncaught errors/exceptions if the ua chooses the blocking mode
            storedPayload[_srcChainId][_srcPath] = StoredPayload(uint64(_payload.length), _dstAddress, keccak256(_payload));
            emit PayloadStored(_srcChainId, _srcPath, _dstAddress, _nonce, _payload, reason);
        }
    }

    function retryPayload(uint16 _srcChainId, bytes calldata _srcPath, bytes calldata _payload) external {
        StoredPayload storage sp = storedPayload[_srcChainId][_srcPath];
        require(sp.payloadHash != bytes32(0), "no stored payload");
        require(_payload.length == sp.payloadLength && keccak256(_payload) == sp.payloadHash, "invalid payload");

        address dstAddress = sp.dstAddress;

        sp.payloadLength = 0;
        sp.dstAddress = address(0);
        sp.payloadHash = bytes32(0);

        uint64 nonce = inboundNonce[_srcChainId][_srcPath];

        InitializerReceiver(dstAddress).asterismReceive(_srcChainId, _srcPath, nonce, _payload);
        emit PayloadCleared(_srcChainId, _srcPath, nonce, dstAddress);
    }

//    function toBytes(address x) public returns (bytes memory b) {
//        b = new bytes(20);
//        for (uint i = 0; i < 20; i++) b[i] = bytes(uint8(uint(x) / (2**(8*(19 - i)))));
//    }
}
