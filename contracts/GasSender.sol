pragma solidity ^0.8.0;

interface AsterismInitializer {
    function send(uint16 _dstChainId, address _destination, bytes calldata _payload) external;

}

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

contract GasSender {

    event CoinsRecieved(uint amount, address dstAddress);

    address public owner;
    uint public currentUsdRate;
    mapping(address => uint) public tokenBalances;

    AsterismInitializer public initializerLib;
    address public initializer;

    constructor(AsterismInitializer _initializerLib, address _initializer){
        initializerLib = _initializerLib;
        initializer = _initializer;
        owner = msg.sender;
    }

    function _sendMessage(uint16 destChain, address destAddress, uint amount, address tokenAddress) internal {
        bytes memory payload = abi.encode(destAddress, amount, tokenAddress);
        initializerLib.send(
            destChain,
            destAddress,
            payload
        );
    }

    function clearance(IERC20 token, address receiver, uint amount) public {
        require(msg.sender == owner);
        token.transfer(receiver, amount);
    }

    function receiveMoney() public payable {
        emit CoinsRecieved(msg.value, msg.sender);
    }

    function updateRate(uint rate) public {
        require(msg.sender == owner);
        currentUsdRate = rate;
    }

    function sendGas(uint16[] memory _chainIds, uint[] memory _amounts, address[] memory _addresses, uint length, IERC20 token, address tokenAddress) public {
        for (uint i=0; i<length; i++) {
            require(token.transferFrom(msg.sender, address(this), _amounts[i]));
            tokenBalances[tokenAddress] += _amounts[i];
            _sendMessage(_chainIds[i], _addresses[i], _amounts[i], tokenAddress);
        }
    }

    function asterismReceive(uint16 _srcChainId, bytes calldata _srcAddress, uint64 _nonce, bytes calldata _payload) public{
        (address payable dstAddress, uint256 amount, address _tokenAddress) = abi.decode(_payload, (address, uint256, address));
        uint amountToSend = amount / currentUsdRate;
        dstAddress.send(amountToSend);
    }

}
