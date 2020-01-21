// Created by OpenZeppelin with some small additions
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Roles.sol
pragma solidity >=0.5.0 <0.7.0;

/**
 * @title Roles
 * @dev Library for managing addresses assigned to a Role.
 */
library Roles {
    struct Role {
        mapping (address => bool) bearer;
        address[] bearers;
    }

    /**
     * @dev Give an account access to this role.
     */
    function add(Role storage role, address account) internal {
        require(!has(role, account), "Roles: account already has role");
        role.bearer[account] = true;
        role.bearers.push(account);
    }

    /**
     * @dev Remove an account's access to this role.
     */
    function remove(Role storage role, address account) internal {
        require(has(role, account), "Roles: account does not have role");
        role.bearer[account] = false;
    }

    /**
     * @dev Check if an account has this role.
     * @return bool
     */
    function has(Role storage role, address account) internal view returns (bool) {
        require(account != address(0), "Roles: account is the zero address");
        return role.bearer[account];
    }

    /**
     * @dev Get amount and addresses of current bearers of this role.
     * @return uint, address[] memory
     */
    function getCurrentBearers(Role storage role) internal view returns (uint, address[] memory) {
        uint _activeBearers = 0;
        for (uint i = 0; i < role.bearers.length; i++) {
            if (role.bearer[role.bearers[i]]) _activeBearers++;
        }
        address[] memory _bearers = new address[](_activeBearers);
        uint index;
        for (uint i = 0; i < role.bearers.length; i++) {
            if(role.bearer[role.bearers[i]]) _bearers[index++] = role.bearers[i];
        }
        return (_activeBearers, _bearers);
    }

    /**
     * @dev Get amount and addresses that are or have been bearers of this role.
     * @return uint, address[] memory
     */
    function getBearers(Role storage role) internal view returns (uint, address[] memory) {
        return (role.bearers.length, role.bearers);
    }
}
