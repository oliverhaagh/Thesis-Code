pragma solidity >=0.5.0 <0.7.0;

import "./Roles.sol";

contract ProposerRole {
    using Roles for Roles.Role;

    Roles.Role private _proposers;

    constructor() internal {
        _addProposer(msg.sender);
    }

    modifier onlyProposer() {
        require(isProposer(msg.sender), "Caller needs to have the proposer role!");
        _;
    }

    function isProposer(address account) public view returns (bool) {
        return _proposers.has(account);
    }

    function addProposer(address account) public onlyProposer {
        _addProposer(account);
    }

    function removeProposer(address account) public onlyProposer {
        _proposers.remove(account);
    }

    function getCurrentProposers() public view returns (uint, address[] memory) {
        return _proposers.getCurrentBearers();
    }

    function getProposers() public view returns (uint, address[] memory) {
        return _proposers.getBearers();
    }

    function _addProposer(address account) internal {
        _proposers.add(account);
    }
}
