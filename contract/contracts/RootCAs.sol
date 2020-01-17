pragma solidity >=0.5.0 <0.7.0;
pragma experimental ABIEncoderV2;

import "./EndorserRole.sol";
import "./ProposerRole.sol";

contract RootCAs is EndorserRole, ProposerRole {
    enum State {Proposed, Endorsed, Revoked} // state enum for root CA

    enum RevocationReason { // revocation reason enum based on RFC 5280 section 5.3.1 with the the addition of NotRevoked
        Unspecified, KeyCompromise, CACompromise, AffiliationChanged, Superseded,
        CessationOfOperation, CertificateHold, RemoveFromCRL, PrivilegeWithdrawn, AACompromise, NotRevoked
    }

    struct RootCA { // struct that contains the info of a root CA
        uint id;
        State state;
        string caCert;
        RevocationReason revocationReason;
    }

    struct Proposal { // struct that contains the proposals of addition or revocation of a root CA
        State proposedState;
        RootCA rootCA;
        uint endorsements;
        mapping(address => bool) endorsers;
        address proposer;
    }

    struct ProposalSimple { // struct that contains a proposal without endorsements
        State proposedState;
        RootCA rootCA;
    }

    uint private numOfRootCAs; // the number of endorsed and revoked root CAs
    RootCA[] private rootCAs; // array containing all endorsed and revoked root CAs

    Proposal private additionProposal; // proposal for addition

    Proposal private revocationProposal; // proposal for revocation

    uint internal endorsementsNeeded; // the number of endorsements needed to add or revoke a CA

    event RootCAsChanged(RootCA _rootCA); // event that is emitted when a root CA is added or revoked

    event NewProposal(ProposalSimple _proposal); // event that is emitted when a new proposal has been made

    address payable private owner; // the owner of this contract

    constructor(uint _endorsementsNeeded) public {
        endorsementsNeeded = _endorsementsNeeded;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can do this!");
        _;
    }

    // Propose the addition of a new root CA
    function proposeRootCAAddition(string memory _caCert) public onlyProposer {
        require(additionProposal.proposedState == State.Proposed, "An addition proposal already exists!");
        RootCA memory _rootCA = RootCA(0, State.Proposed, _caCert, RevocationReason.NotRevoked);
        Proposal memory _proposal = Proposal({proposedState: State.Endorsed, rootCA: _rootCA, endorsements: 0, proposer: msg.sender});
        additionProposal = _proposal;
        resetEndorsements(additionProposal);
        emit NewProposal(ProposalSimple(_proposal.proposedState, _rootCA));
    }

    // Endorse the latest root CA addition proposal
    function endorseRootCAAddition() public onlyEndorser {
        Proposal storage _proposal = additionProposal;
        require(_proposal.proposedState == State.Endorsed, "This function can only endorse additions!");
        require(!_proposal.endorsers[msg.sender], "Endorser can only endorse once!");
        _proposal.endorsements++;
        _proposal.endorsers[msg.sender] = true;
        if (_proposal.endorsements >= endorsementsNeeded) {
            RootCA memory _rootCA = _proposal.rootCA;
            _rootCA.id = numOfRootCAs;
            _rootCA.state = State.Endorsed;
            rootCAs.push(_rootCA);
            numOfRootCAs++;
            delete additionProposal;
            emit RootCAsChanged(_rootCA);
        }
    }

    // Get the array of endorsed and revoked root CAs
    function getRootCAs() public view returns(RootCA[] memory) {
        return rootCAs;
    }

    // Propose revocation of root CA with given ID and reason
    function proposeRevocation(uint _id, RevocationReason _reason) public onlyProposer {
        require(revocationProposal.proposedState == State.Proposed, "A revocation proposal already exists!");
        require(_id < numOfRootCAs, "ID cannot be bigger than the number of root CAs");
        require(rootCAs[_id].state != State.Revoked, "An already revoked root CA cannot be revoked again");

        RootCA memory _rootCA = rootCAs[_id];
        _rootCA.state = State.Revoked;
        _rootCA.revocationReason = _reason;
        Proposal memory _proposal = Proposal({proposedState: State.Revoked, rootCA: _rootCA, endorsements: 0, proposer: msg.sender});
        revocationProposal = _proposal;
        resetEndorsements(revocationProposal);
        emit NewProposal(ProposalSimple(_proposal.proposedState, _rootCA));
    }

    // Endorse the latest root CA revocation proposal
    function endorseRevocation() public onlyEndorser {
        Proposal storage _proposal = revocationProposal;
        require(!_proposal.endorsers[msg.sender], "Endorser can only endorse once!");

        _proposal.endorsements++;
        _proposal.endorsers[msg.sender] = true;

        if (_proposal.endorsements >= endorsementsNeeded) {
            RootCA memory _revokedCA = _proposal.rootCA;
            rootCAs[_revokedCA.id] = _revokedCA;
            delete revocationProposal;
            emit RootCAsChanged(_revokedCA);
        }
    }

    // Get the current root CA addition proposal
    function getAdditionProposal() public view returns(ProposalSimple memory) {
        return ProposalSimple(additionProposal.proposedState, additionProposal.rootCA);
    }

    // Get the current root CA revocation proposal
    function getRevocationProposal() public view returns(ProposalSimple memory) {
        return ProposalSimple(revocationProposal.proposedState, revocationProposal.rootCA);
    }

    // Change the number of endorsements needed to add or revoke a root CA
    function changeEndorsementsNeeded(uint _endorsementsNeeded) public onlyOwner {
        endorsementsNeeded = _endorsementsNeeded;
    }

    // Change the owner of this contract
    function changeOwner(address payable _newOwner) public onlyOwner {
        owner = _newOwner;
    }

    // Delete the latest root CA addition proposal
    function deleteLatestAdditionProposal() public onlyProposer {
        delete additionProposal;
    }

    // Delete the latest root CA revocation proposal
    function deleteLatestRevocationProposal() public onlyProposer {
        delete revocationProposal;
    }

    // Reset the endorsements of a given proposal
    function resetEndorsements(Proposal storage _proposal) internal {
        (uint len, address[] memory _endorsers) = getEndorsers();
        for (uint i = 0; i < len; i++) {
            address _endorser = _endorsers[i];
            _proposal.endorsers[_endorser] = false;
        }
    }

    // Destroy this contract
    function destroy() public onlyOwner {
        selfdestruct(owner);
    }
}
