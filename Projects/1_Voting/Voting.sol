// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Voting
 */
contract Voting is Ownable {
    event VoterRegistered(address voter);
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );
    event ProposalRegistered(uint256 proposalId);
    event Voted(address voter, uint256 proposalId);
    event WinnerAfterTally(uint256 proposalId, uint256 count);

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedProposalId;
    }

    struct Proposal {
        string description;
        uint256 voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    // Whitelist of voters.
    mapping(address => Voter) public voters;

    // List of proposals.
    Proposal[] public proposals;

    // The id proposal winning the vote.
    uint256 public winningProposalId;

    // The current status of the workflow.
    WorkflowStatus private currentStatus;

    // Id tracking the index of the last proposal. This is also the actual number of proposals.
    uint256 public proposalId;

    // Modifiers. ------------------------------------------------------

    // Guard to ensure to be in a particular status.
    modifier mustBeInWorkflowStatus(WorkflowStatus _status) {
        require(
            currentStatus == _status,
            "Operation not allowed in the current workflow status."
        );
        _;
    }

    // Guard to ensure to be an elector registered in the whitelist.
    modifier isAllowedVoter() {
        require(
            voters[msg.sender].isRegistered == true,
            "The address doesn't belong to the white list."
        );
        _;
    }

    // Guard to ensure that the address is not already in the whitelist.
    modifier notPresentInWhitelist(address _address) {
        require(
            voters[_address].isRegistered == false,
            "The voter is already on the white list."
        );
        _;
    }

    // Guard to avoid address 0.
    modifier notAddress0() {
        require(msg.sender != address(0), "The 0 address can't be used.");
        _;
    }

    // Workflow functions. ----------------------------------------------------
    function changeWorkflowStatus(WorkflowStatus _newStatus) private onlyOwner {
        WorkflowStatus oldStatus = currentStatus;
        currentStatus = _newStatus;
        emit WorkflowStatusChange(oldStatus, currentStatus);
    }

    function startRegistrationProposalSession()
        external
        onlyOwner
        mustBeInWorkflowStatus(WorkflowStatus.RegisteringVoters)
    {
        changeWorkflowStatus(WorkflowStatus.ProposalsRegistrationStarted);
    }

    function endRegistrationProposalSession()
        external
        onlyOwner
        mustBeInWorkflowStatus(WorkflowStatus.ProposalsRegistrationStarted)
    {
        changeWorkflowStatus(WorkflowStatus.ProposalsRegistrationEnded);
    }

    function startVotingSession()
        external
        onlyOwner
        mustBeInWorkflowStatus(WorkflowStatus.ProposalsRegistrationEnded)
    {
        changeWorkflowStatus(WorkflowStatus.VotingSessionStarted);
    }

    function endVotingSession()
        external
        onlyOwner
        mustBeInWorkflowStatus(WorkflowStatus.VotingSessionStarted)
    {
        changeWorkflowStatus(WorkflowStatus.VotingSessionEnded);

        // We can tally votes directly when we end the voting session.
        tallyVotes();
    }

    // End of workflow functions. ----------------------------------------------------

    function addVoter(address _address)
        external
        onlyOwner
        mustBeInWorkflowStatus(WorkflowStatus.RegisteringVoters)
        notPresentInWhitelist(_address)
        notAddress0
    {
        voters[_address] = Voter({
            isRegistered: true,
            hasVoted: false,
            votedProposalId: 0
        });

        emit VoterRegistered(_address);
    }

    function addProposal(string calldata _description)
        external
        mustBeInWorkflowStatus(WorkflowStatus.ProposalsRegistrationStarted)
        isAllowedVoter
    {
        proposals.push(Proposal({description: _description, voteCount: 0}));

        emit ProposalRegistered(++proposalId); // Increment proposal id.
    }

    function voteForProposal(uint256 _id)
        external
        mustBeInWorkflowStatus(WorkflowStatus.VotingSessionStarted)
        isAllowedVoter
    {
        require(
            voters[msg.sender].hasVoted == false,
            "You have already voted once."
        );

        // Increment count on proposals.
        proposals[_id].voteCount++;

        // Update voter informations.
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = _id;

        emit Voted(msg.sender, _id);
    }

    function tallyVotes()
        private
        onlyOwner
        mustBeInWorkflowStatus(WorkflowStatus.VotingSessionEnded)
    {
        uint256 winnerId = 0;
        uint256 maxCount = 0;

        for (uint256 i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > maxCount) {
                winnerId = i;
                maxCount = proposals[i].voteCount;
            }
        }

        winningProposalId = winnerId;

        emit WinnerAfterTally(winnerId, maxCount);

        changeWorkflowStatus(WorkflowStatus.VotesTallied);
    }

    function getWinner()
        external
        view
        mustBeInWorkflowStatus(WorkflowStatus.VotesTallied)
        returns (uint256)
    {
        return winningProposalId;
    }
}
