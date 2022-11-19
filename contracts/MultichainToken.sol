pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface AsterismInitializer {
    function send(uint16 _dstChainId, address _destination, bytes calldata _payload) external;

}

contract MultichainToken is ERC20 {

    AsterismInitializer public initializerLib;
    address public initializer;

    constructor(AsterismInitializer _initializerLib, address _initializer, uint _initialSupply) ERC20("CrossToken", "CTN"){
        initializerLib = _initializerLib;
        initializer = _initializer;
        _mint(_msgSender(), _initialSupply);
    }

    function crossChainTransfer(uint16 destChain, address from, address to, uint amount) public {
        amount = _debitFrom(from, amount); // amount returned should not have dust
        require(amount > 0, "OFTCore: amount too small");
        _sendMessage(destChain, to, amount);
    }

    function _sendMessage(uint16 destChain, address destAddress, uint amount) internal {
        bytes memory payload = abi.encode(destAddress, amount);
        initializerLib.send(
            destChain,
            destAddress,
            payload
        );
    }

    function asterismReceive(uint16 _srcChainId, bytes calldata _srcAddress, uint64 _nonce, bytes calldata _payload) public{
        (address dstAddress, uint256 amount) = abi.decode(_payload, (address, uint256));
        _creditTo(dstAddress, amount);
    }

    function _debitFrom(address _from, uint _amount) internal virtual returns(uint) {
        address spender = _msgSender();
        if (_from != spender) _spendAllowance(_from, spender, _amount);
        _burn(_from, _amount);
        return _amount;
    }

    function _creditTo(address _toAddress, uint _amount) internal virtual returns(uint) {
        _mint(_toAddress, _amount);
        return _amount;
    }
}
