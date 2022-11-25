pragma solidity ^0.8.9;
import "hardhat/console.sol";

/**
 * @dev Collection of functions related to the address type
 */
library Address {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize, which returns 0 for contracts in
        // construction, since the code is only stored at the end of the
        // constructor execution.

        uint256 size;
        // solhint-disable-next-line no-inline-assembly
        assembly { size := extcodesize(account) }
        return size > 0;
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        // solhint-disable-next-line avoid-low-level-calls, avoid-call-value
        (bool success, ) = recipient.call{ value: amount }("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain`call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason, it is bubbled up by this
     * function (like regular Solidity function calls).
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     *
     * _Available since v3.1._
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCall(target, data, "Address: low-level call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
     * `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCall(address target, bytes memory data, string memory errorMessage) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    /**
     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
     * with `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(address target, bytes memory data, uint256 value, string memory errorMessage) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        require(isContract(target), "Address: call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = target.call{ value: value }(data);
        return _verifyCallResult(success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        return functionStaticCall(target, data, "Address: low-level static call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(address target, bytes memory data, string memory errorMessage) internal view returns (bytes memory) {
        require(isContract(target), "Address: static call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = target.staticcall(data);
        return _verifyCallResult(success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionDelegateCall(target, data, "Address: low-level delegate call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(address target, bytes memory data, string memory errorMessage) internal returns (bytes memory) {
        require(isContract(target), "Address: delegate call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return _verifyCallResult(success, returndata, errorMessage);
    }

    function _verifyCallResult(bool success, bytes memory returndata, string memory errorMessage) private pure returns(bytes memory) {
        if (success) {
            return returndata;
        } else {
            // Look for revert reason and bubble it up if present
            if (returndata.length > 0) {
                // The easiest way to bubble the revert reason is using memory via assembly

                // solhint-disable-next-line no-inline-assembly
                assembly {
                    let returndata_size := mload(returndata)
                    revert(add(32, returndata), returndata_size)
                }
            } else {
                revert(errorMessage);
            }
        }
    }
}

interface InitializerReceiver {
    function asterismReceive(uint16 _srcChainId, bytes calldata _srcAddress, uint64 _nonce, bytes calldata _payload) external;
    function receivePayload(uint16 _srcChainId, bytes calldata _srcPath, address _dstAddress, uint64 _nonce, uint _gasLimit, bytes calldata _payload) external;
}

contract Translator {

    using Address for address;
    InitializerReceiver public endpointContract;
    address public endpoint;

    mapping(uint16 => mapping(address => uint64)) public outboundNonce;

    event Packet(bytes payload);
    event InvalidDst(uint16 indexed srcChainId, address srcAddress, address indexed dstAddress, uint64 nonce, bytes32 payloadHash);
    event PacketReceived(uint16 indexed srcChainId, address srcAddress, address indexed dstAddress, uint64 nonce, bytes32 payloadHash);
    mapping(uint16 => mapping(bytes => uint64)) public inboundNonce;

    modifier onlyEndpoint() {
        require(address(endpoint) == msg.sender, "only endpoint");
        _;
    }

    constructor(){
    }

    function setEndpoint(address _endpoint, InitializerReceiver _initializerReceiver) public {
        endpoint = _endpoint;
        endpointContract = _initializerReceiver;
    }

    function send(address _application, uint64 _nonce, uint16 _dstChainId, address _dstAddress, bytes calldata _payload) external payable onlyEndpoint {
        address application = _application;
        uint16 dstChainId = _dstChainId;
        // TODO: Check if dst chain exists

        address dstAddress = _dstAddress;
        bytes memory payload = _payload;
        uint64 nonce = ++outboundNonce[_dstChainId][dstAddress];
        console.log("Sending to chain: ", _dstChainId);
        console.log("Nonce during sending: ", nonce);
        // emit the data packet
        // TODO: Revisit local chain id (second parameter)
        bytes memory encodedPayload = abi.encode(nonce, uint16(0), application, dstChainId, dstAddress, payload);
        emit Packet(encodedPayload);
    }

    function translateMessage(uint16 _srcChainId, address _dstAddress, uint _gasLimit, bytes calldata _payload) external {

        // TODO: Check for valid relayer
        console.log("Start translating message");

        (uint64 nonce, uint16 _sChId, address _a, uint16 dstChainId, address dstAddress, bytes memory payload) = abi.decode(_payload, (uint64, uint16, address, uint16, address, bytes));

        console.log("Data from packet was parsed");
        console.log("Nonce: ", nonce);
        console.log("Source chain id from payload: ", _sChId);
        console.log("Source chain id from request: ", _srcChainId);
        // TODO: Check if current chain is destination chain
        // TODO: Check if address from payload == address from relayer

        // TODO: Check for address sizes for the chain

        // Check if dst address is a smart contract
        if (!_isContract(_dstAddress)) {
            emit InvalidDst(_sChId, _a, dstAddress, nonce, keccak256(payload));
            return;
        }

        bytes memory pathData = abi.encodePacked(_a, dstAddress);
        // TODO: Correct nonce check
        console.log("Current inbound nonce: ", inboundNonce[_sChId][pathData]);
        require(nonce == ++inboundNonce[_sChId][pathData], "wrong nonce");
        emit PacketReceived(_sChId, _a, dstAddress, nonce, keccak256(payload));
        console.log("About to call endpoint");
        endpointContract.receivePayload(_srcChainId, pathData, _dstAddress, nonce, _gasLimit, payload);
    }

    function _isContract(address addr) internal view returns (bool) {
        uint size;
        assembly {
            size := extcodesize(addr)
        }
        return size != 0;
    }
}
