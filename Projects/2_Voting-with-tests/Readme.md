# Tests pour Voting 

## Périmètre des tests

Nous allons tester les fonctions du contrat suivant 4 thèmes, chacun répartis dans un describe, pous plus de lisibilité : 
1. vérification des getters
1. vérification des fonctionnalités du owner, en dehors des changement de statut
1. vérification des changements de status
1. vérification des fonctions des voteurs

À chaque fois, nous testerons d'abord le cas passant, quand toutes les conditions sont réunies et son émisison d'évènement associé.
Puis pour nous ferons un cas de test pour chacune des conditions qui déclenchent une erreur et font un revert.

1. describe("Check getters")

    - function getVoter(address _addr) external view onlyVoters returns (Voter memory) {

        - [ ] should get voter with address if in whitelist
        - [ ] should not get voter is not in whitelist

    - function getOneProposal(uint256 _id) external view onlyVoters returns (Proposal memory) {

        - [ ] should get proposal with id if in whitelist
        - [ ] should not get proposal with id if not in whitelist


2. describe("Check owner features (except workflow status)")

- function addVoter(address _addr) external onlyOwner {
    - require(workflowStatus == WorkflowStatus.RegisteringVoters, "Voters registration is not open yet");
    - require(voters[_addr].isRegistered != true, "Already registered");

    - emit VoterRegistered(_addr);

    - [ ] should be able to add voter and emit VoterRegistered
    - [ ] should not be able to add voter if not owner => VOIR MESSAGE D'ERREUR RENDU PAR Ownable
    - [ ] should not be able to add voter if not workflow status not in registering phase => "Voters registration is not open yet"
    - [ ] should not be able to add voter if not owner if voter already in whitelist => "Already registered"

- function tallyVotes() external onlyOwner {
    - require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Current status is not voting session ended");

    - emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);

    - [ ] should be able to tally vote & emit WorkflowStatusChange event
    - [ ] should not be able to tally vote if not owner => VOIR MESSAGE D'ERREUR RENDU PAR Ownable
    - [ ] should not be able to tally vote if not in end voting phase => VOIR MESSAGE D'ERREUR RENDU PAR Ownable

3. describe("Check voters features")

- function addProposal(string calldata _desc) external onlyVoters {
    - require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "Proposals are not allowed yet");
    - require(keccak256(abi.encode(_desc)) != keccak256(abi.encode("")), "Vous ne pouvez pas ne rien proposer");

    - emit ProposalRegistered(proposalsArray.length - 1);

    - [ ] should be able to add proposal if user in whitelist & emit ProposalRegistered event
    - [ ] should not be able to add proposal if user not in whitelist => "You're not a voter"
    - [ ] should not be able to add proposal if workflow status not in proposal registration phase => "Proposals are not allowed yet"
    - [ ] should not be able to add proposal if proposal is empty => "Vous ne pouvez pas ne rien proposer"

- function setVote(uint256 _id) external onlyVoters {
    - require(workflowStatus == WorkflowStatus.VotingSessionStarted, "Voting session havent started yet");
    - require(voters[msg.sender].hasVoted != true, "You have already voted");
    - require(_id < proposalsArray.length, "Proposal not found");

    - emit Voted(msg.sender, _id);

    - [ ] should be able to vote & emit Voted event
    - [ ] should not be able to vote if user not in whitelist => "You're not a voter"
    - [ ] should not be able to vote if not in start voting phase => "Voting session havent started yet"
    - [ ] should not be able to vote if voter has already voted =>  "You have already voted"
    - [ ] should not be able to vote if for an unfound proposal => "Proposal not found"

4. describe("Check workflow status")

- function startProposalsRegistering() external onlyOwner {
    - require(workflowStatus == WorkflowStatus.RegisteringVoters, "Registering proposals cant be started now");

    - emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);

    - [ ] should be able to start registering proposal phase & emit WorkflowStatusChange
    - [ ] should not be able to start registering proposal phase if not owner => VOIR MESSAGE D'ERREUR RENDU PAR Ownable
    - [ ] should not be able to start registering proposal phase if not in registering voters phase => "Registering proposals cant be started now"

- function endProposalsRegistering() external onlyOwner {
	- require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "Registering proposals havent started yet");

    - emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);

    - [ ] should be able to end registering proposal phase & emit WorkflowStatusChange
    - [ ] should not be able to end registering proposal phase if not owner => VOIR MESSAGE D'ERREUR RENDU PAR Ownable
    - [ ] should not be able to end registering proposal phase if not in start registering proposal phase => "Registering proposals havent started yet"

- function startVotingSession() external onlyOwner {
    - require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, "Registering proposals phase is not finished");

    - emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);

    - [ ] should be able to start voting session & emit WorkflowStatusChange event
    - [ ] should not be able to start voting phase if not owner => VOIR MESSAGE D'ERREUR RENDU PAR Ownable
    - [ ] should not be able to start voting phase if not in end registering proposal phase => "Registering proposals phase is not finished"

- function endVotingSession() external onlyOwner {
    - require(workflowStatus == WorkflowStatus.VotingSessionStarted, "Voting session havent started yet");

    - emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);

    - [ ] should be able to end voting phase & emit WorkflowStatusChange event
    - [ ] should not be able to end voting phase if not owner => VOIR MESSAGE D'ERREUR RENDU PAR Ownable
    - [ ] should not be able to end voting phase if not in start voting phase => VOIR MESSAGE D'ERREUR RENDU PAR Ownable

