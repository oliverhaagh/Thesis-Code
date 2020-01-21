pragma solidity >=0.5.0 <0.7.0;

import "./Roles.sol";

contract EndorserRole {
    using Roles for Roles.Role;

    Roles.Role private _endorsers;

    constructor() internal {
        _addEndorser(msg.sender);
    }

    modifier onlyEndorser() {
        require(isEndorser(msg.sender), "Caller needs to have the endorser role!");
        _;
    }

    function isEndorser(address account) public view returns (bool) {
        return _endorsers.has(account);
    }

    function addEndorser(address account) public onlyEndorser {
        _addEndorser(account);
    }

    function removeEndorser(address account) public onlyEndorser {
        _endorsers.remove(account);
    }

    function getCurrentEndorsers() public view returns (uint, address[] memory) {
        return _endorsers.getCurrentBearers();
    }

    function getEndorsers() public view returns (uint, address[] memory) {
        return _endorsers.getBearers();
    }

    function _addEndorser(address account) internal {
        _endorsers.add(account);
    }
}
