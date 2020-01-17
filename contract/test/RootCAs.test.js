const { accounts, contract } = require('@openzeppelin/test-environment');
const { expect } = require('chai');

// Import utilities from Test Helpers
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

const RootCAs = contract.fromArtifact('RootCAs');

describe('RootCAs', function() {
    const [owner, proposer, endorser1, endorser2] = accounts;
    
    // called before each test
    // sets up a new contract with 1 endorsement needed, 1 proposer and 2 endorsers
    beforeEach(async function() {
        this.contract = await RootCAs.new(1, {from: owner});
        await this.contract.addProposer(proposer, {from: owner});
        await this.contract.addEndorser(endorser1, {from: owner});
        await this.contract.addEndorser(endorser2, {from: owner});
    });

    it('making an addition proposal.', async function() {
        const receipt = await this.contract.proposeRootCAAddition("test", {from: proposer});

        // expect that the proposed state of the proposal is 1, which is Endorsed
        expect((await this.contract.getAdditionProposal()).proposedState).to.be.equal('1');
        expectEvent(receipt, 'NewProposal');
    });

    it('endorsing an addition proposal.', async function() {
        // set the required endorsements to 2
        await this.contract.changeEndorsementsNeeded(2, {from: owner});

        await this.contract.proposeRootCAAddition("test", {from: proposer});

        // expect the proposal to exist and the length of the list of root CAs is 0
        expect((await this.contract.getAdditionProposal()).proposedState).to.be.equal('1');
        expect((await this.contract.getRootCAs()).length).to.be.equal(0);

        await this.contract.endorseRootCAAddition({from: endorser1});

        // expect the proposal to still exist and the length of the list of root CAs is 0
        expect((await this.contract.getAdditionProposal()).proposedState).to.be.equal('1');
        expect((await this.contract.getRootCAs()).length).to.be.equal(0);

        const receipt = await this.contract.endorseRootCAAddition({from: endorser2});

        // expect the proposal to have been deleted, the length of the root CA list to be 1, and that an event has been emitted
        expect((await this.contract.getAdditionProposal()).proposedState).to.be.equal('0');
        expect((await this.contract.getRootCAs()).length).to.be.equal(1);  
        expectEvent(receipt, 'RootCAsChanged');      
    });

    it('deleting an addition proposal.', async function() {
        // make an addition proposal and expect the result to have proposed state 1, which is Endorsed
        await this.contract.proposeRootCAAddition("test", {from: proposer});
        expect((await this.contract.getAdditionProposal()).proposedState).to.be.equal('1');

        // delete the proposal and expect it to have been reset
        await this.contract.deleteLatestAdditionProposal({from: proposer});
        expect((await this.contract.getAdditionProposal()).proposedState).to.be.equal('0');        
    });

    it('making a revocation proposal.', async function() {
        await this.contract.proposeRootCAAddition("test", {from: proposer});
        await this.contract.endorseRootCAAddition({from: endorser1});

        // make a revocation proposal and expect the result to have proposed state 2, which is Revoked, and that an event has been emitted
        const receipt = await this.contract.proposeRevocation(0, 2, {from: proposer});
        expect((await this.contract.getRevocationProposal()).proposedState).to.be.equal('2');
        await expectEvent(receipt, 'NewProposal');
    });

    it('endorsing a revocation proposal', async function() {
        await this.contract.proposeRootCAAddition("test", {from: proposer});
        await this.contract.endorseRootCAAddition({from: endorser1});

        // expect the state of the new root CA to be 0, which is Endorsed
        expect((await this.contract.getRootCAs())[0].state).to.be.equal('0');

        // make a revocation proposal and expect that the proposed state of the result is 2, which is Revoked
        let receipt = await this.contract.proposeRevocation(0, 2, {from: proposer});
        expect((await this.contract.getRevocationProposal()).proposedState).to.be.equal('2');
        await expectEvent(receipt, 'NewProposal');

        await this.contract.changeEndorsementsNeeded(2, {from: owner});

        // endorse the revocation from two different endorsers
        // and expect that an event is emitted and that the state 
        // of the root CA is 2, which is Revoked
        await this.contract.endorseRevocation({from: endorser1});
        receipt = await this.contract.endorseRevocation({from: endorser2});
        await expectEvent(receipt, 'RootCAsChanged');
        expect((await this.contract.getRootCAs())[0].state).to.be.equal('2');
    });

    it('deleting a revocation proposal.', async function() {
        await this.contract.proposeRootCAAddition("test", {from: proposer});
        await this.contract.endorseRootCAAddition({from: endorser1});

        // propose a revocation and expect that the result has proposed state 2, which is Revoked
        await this.contract.proposeRevocation(0, 2, {from: proposer});
        expect((await this.contract.getRevocationProposal()).proposedState).to.be.equal('2');

        // delete the proposal and expect it to have been reset
        await this.contract.deleteLatestRevocationProposal({from: proposer});
        expect((await this.contract.getRevocationProposal()).proposedState).to.be.equal('0');        
    });

    it('making a proposal without proposer role.', async function() {
        // expect an error to be thrown when calling a function without the proper role
        await expectRevert(this.contract.proposeRootCAAddition("test", {from: endorser1}), "Caller needs to have the proposer role!");
    });

    it('destroy contract', async function() {
        // destroy the contract and expect that an error is thrown when calling functions afterwards
        await this.contract.destroy({from: owner});
        await expectRevert(this.contract.getRootCAs(), "Returned values aren't valid, did it run Out of Gas?");
    });

    it('destroy contract without owner role.', async function() {
        // expect an error to be thrown when trying to destroy the contract without the owner role
        await expectRevert(this.contract.destroy({from: proposer}), "Only owner can do this!");
    });
});